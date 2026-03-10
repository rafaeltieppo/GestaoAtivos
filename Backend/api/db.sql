CREATE DATABASE IF NOT EXISTS ativos_db;

USE ativos_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin','funcionario') DEFAULT 'funcionario'
);

CREATE TABLE ativos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo INT UNIQUE NOT NULL,
    descricao VARCHAR(200) NOT NULL
);

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_ativo INT NOT NULL,                                      
    funcionario_responsavel VARCHAR(100) NOT NULL,
    data_saida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_devolucao TIMESTAMP DEFAULT NULL,
    status ENUM('pendente', 'devolvido') DEFAULT 'pendente',
    FOREIGN KEY (codigo_ativo) REFERENCES ativos(codigo)
);

CREATE TABLE romaneios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_projeto INT NOT NULL,
    cliente VARCHAR(255) NOT NULL,
    responsavel VARCHAR(100) NOT NULL,
    data_romaneio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    data_retorno TIMESTAMP NULL DEFAULT NULL;
);

CREATE TABLE romaneio_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    romaneio_id INT NOT NULL,
    codigo_ativo INT NOT NULL,
    FOREIGN KEY (romaneio_id) REFERENCES romaneios(id),
    FOREIGN KEY (codigo_ativo) REFERENCES ativos(codigo)
);

