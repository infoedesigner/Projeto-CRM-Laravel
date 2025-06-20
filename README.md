# 📊 Projeto CRM Financeiro – Laravel

Sistema de gerenciamento de relacionamento com clientes (CRM) voltado para controle financeiro, desenvolvido com o framework **Laravel**.

Desenvolvedor: André Luiz de Souza Silveira

---

## 🚀 Requisitos

- PHP >= 8.1
- Composer
- MySQL ou PostgreSQL
- Node.js e NPM
- Laravel CLI
- (Opcional) Docker

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/infoedesigner/Projeto-CRM-Laravel.git

cd Projeto-CRM-Laravel

# Instale as dependências do PHP
composer install

# Instale dependências front-end
npm install && npm run dev

# Copie o arquivo de ambiente e configure
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate

# Configure o banco de dados no .env e execute as migrações
php artisan migrate --seed
