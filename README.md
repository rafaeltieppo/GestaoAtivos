Sistema de Gestão de Ativos

Sistema desenvolvido para controle de ativos utilizados em projetos e obras, permitindo registrar movimentações, gerar romaneios e acompanhar a disponibilidade dos equipamentos.

📋 Sobre o Projeto

Este sistema foi criado com o objetivo de organizar e controlar os ativos da empresa na qual trabalho, evitando perdas, conflitos de uso e falta de rastreabilidade dos equipamentos.

A aplicação permite cadastrar ativos, criar romaneios de saída para projetos, associar equipamentos aos romaneios e acompanhar o status de utilização.

Também foi implementada uma lógica para verificar automaticamente se um ativo está disponível ou em movimentação, impedindo que ele seja utilizado em mais de um romaneio ao mesmo tempo.

⚙️ Funcionalidades

Cadastro de ativos

Listagem e gerenciamento de ativos

Criação de romaneios

Associação de múltiplos ativos a um romaneio

Controle de status do romaneio

Controle automático de disponibilidade dos ativos

Registro de data de retorno

Exportação de romaneios em CSV

Interface para seleção de ativos

🏗️ Arquitetura do Sistema

O sistema foi desenvolvido utilizando uma arquitetura frontend + backend + banco de dados, separados para facilitar a manutenção e organização do projeto.

Frontend

O frontend foi desenvolvido utilizando React, responsável pela interface do usuário e interação com o sistema.

Funções do frontend:

Formulários de cadastro e edição

Listagem de ativos

Listagem de romaneios

Seleção de ativos para romaneios

Comunicação com a API backend via requisições HTTP

Tecnologias utilizadas:

React

JavaScript

Bootstrap

CSS

Backend

O backend foi desenvolvido em PHP, funcionando como uma API REST que recebe requisições do frontend e processa os dados.

Responsabilidades do backend:

Processar regras de negócio

Gerenciar romaneios e ativos

Controlar disponibilidade dos equipamentos

Manipular dados no banco

Retornar respostas em formato JSON

Principais endpoints da API:

/api/ativos.php
/api/romaneios.php
/api/movimentacoes.php
Banco de Dados

O banco de dados utilizado foi MySQL, executado localmente através do XAMPP.

O banco armazena:

Ativos cadastrados

Romaneios

Itens de cada romaneio

Movimentações dos ativos

Principais tabelas:

ativos

id

codigo

nome

descricao

romaneios

id

numero_projeto

cliente

responsavel

data_romaneio

data_retorno

status

romaneio_itens

id

romaneio_id

codigo_ativo

movimentacoes

id

codigo_ativo

status

🔄 Controle de Disponibilidade

A disponibilidade de um ativo é verificada automaticamente com base nas movimentações registradas no sistema.

Se existir uma movimentação com status pendente, o ativo é considerado não disponível.

Caso contrário, o ativo é considerado disponível.

Isso impede que um mesmo ativo seja selecionado em mais de um romaneio ao mesmo tempo.

💻 Ambiente de Desenvolvimento

Ferramentas utilizadas no desenvolvimento do projeto:

React

PHP

MySQL

XAMPP (Apache + MySQL)

Visual Studio Code
