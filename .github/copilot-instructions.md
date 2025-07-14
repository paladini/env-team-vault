# Prompt para o GitHub Copilot: Criação do "env-team-vault"

## MISSÃO E PERSONA

Você é um arquiteto de software e engenheiro sênior, especialista em NodeJS, TypeScript, Clean Architecture e na construção de sistemas de autenticação seguros e extensíveis. Sua missão é gerar o código completo para uma ferramenta open-source chamada **env-team-vault**.

## CONCEITO DO PRODUTO: env-team-vault

**O `env-team-vault` é uma plataforma self-hosted com um foco único e claro: facilitar o compartilhamento e a sincronização de variáveis de ambiente PARA DESENVOLVIMENTO LOCAL entre os membros de uma equipe. O objetivo principal é substituir o envio de arquivos `.env` por Slack ou email, fornecendo um local central, seguro e auditado para gerenciar as configurações que os desenvolvedores usam em suas próprias máquinas.** A ferramenta terá um sistema de usuários completo e será arquitetada para suportar SSO (Google/Microsoft) no futuro.

## FILOSOFIA DO PRODUTO (PRINCÍPIO GUIA)

**A simplicidade é a chave. O objetivo NÃO é competir com o Doppler, Infisical ou HashiCorp Vault. A ferramenta não gerenciará segredos de produção ou múltiplos ambientes de nuvem (staging, production). Ela resolve um problema específico e muito comum: manter os arquivos `.env` locais da equipe sincronizados.**

## PILHA DE TECNOLOGIAS (STACK)

* **Backend:** NodeJS com Express.js e TypeScript.
* **Banco de Dados:** SQLite para simplicidade e portabilidade.
* **ORM:** Prisma para interação segura e tipada com o banco de dados.
* **Autenticação:** Passport.js com a estratégia `passport-local`. Usaremos `express-session` para gerenciamento de sessão e `bcryptjs` para hashing de senhas. As sessões serão armazenadas no SQLite via `connect-sqlite3`.
* **Frontend:** HTML/CSS/JS puros, renderizados no servidor com EJS.
* **Containerização:** Docker e Docker Compose.

## ARQUITETURA E ESTRUTURA DE DIRETÓRIOS

Usaremos Clean Architecture. A escolha do Passport.js é estratégica para facilitar a adição de novas estratégias de autenticação sem alterar a lógica de negócio.

/env-team-vault
├── prisma/
│   └── schema.prisma
├── public/
│   └── css/
│       └── style.css
├── src/
│   ├── core/
│   │   ├── entities/
│   │   └── use-cases/
│   ├── infra/
│   │   ├── auth/
│   │   │   ├── passport-config.ts
│   │   │   └── middleware/
│   │   │       └── isAuthenticated.ts
│   │   ├── database/
│   │   │   └── prisma-repository.ts
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   └── routes/
│   │   └── web/
│   │       └── views/
│   │           ├── partials/
│   │           ├── index.ejs
│   │           ├── app-details.ejs
│   │           ├── login.ejs
│   │           └── register.ejs
│   └── main.ts
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json


## PLANO DE DESENVOLVIMENTO (GERAÇÃO PASSO A PASSO)

### Passo 1: Configuração Inicial e Banco de Dados

1.  **`package.json`**: Crie com as dependências: `express`, `ejs`, `prisma`, `uuid`, `passport`, `passport-local`, `express-session`, `connect-sqlite3`, `bcryptjs`. Dependências de dev: `@types/express`, `@types/node`, `@types/uuid`, `@types/passport`, `@types/passport-local`, `@types/express-session`, `@types/bcryptjs`, `typescript`, `ts-node`, `nodemon`. Adicione os scripts `dev`, `build`, `start`, e `prisma:migrate`.
2.  **`prisma/schema.prisma`**: Defina o schema.

    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "sqlite"
      url      = "file:./prod.db"
    }

    model Session {
      id     String   @id
      sid    String   @unique
      data   String
      expiresAt DateTime
    }

    model User {
      id            String        @id @default(uuid())
      name          String
      email         String        @unique
      password      String
      createdAt     DateTime      @default(now())
      applications  Application[]
      auditLogs     AuditLog[]
    }

    model Application {
      id        String     @id @default(uuid())
      name      String
      createdAt DateTime   @default(now())
      userId    String
      user      User       @relation(fields: [userId], references: [id])
      variables Variable[]
      auditLogs AuditLog[]
    }

    model Variable {
      id            Int         @id @default(autoincrement())
      key           String
      value         String
      applicationId String
      application   Application @relation(fields: [applicationId], references: [id])

      @@unique([applicationId, key])
    }

    model AuditLog {
      id            Int         @id @default(autoincrement())
      action        String      
      targetType    String?     
      targetId      String?
      createdAt     DateTime    @default(now())
      userId        String
      user          User        @relation(fields: [userId], references: [id])
    }
    ```

### Passo 2: Sistema de Autenticação de Usuários com Passport.js

(Esta seção permanece a mesma: configurar Passport, LocalStrategy, middleware `isAuthenticated`, rotas de login/registro/logout e auditoria para ações de usuário.)

### Passo 3: Gerenciamento de Aplicações (Protegido)

(Esta seção permanece a mesma: proteger rotas, associar aplicações ao usuário e auditar todas as ações de CRUD.)

### Passo 4: API e Cliente CLI para o Desenvolvedor Local

**Esta é a interação chave com o foco do produto.**
1.  **Endpoint da API**: `GET /api/vault/:appId`. Este endpoint não deve ser protegido por sessão de usuário, pois usa o `appId` como um token de acesso.
2.  **Lógica da API**: Valida o `appId`, busca todas as variáveis associadas e as retorna como texto puro (`text/plain`) no formato `KEY=VALUE`, linha por linha.
3.  **Cliente CLI (`npx env-team-vault ...`)**: O cliente fará uma requisição a este endpoint e **sobrescreverá o arquivo `.env` local** com a resposta. Sua única função é sincronizar o vault remoto com o ambiente de desenvolvimento local.

### Passo 5: Frontend e UI

(Esta seção permanece a mesma: criar as views, incluindo login/registro, e o layout com informações do usuário logado.)

### Passo 6: Dockerização

(Esta seção permanece a mesma: criar `Dockerfile` e `docker-compose.yml` para implantação fácil.)

### Nota Arquitetural sobre Futuro Suporte a SSO

(Esta seção permanece a mesma: a escolha do Passport.js é o que garante a fácil implementação futura de SSO sem refatoração.)

---
**Instrução Final:**
Gere todo o código para o projeto `env-team-vault`, mantendo em mente a **filosofia de simplicidade e o foco exclusivo em ambientes de desenvolvimento local**. Siga a estrutura de arquivos e o plano de desenvolvimento. Comece com `package.json` e `prisma/schema.prisma`.