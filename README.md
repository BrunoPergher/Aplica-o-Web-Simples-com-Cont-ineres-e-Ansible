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
O playbook deploy.yml é utilizado para configurar e gerenciar o stack Docker de uma aplicação, garantindo a instalação correta das dependências e a execução adequada dos serviços. Ele gerencia tanto a configuração inicial quanto operações contínuas como atualizações e verificações de saúde. O deploy.yml que o ansible é responsavel por rodar é dividido em Tasks e handles, onde vou explicar a importancia de cada um deles a seguir pelo nome da task/handle:

## Tasks
### Backup current docker-compose state
**Função**: Esta tarefa cria um backup do arquivo de configuração atual do Docker Compose usando o comando docker-compose config. Este arquivo é redirecionado para um novo arquivo definido pela variável backup_compose_file.
**Importância**: Essencial para a recuperação rápida em caso de falhas durante a atualização ou modificação dos serviços, permitindo restaurar a configuração anterior.

### Generate .env file
**Função**: Gera um arquivo .env a partir de um template env.j2. Este arquivo contém variáveis de ambiente necessárias para o projeto.
**Importância**: As variáveis de ambiente são cruciais para configurar aspectos do aplicativo que variam entre ambientes, como credenciais de banco de dados ou URLs de API. Usar um template permite personalização e segurança.
**Detalhe importante:** No projeto temos um arquivo chamado secrets.yml nele foi declarado as variaveis de ambiente e criptografado com o ansible-vault, e declarando uma chave secreta assim para rodar o ansible é necessario saber a chave secreta.

### Check if Docker is installed
Função: Executa o comando docker --version para verificar se o Docker está instalado no sistema.
Importância: Garante que o Docker, uma dependência crítica para o funcionamento dos contêineres, está disponível antes de tentar operações que o requerem.

###  Install Docker if not present
**Função**: Instala o Docker usando o gerenciador de pacotes apt caso não esteja presente (condição verificada pela task anterior).
**Importância**: Automatiza a resolução de dependências, simplificando o setup inicial e garantindo que todos os ambientes de deployment estejam corretamente configurados.

### Check if Docker Compose is installed
**Função**: Similar à verificação do Docker, esta tarefa verifica a instalação do Docker Compose.
**Importância**: Docker Compose é crucial para gerenciar múltiplos contêineres como um único serviço, facilitando a orquestração dos componentes da aplicação.

### Install Docker Compose if not present
**Função**: Instala o Docker Compose se necessário.
**Importância**: Assegura que a ferramenta necessária para iniciar e gerenciar os serviços definidos no docker-compose.yml está disponível.

### Start Docker Compose services
**Função**: Inicia todos os serviços definidos no arquivo docker-compose.yml com o comando up -d, que os executa em modo 'detached'.
**Importância**: Esta é a tarefa que efetivamente coloca a aplicação em funcionamento, iniciando os contêineres necessários para a operação da mesma.

### Conditionally restart Docker services if .env changed
**Função**: Reinicia os serviços usando docker-compose up -d --force-recreate se o arquivo .env foi alterado.
**Importância**: Garante que quaisquer mudanças críticas nas configurações do ambiente sejam aplicadas aos serviços, reiniciando-os para pegar as novas configurações.

### Capture logs of all containers
**Função**: Captura logs de todos os contêineres utilizando o comando docker-compose logs.
**Importância**: Fundamental para diagnóstico e monitoramento, permitindo uma rápida intervenção em caso de erros ou comportamentos inesperados.

### Health check for Docker containers
**Função:** Executa um script (`check_health.sh`) que verifica a saúde dos contêineres, assegurando que estão todos em execução.
**Importância:** Vital para manutenção da integridade operacional, pois permite identificar e tratar rapidamente contêineres que não estejam funcionando como esperado.

## Handles
### Restart services if .env changed
Função: Reinicia os serviços Docker através do comando docker-compose restart. Este handler é chamado quando o arquivo .env é modificado, garantindo que as novas variáveis de ambiente sejam aplicadas.
Importância: Essencial para assegurar que quaisquer mudanças no arquivo de configuração do ambiente sejam refletidas nos serviços em execução sem a necessidade de reiniciar todo o sistema manualmente.

### Docker installation completed
Função: Exibe uma mensagem indicando que a instalação do Docker foi concluída com sucesso.
Importância: Fornece feedback visual no log de execução do playbook, útil para verificação e diagnósticos durante a instalação ou manutenção.

### Docker Compose installation completed
Função: Exibe uma mensagem informando que o Docker Compose foi instalado corretamente.
Importância: Similar ao handler anterior, ajuda na verificação do processo de instalação e assegura que as ferramentas necessárias estão prontas para uso.

### Print backup completion
Função: Exibe uma mensagem confirmando que o backup da configuração do Docker Compose foi realizado com sucesso.
Importância: Garante que o administrador do sistema esteja ciente de que o estado anterior da configuração foi salvo, permitindo uma recuperação rápida em caso de falhas subsequentes.

### Verify services
Função: Executa o comando docker-compose ps para verificar o estado dos serviços gerenciados pelo Docker Compose.
Importância: Permite monitorar se todos os serviços estão em execução conforme esperado e identificar rapidamente quaisquer problemas.

### Print container logs
Função: Exibe os logs coletados dos contêineres Docker, utilizando as informações registradas na variável docker_logs.
Importância: Fornece uma visão detalhada das atividades dos contêineres, essencial para diagnóstico de problemas e monitoramento do comportamento da aplicação.

### Print health check results
Função: Exibe os resultados da verificação de saúde dos contêineres, usando as saídas registradas na variável health_check.
Importância: Informa sobre o estado operacional dos contêineres, crucial para garantir que a aplicação esteja funcional e responder prontamente a quaisquer falhas.

### Rollback if deployment failed
Função: Executa um comando docker-compose up -d usando o arquivo backup_compose_file para restaurar os contêineres à sua configuração anterior se o deployment atual falhar.
Importância: Um mecanismo de segurança crítico que permite ao sistema retornar rapidamente a um estado conhecido e estável em caso de erros no deployment atual.

### Print rollback result
Função: Exibe uma mensagem indicando que o rollback foi iniciado devido à falha no deployment.
Importância: Fornece confirmação visual de que o processo de rollback foi acionado, ajudando na compreensão das ações do sistema durante falhas.

