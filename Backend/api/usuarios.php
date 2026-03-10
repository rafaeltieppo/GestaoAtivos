<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $input['nome'] ?? '';
    $email = $input['email'] ?? '';
    $senha = $input['senha'] ?? '';
    $perfil = $input['perfil'] ?? 'usuario';

    if (!$nome || !$email || !$senha) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Nome, e-mail e senha são obrigatórios']);
        exit;
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nome, $email, $senhaHash, $perfil);
    $stmt->execute();

    echo json_encode([
        'sucesso' => $stmt->affected_rows > 0,
        'mensagem' => $stmt->affected_rows > 0 ? 'Usuário criado com sucesso' : 'Erro ao criar usuário'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, nome, email, perfil FROM usuarios";
    $result = $conn->query($sql);
    $usuarios = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($usuarios);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = $input['id'] ?? 0;
    $nome = $input['nome'] ?? '';
    $email = $input['email'] ?? '';
    $senha = $input['senha'] ?? '';
    $perfil = $input['perfil'] ?? 'usuario';

    if (!$id || !$nome || !$email) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'ID, nome e e-mail são obrigatórios']);
        exit;
    }

    if ($senha) {
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
        $sql = "UPDATE usuarios SET nome=?, email=?, senha=?, perfil=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssi", $nome, $email, $senhaHash, $perfil, $id);
    } else {
        $sql = "UPDATE usuarios SET nome=?, email=?, perfil=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $nome, $email, $perfil, $id);
    }

    $stmt->execute();
    echo json_encode([
        'sucesso' => $stmt->affected_rows >= 0,
        'mensagem' => 'Usuário atualizado'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $input['id'] ?? 0;

    if (!$id) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'ID obrigatório']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM usuarios WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode([
        'sucesso' => $stmt->affected_rows > 0,
        'mensagem' => $stmt->affected_rows > 0 ? 'Usuário excluído' : 'Erro ao excluir usuário'
    ]);
    exit;
}
?>
