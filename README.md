# Aplica-o-Web-Simples-com-Cont-ineres-e-Ansible
Aplicação Web Simples com Contêineres e Ansible, Projeto final da Matéria de infraestrutura e serviços web

Objetivo do Projeto: Desenvolver uma aplicação web simples com arquitetura de microserviços, utilizando contêineres para isolar os componentes da aplicação e Ansible para automatizar o deployment e a configuração.

Componentes do Projeto:

1. Frontend: Interface de usuário construída com uma tecnologia web moderna, servida por um servidor web em um contêiner.

2. Backend: API REST desenvolvida em uma linguagem de programação de sua escolha, em um contêiner separado.

3. Banco de Dados: Contêiner com um banco de dados para armazenar os dados da aplicação.

4. Rede: Todos os contêineres devem estar na mesma rede, permitindo a comunicação entre eles. Apenas o contêiner do frontend deve ter portas expostas ao hospedeiro.

Requisitos do Projeto:
- Utilizar Podman ou Docker para criar e gerenciar os contêineres.
- Configurar o Ansible para automatizar o processo de deployment da aplicação.
- Implementar um playbook Ansible para o deployment.
- Seguir as melhores práticas de segurança para os contêineres.

Entregáveis:
- Dockerfile/Containerfile para cada componente da aplicação (frontend, backend, banco de dados).
- Playbook Ansible para o deployment da aplicação.
- Documentação do projeto, incluindo instruções de uso e descrição da arquitetura.

Cronograma:
- Data de Entrega: 17 de junho.
- Apresentações (Defesas do Projeto): A partir de 17 de junho, por ordem de sorteio.

Avaliação:
O projeto será avaliado com base nos seguintes critérios:
- Correta implementação dos contêineres e uso de Podman/Docker.
- Eficiência e organização do playbook Ansible.
- Adesão às melhores práticas de segurança.
- Qualidade da documentação.
