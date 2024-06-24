# CME System - Centro de Materiais e Esterilização

Este é um sistema de gerenciamento de materiais e esterilização construído com Django no backend e React no frontend.

## Pré-requisitos

- Python 3.8 ou superior
- Node.js e npm

## Instruções de Instalação

### Clone o repositório

git clone https://github.com/ThiagoBritoo/cme_system

cd cme_system

### Crie e ative um ambiente virtual

python -m venv venv

venv\Scripts\activate

### Instale as dependências do backend e aplique as migrações

pip install -r requirements.txt

python manage.py migrate

### Inicie o servidor de desenvolvimento

python manage.py runserver

O servidor estará rodando em http://localhost:8000.

### Navegue até o diretório do frontend e Instale as dependências 

cd frontend/sterilization-process

npm install

### Inicie o servidor de desenvolvimento do React

npm start

#### Acesse a aplicação React em http://localhost:3000.

Funcionalidades
    
    Gerenciamento de materiais e seus tipos.
    Registro e rastreamento dos estágios de esterilização dos materiais.
    Relatórios em PDF para materiais concluídos.
    Relatórios em Excel para falhas ocorridas.
    
Tecnologias Utilizadas

    Backend: Django, Django REST Framework
    Frontend: React
    Banco de dados: SQLite



