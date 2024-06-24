# Documentação

## Visão Geral
Este projeto consiste em uma aplicação simples destinada ao registro e listagem de compras. O sistema permite aos usuários cadastrar novas compras e visualizar uma lista de compras já cadastradas. A aplicação é construída utilizando uma stack moderna e robusta que inclui Docker, Docker Compose, Nginx, Ansible e Node.js.

## Tecnologias
### Docker
Utilizamos Docker para containerizar e gerenciar os componentes da nossa aplicação de maneira isolada e eficiente.

### Docker Compose
O Docker Compose é utilizado para definir e orquestrar os múltiplos containers necessários para a aplicação, facilitando o gerenciamento de serviços como o servidor web Nginx e o servidor de aplicação Node.js.

### Nginx
Nginx atua como servidor web e proxy reverso, encarregado de receber as requisições HTTP e encaminhá-las para o servidor de aplicação Node.js. Ele também serve o conteúdo estático da aplicação, como HTML, CSS e JavaScript.

### Ansible
Ansible é utilizado para automatizar a configuração do ambiente de produção, garantindo que todas as dependências e configurações sejam uniformemente aplicadas em todos os ambientes de implantação.

### Node.js
Node.js é o ambiente de execução do lado do servidor que gerencia a lógica de backend, interações com o banco de dados e tratamento de rotas e requisições HTTP.

### PostgreSQL
PostgreSQL é o nosso serviço de banco de dados onde vai armazenar as informações cadastradas.

## Infraestrutura

