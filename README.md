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
A infraestrutura da aplicação consiste em três serviços principais: frontend, backend e banco de dados, todos orquestrados pelo Docker Compose. Cada serviço é encapsulado em um contêiner Docker e todos os contêineres compartilham uma rede comum chamada **pergher**. Apenas o frontend é acessível externamente através de uma porta exposta. Agora vou explicar mais detalhadamente cada parte dessa iinfraestrutura.

### FrontEnd
**Tecnologia**: Nginx
**Dockerfile**: Baseado na imagem nginx:1.16.0-alpine. O diretório de trabalho é configurado para /usr/share/nginx/html e o conteúdo estático é servido a partir daqui.
Configuração: O nginx.conf é ajustado para servir páginas estáticas e rotear solicitações para o backend através de um proxy dentro no ngnx.conf.
Portas: O serviço expõe a porta 3000 externamente, mapeada para a porta 80 do contêiner.
Volumes: Um volume é montado para sincronizar o diretório local ./frontend com o diretório de trabalho no contêiner, permitindo atualizações dinâmicas do conteúdo estático.

### Backend
Tecnologia: Node.js
Dockerfile: Usa a imagem base node:20. Os pacotes são instalados com npm install e o comando npm run start é usado para iniciar o servidor.
Dependências: Dependente do serviço de banco de dados estar saudável antes de iniciar, através do health check dentro do compose.
Rede: Parte da rede pergher, mas sem portas expostas externamente, acessível apenas internamente dentro da rede.

### Banco De Dados
Tecnologia: PostgreSQL (imagem postgres:alpine)
Configuração: Usa um arquivo de ambiente .env (arquivo esse gerado pelo ansible usando ansible-vault) para configurações como usuário, senha e nome do banco de dados. Um script de schema (schema.sql) é montado para inicializar o banco de dados.
Health Check: Configurado para verificar se o banco de dados está pronto para conexões antes de considerar o serviço como saudável.
Portas: A porta 5432 é exposta, permitindo conexões ao banco de dados.

## Ansible
