Sistema de Gestão de Ativos

Sistema desenvolvido para controle de ativos e equipamentos utilizados em projetos e obras, permitindo registrar movimentações, gerar romaneios e acompanhar a disponibilidade dos equipamentos.

📋 Sobre o Projeto

Este sistema foi criado com o objetivo de organizar e controlar os ativos de uma empresa, evitando perdas, duplicidade de uso e falta de rastreabilidade dos equipamentos.

A aplicação permite cadastrar ativos, criar romaneios de saída para projetos, controlar o status de uso e registrar a devolução dos equipamentos.

O sistema também indica automaticamente quando um ativo está disponível ou em movimentação, impedindo que ele seja utilizado em dois romaneios ao mesmo tempo.

⚙️ Funcionalidades

Cadastro de ativos

Listagem e gerenciamento de ativos

Controle de disponibilidade automática

Criação de romaneios para envio de equipamentos

Associação de múltiplos ativos a um romaneio

Controle de status do romaneio:

Em obra

Devolvido

Registro automático de data de retorno

Exportação de romaneios em CSV

Interface para seleção de ativos com busca visual

🖥️ Tecnologias Utilizadas

Frontend

React

Bootstrap

CSS

Backend

PHP

API REST

Banco de Dados

MySQL

🗄️ Estrutura do Banco

Principais tabelas do sistema:

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

Essa estrutura permite controlar quais ativos estão vinculados a cada romaneio e verificar se estão disponíveis.

🔄 Funcionamento da Disponibilidade

A disponibilidade de um ativo é verificada automaticamente através das movimentações.

Se existir uma movimentação com status pendente, o ativo é considerado:

não disponível

Caso contrário:

disponível

Isso evita que um ativo seja selecionado em dois romaneios ao mesmo tempo.

📤 Exportação de Dados

O sistema permite gerar arquivos CSV contendo:

Número do projeto

Cliente

Responsável

Data de saída

Ativos vinculados ao romaneio

Isso facilita a integração com planilhas ou sistemas externos.
