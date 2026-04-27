# Promorar Conectado

Portal comunitário com área pública e painel administrativo para avisos, eventos, demandas do território e comunicação local.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL

## Setup local

1. Instale as dependências:

```bash
npm install
```

2. Crie o `.env` a partir do exemplo:

```bash
cp .env.example .env
```

3. Preencha pelo menos:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_DEFAULT_PASSWORD`
- `ASSISTANT_DEFAULT_PASSWORD`
- `NEXT_PUBLIC_APP_URL`

4. Gere o Prisma Client:

```bash
npm run prisma:generate
```

5. Aplique as migrations locais:

```bash
npm run prisma:migrate -- --name init
```

6. Rode o seed demo uma vez:

```bash
npm run prisma:seed
```

7. Suba o projeto:

```bash
npm run dev
```

## Variáveis de ambiente

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="troque-por-uma-chave-longa-e-segura-com-pelo-menos-32-caracteres"
ADMIN_DEFAULT_PASSWORD="defina-uma-senha-segura-para-o-admin"
ASSISTANT_DEFAULT_PASSWORD="defina-uma-senha-segura-para-o-assistente"
NEXT_PUBLIC_APP_URL="https://seu-dominio.vercel.app"
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run auth:check`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run prisma:seed`
- `npm run prisma:studio`

## Credenciais iniciais do admin

- Email: `admin@isam.org`
- Senha inicial: vem de `ADMIN_DEFAULT_PASSWORD`

Troque a senha padrão imediatamente após o primeiro login em produção. A senha definida em `ADMIN_DEFAULT_PASSWORD` não deve permanecer como credencial final do ambiente produtivo.

## Seed de produção

Rode o seed apenas uma vez no ambiente de produção:

```bash
npx prisma db seed
```

O seed foi ajustado para não duplicar os dados demo persistidos no banco:

- admin
- organização base
- avisos demo
- eventos demo
- demandas demo

Os apoiadores demo atuais são conteúdo estático do frontend, então não há duplicação de registros no banco para essa parte.

## Segurança de produção

- Gere um `JWT_SECRET` forte com:

```bash
openssl rand -base64 32
```

- Cookies de sessão já estão configurados com:
  - `httpOnly`
  - `secure` em produção
  - `sameSite=lax`
  - `path=/`
- `/admin` exige sessão válida.
- APIs administrativas exigem sessão válida.
- `.env` e arquivos equivalentes não devem ir para o GitHub.

## Deploy em produção

1. Subir no GitHub

```bash
git init
git add .
git commit -m "Initial production version"
git branch -M main
git remote add origin https://github.com/Javax092/portalisam.git
git push -u origin main
```

2. Criar banco PostgreSQL na Railway

- Crie um novo projeto na Railway.
- Adicione um serviço PostgreSQL.
- Copie a `DATABASE_URL` fornecida pela Railway.

3. Configurar a URL do banco

- Use a URL do PostgreSQL da Railway em:
  - `DATABASE_URL`
- Se a URL interna da Railway não funcionar na Vercel, use a URL pública do banco.

4. Importar o repositório na Vercel

- Importe o repositório GitHub.
- Selecione o framework `Next.js`.
- `Root Directory`: deixe como `.` porque o `package.json` está na raiz deste repositório.
- Se no painel da Vercel o projeto tiver sido apontado para uma subpasta por engano, ajuste o `Root Directory` para a pasta que contém `package.json`, `app/` e `prisma/`.
- Use `npm run build` como build command.
- Mantenha o output padrão do Next.js.

5. Configurar variáveis na Vercel

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_DEFAULT_PASSWORD`
- `ASSISTANT_DEFAULT_PASSWORD`
- `NEXT_PUBLIC_APP_URL`

6. Rodar migrations em produção

Opção A, com a `DATABASE_URL` de produção no terminal local:

```bash
npx prisma migrate deploy
```

Opção B, usando o script do projeto:

```bash
npm run prisma:deploy
```

7. Rodar seed de produção uma única vez

```bash
npx prisma db seed
```

8. Fazer o deploy

- Depois das variáveis configuradas e migrations aplicadas, conclua o deploy na Vercel.

## Railway PostgreSQL

1. Criar novo projeto na Railway.
2. Adicionar PostgreSQL.
3. Copiar a `DATABASE_URL`.
4. Usar essa URL na Vercel como:
   - `DATABASE_URL`

Se a URL interna da Railway não funcionar na Vercel, use a URL pública do banco.

## Vercel

1. Importar o repositório GitHub na Vercel.
2. Framework: `Next.js`.
3. Build command:

```bash
npm run build
```

4. Output: padrão do Next.js.
5. Variáveis obrigatórias:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_DEFAULT_PASSWORD`
- `ASSISTANT_DEFAULT_PASSWORD`
- `NEXT_PUBLIC_APP_URL`

Observações importantes para evitar `404` em produção:

- Não use `localhost` em variáveis públicas de produção.
- Não dependa do `.env` local na Vercel; configure as variáveis no painel do projeto.
- As rotas públicas `/`, `/portal`, `/reports`, `/report` e `/login` possuem fallback visual e não devem depender do banco para abrir.
- O `middleware` protege apenas `/admin` e `/api/admin`.

6. Depois do deploy, rodar migration de produção:

```bash
npx prisma migrate deploy
```

ou

```bash
npm run prisma:deploy
```

## Verificação antes do deploy

```bash
npm install
npm run lint
npx prisma generate
npm run build
```

- admin@isam.org ADMIN
- assistente@isam.org ASSISTANT
