<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
include 'conexao.php'; 

$input = json_decode(file_get_contents('php://input'), true);
$nome = $input['nome'] ?? '';
$senha = $input['senha'] ?? '';

if (!$nome || !$senha) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Nome e senha obrigatórios']);
    exit;
}

$sql = "SELECT * FROM usuarios WHERE nome=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nome);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    $user = $res->fetch_assoc();
    if (password_verify($senha, $user['senha'])) {
        echo json_encode([
            'sucesso' => true,
            'usuario' => [
                'nome' => $user['nome'],
                'perfil' => $user['perfil']
            ]
        ]);
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Senha incorreta']);
    }
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Usuário não encontrado']);
}
?>
