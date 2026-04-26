# Fase 3: Base para Escala

## Objetivo

Preparar o produto para crescer com mais operacao, mais perfis e caminho claro para multi-tenant, sem trocar a arquitetura inteira.

## Decisoes principais

### Perfis e permissao

- `UserRole` foi expandido para `VIEWER`, `VOLUNTEER`, `EDITOR`, `MANAGER` e `ADMIN`.
- A autorizacao agora fica centralizada em [`lib/auth/roles.ts`](/home/limax44/PromorarConectado/lib/auth/roles.ts).
- O backoffice aceita `EDITOR+`.
- Atualizacao operacional de reports exige `MANAGER+`.

### Multi-tenant incremental

- Foram adicionados `Organization` e `Community`.
- As entidades principais receberam `organizationId` e `communityId` opcionais.
- Isso preserva compatibilidade com o MVP e evita migracao forcada em todo o produto agora.
- O caminho futuro e tornar o tenant obrigatorio por modulo, conforme o produto ganhar mais organizacoes.

### Governanca de reports

- `Report` agora guarda:
  - responsavel (`assignedToUserId`)
  - contato do morador
  - flags de notificacao
  - datas operacionais (`relevantUpdatedAt`, `lastActivityAt`, `lastStatusChangedAt`)
  - janelas simples de SLA
- Timeline foi desacoplada em tabelas auxiliares:
  - `ReportComment`
  - `ReportActivity`
  - `NotificationDelivery`

Essa separacao evita inflar a tabela principal e abre caminho para historico, auditoria e notificacao assicrona.

### Escala operacional

- Busca textual, filtros e paginação foram centralizados na camada de dados.
- Admin e publico passaram a usar metadados de paginação.
- Listagens foram reorganizadas para priorizar `lastActivityAt` e `relevantUpdatedAt`.

## O que ficou pronto agora

- Base de permissao hierarquica
- Base de tenant organizacao/comunidade
- Timeline de report
- Fila de notificacao preparada
- Paginação real e busca textual
- Filtros mais fortes no admin
- Seed com dados coerentes para testar a nova arquitetura

## O que ficou preparado para depois

- Escopo por tenant em toda query e sessao
- gerenciamento de usuarios e perfis no UI
- envio real por email/WhatsApp
- workers/filas de notificacao
- testes de integracao de timeline/notificacao

## Caminho recomendado das proximas iteracoes

1. Tornar `organizationId` obrigatorio nas entidades operacionais.
2. Adicionar tenant na sessao/autenticacao.
3. Criar tela de usuarios e atribuicao de perfis.
4. Plugar worker de envio para `NotificationDelivery`.
5. Cobrir `lib/reports.ts`, auth e APIs de report com testes.
