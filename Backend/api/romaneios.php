<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $numero_projeto = $input['numero_projeto'] ?? '';
    $cliente = $input['cliente'] ?? '';
    $responsavel = $input['responsavel'] ?? '';
    $ativos = $input['ativos'] ?? [];
    $status = 'em_obra';

    if (!$numero_projeto || !$cliente || !$responsavel || !is_array($ativos) || count($ativos) === 0) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Campos obrigatórios: numero_projeto, cliente, responsavel e ativos']);
        exit;
    }

    // Validar que ativos não estão em movimentação pendente ou em romaneio em_obra
    $ativos_invalidos = [];
    foreach ($ativos as $a) {
        $codigo = intval(is_array($a) ? ($a['codigo'] ?? 0) : $a);

        // verifica movimentação pendente
        $stmtMov = $conn->prepare("SELECT id FROM movimentacoes WHERE codigo_ativo = ? AND status = 'pendente' LIMIT 1");
        $stmtMov->bind_param("i", $codigo);
        $stmtMov->execute();
        $stmtMov->store_result();
        if ($stmtMov->num_rows > 0) {
            $ativos_invalidos[] = $codigo;
            continue;
        }

        // verifica se ativo já está em outro romaneio em_obra
        $stmtRom = $conn->prepare("
            SELECT r.id
            FROM romaneios r
            JOIN romaneio_itens ri ON r.id = ri.romaneio_id
            WHERE ri.codigo_ativo = ? AND r.status = 'em_obra'
            LIMIT 1
        ");
        $stmtRom->bind_param("i", $codigo);
        $stmtRom->execute();
        $stmtRom->store_result();
        if ($stmtRom->num_rows > 0) {
            $ativos_invalidos[] = $codigo;
        }
    }

    if (count($ativos_invalidos) > 0) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Ativos não disponíveis: ' . implode(', ', $ativos_invalidos)]);
        exit;
    }

    // Inserir romaneio
    $stmt = $conn->prepare("INSERT INTO romaneios (numero_projeto, cliente, responsavel, status, data_romaneio) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssss", $numero_projeto, $cliente, $responsavel, $status);
    if (!$stmt->execute()) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao criar romaneio: ' . $stmt->error]);
        exit;
    }
    $romaneio_id = $stmt->insert_id;

    // Inserir itens do romaneio
    $stmtItem = $conn->prepare("INSERT INTO romaneio_itens (romaneio_id, codigo_ativo) VALUES (?, ?)");
    foreach ($ativos as $a) {
        $codigo = intval(is_array($a) ? ($a['codigo'] ?? 0) : $a);
        $stmtItem->bind_param("ii", $romaneio_id, $codigo);
        $stmtItem->execute();
    }

    echo json_encode(['sucesso' => true, 'mensagem' => 'Romaneio criado com sucesso', 'romaneio_id' => $romaneio_id]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = intval($input['id'] ?? 0);
    $numero_projeto = $input['numero_projeto'] ?? '';
    $cliente = $input['cliente'] ?? '';
    $responsavel = $input['responsavel'] ?? '';
    $status = $input['status'] ?? '';

    if (!$id || !$numero_projeto || !$cliente || !$responsavel || !$status) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Campos obrigatórios: id, numero_projeto, cliente, responsavel, status']);
        exit;
    }

    // Se status for devolvido, atualiza data_retorno = NOW(); caso contrário limpa data_retorno
    if ($status === 'devolvido') {
        $stmt = $conn->prepare("UPDATE romaneios SET numero_projeto = ?, cliente = ?, responsavel = ?, status = ?, data_retorno = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->bind_param("ssssi", $numero_projeto, $cliente, $responsavel, $status, $id);
    } else {
        $stmt = $conn->prepare("UPDATE romaneios SET numero_projeto = ?, cliente = ?, responsavel = ?, status = ?, data_retorno = NULL WHERE id = ?");
        $stmt->bind_param("ssssi", $numero_projeto, $cliente, $responsavel, $status, $id);
    }

    if (!$stmt->execute()) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao atualizar romaneio: ' . $stmt->error]);
        exit;
    }

    // buscar romaneio atualizado e devolver para o frontend
    $stmtSel = $conn->prepare("SELECT * FROM romaneios WHERE id = ?");
    $stmtSel->bind_param("i", $id);
    $stmtSel->execute();
    $romaneio = $stmtSel->get_result()->fetch_assoc();

    echo json_encode(['sucesso' => true, 'mensagem' => 'Romaneio atualizado', 'romaneio' => $romaneio]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = intval($_GET['id'] ?? 0);

    if ($id) {
        // detalhe
        $stmt = $conn->prepare("SELECT * FROM romaneios WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $romaneio = $stmt->get_result()->fetch_assoc();

        $stmtAtivos = $conn->prepare("SELECT a.codigo, a.nome, a.descricao FROM romaneio_itens ri JOIN ativos a ON ri.codigo_ativo = a.codigo WHERE ri.romaneio_id = ?");
        $stmtAtivos->bind_param("i", $id);
        $stmtAtivos->execute();
        $ativos = $stmtAtivos->get_result()->fetch_all(MYSQLI_ASSOC);

        echo json_encode(['romaneio' => $romaneio, 'ativos' => $ativos]);
        exit;
    } else {
        $res = $conn->query("SELECT * FROM romaneios ORDER BY data_romaneio DESC");
        $romaneios = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($romaneios);
        exit;

        $res = $conn->query("SELECT * FROM romaneios ORDER BY data_romaneio DESC");
        $romaneios = $res->fetch_all(MYSQLI_ASSOC);
    }
}

echo json_encode(['sucesso' => false, 'mensagem' => 'Método não suportado']);
