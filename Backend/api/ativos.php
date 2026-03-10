<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'conexao.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    // Criar ativo
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nome = $input['nome'] ?? '';
        $codigo = $input['codigo'] ?? '';
        $descricao = $input['descricao'] ?? '';

        if (!$nome || !$codigo || !$descricao) {
            echo json_encode(['sucesso' => false, 'mensagem' => 'Nome, código e descrição são obrigatórios']);
            exit;
        }

        $sql = "INSERT INTO ativos (nome, codigo, descricao) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sis", $nome, $codigo, $descricao);
        $stmt->execute();

        echo json_encode([
            'sucesso' => $stmt->affected_rows > 0,
            'mensagem' => $stmt->affected_rows > 0 ? 'Ativo cadastrado' : 'Erro ao cadastrar ativo'
        ]);
        exit;
    }

    // Atualizar ativo
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $id = $input['id'] ?? 0;
        $nome = $input['nome'] ?? '';
        $codigo = $input['codigo'] ?? '';
        $descricao = $input['descricao'] ?? '';

        if (!$id || !$nome || !$codigo || !$descricao) {
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID, nome, código e descrição são obrigatórios']);
            exit;
        }

        $sql = "UPDATE ativos SET nome = ?, codigo = ?, descricao = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sisi", $nome, $codigo, $descricao, $id);
        $stmt->execute();

        echo json_encode([
            'sucesso' => $stmt->affected_rows >= 0,
            'mensagem' => 'Ativo atualizado'
        ]);
        exit;
    }

    // Deletar ativo
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $id = $input['id'] ?? 0;

        if (!$id) {
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID é obrigatório']);
            exit;
        }

        $sql = "DELETE FROM ativos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        echo json_encode([
            'sucesso' => $stmt->affected_rows > 0,
            'mensagem' => $stmt->affected_rows > 0 ? 'Ativo removido' : 'Ativo não encontrado'
        ]);
        exit;
    }

    // Listar ativos
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $sql = "SELECT a.*,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM movimentacoes m
                WHERE m.codigo_ativo = a.codigo
                AND m.status = 'pendente'
            )
            THEN 'não disponível'
            ELSE 'disponível'
        END AS disponibilidade
        FROM ativos a
        ORDER BY a.id DESC";
        $result = $conn->query($sql);
        $ativos = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($ativos, JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['mensagem' => 'Método não suportado']);

} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>
