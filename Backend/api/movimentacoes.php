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

// POST: Registrar movimentação
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo_ativo = intval($input['codigo_ativo'] ?? 0);
    $funcionario_responsavel = $input['funcionario_responsavel'] ?? '';
    $status = $input['status'] ?? 'pendente';
    $projeto = $input['projeto'] ?? '';

    if (!$codigo_ativo || !$funcionario_responsavel) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Campos obrigatórios: codigo_ativo e funcionario_responsavel']);
        exit;
    }

    // Verifica se ativo existe
    $stmtCheck = $conn->prepare("SELECT id FROM ativos WHERE codigo = ?");
    $stmtCheck->bind_param("i", $codigo_ativo);
    $stmtCheck->execute();
    $stmtCheck->store_result();
    if ($stmtCheck->num_rows === 0) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Ativo não cadastrado!']);
        exit;
    }

    // Verifica se ativo está em algum romaneio em obra
    $stmtRom = $conn->prepare("
        SELECT r.id 
        FROM romaneios r 
        JOIN romaneio_itens ri ON r.id = ri.romaneio_id
        WHERE ri.codigo_ativo = ? AND r.status = 'em_obra'
    ");
    $stmtRom->bind_param("i", $codigo_ativo);
    $stmtRom->execute();
    $stmtRom->store_result();
    if ($stmtRom->num_rows > 0) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Ativo em obra!']);
        exit;
    }

    // Verifica se ativo está em movimentação pendente
    $stmtMov = $conn->prepare("SELECT id FROM movimentacoes WHERE codigo_ativo = ? AND status = 'pendente'");
    $stmtMov->bind_param("i", $codigo_ativo);
    $stmtMov->execute();
    $stmtMov->store_result();
    if ($stmtMov->num_rows > 0) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Ativo em uso!']);
        exit;
    }

    // Inserir movimentação
    $stmtInsert = $conn->prepare("INSERT INTO movimentacoes (codigo_ativo, funcionario_responsavel, status, projeto) VALUES (?, ?, ?, ?)");
    $stmtInsert->bind_param("isss", $codigo_ativo, $funcionario_responsavel, $status, $projeto);
    $stmtInsert->execute();

    echo json_encode([
        'sucesso' => $stmtInsert->affected_rows > 0,
        'mensagem' => $stmtInsert->affected_rows > 0 ? 'Movimentação registrada' : 'Erro ao registrar movimentação'
    ]);
    exit;
}

// PUT: Atualizar movimentação
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $input['id'] ?? 0;
    $codigo_ativo = $input['codigo_ativo'] ?? '';
    $funcionario_responsavel = $input['funcionario_responsavel'] ?? '';
    $status = $input['status'] ?? 'pendente';
    $projeto = $input['projeto'] ?? ''; 

    if (!$id || !$codigo_ativo || !$funcionario_responsavel) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Campos obrigatórios: id, codigo_ativo, tipo, funcionario_responsavel']);
        exit;
    }

    // Se o status for 'devolvido', atualiza data_devolucao com CURRENT_TIMESTAMP
    
    if ($status === 'devolvido') {
        $sql = "UPDATE movimentacoes 
                SET status = ?, data_devolucao = CURRENT_TIMESTAMP 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $status, $id);
    } else {
        $sql = "UPDATE movimentacoes 
                SET codigo_ativo = ?, funcionario_responsavel = ?, status = ? , projeto = ?
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isssi", $codigo_ativo, $funcionario_responsavel, $status, $projeto, $id);
    }

    $stmt->execute();

    echo json_encode([
        'sucesso' => $stmt->affected_rows >= 0,
        'mensagem' => 'Movimentação atualizada'
    ]);
    exit;
}

// GET: Listar movimentações
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT m.id,
                   m.funcionario_responsavel, 
                   m.data_saida, 
                   m.data_devolucao, 
                   m.status,
                   m.projeto,
                   a.descricao AS descricao,
                   a.codigo AS codigo_ativo
            FROM movimentacoes m
            JOIN ativos a ON m.codigo_ativo = a.codigo
            ORDER BY m.data_saida DESC";
    $result = $conn->query($sql);
    $movs = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($movs);
    exit;
}
?>
