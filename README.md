# LojaCarro - Frontend

Telas da LojaCarro em Angular 22. Visual em vermelho e branco, com o catalogo publico, o agendamento de test drive e o
painel do administrador.

Autor: Jose Augusto

A API fica no repositorio `lojacarro` (Spring Boot, porta 8080).

## Como rodar

Com a API rodando:

```bash
npm install
npm start
```

Abre em http://localhost:4200. O `proxy.conf.json` manda tudo que comeca com `/api` para http://localhost:8080.

No Docker o nginx faz o mesmo papel (`nginx.conf`). Para subir tudo junto use o `docker-compose.yml` do repositorio
`lojacarro`.

Para gerar a versao de producao: `npx ng build` (sai em `dist/lojacarro-web/browser`).

## Telas

| Rota | Tela | Quem acessa |
|---|---|---|
| `/` | inicio com os destaques | todo mundo |
| `/veiculos` | catalogo com busca e filtros | todo mundo |
| `/veiculos/:id` | detalhes com as fotos | todo mundo |
| `/veiculos/:id/agendar` | escolher dia e horario livre | logado |
| `/meus-agendamentos` | meus test drives, com cancelar | logado |
| `/login` e `/cadastro` | entrar e criar conta | todo mundo |
| `/admin` | painel: visao geral, veiculos, agendamentos, vendas, contabilidade e administradores | administrador |

## Organizacao

```
src/app
  models/        interfaces do que vem da API (Veiculo, Agendamento, Usuario...)
  services/      chamadas para a API, login (AuthService) e avisos
  guards/        authGuard (precisa estar logado) e adminGuard (precisa ser administrador)
  interceptors/  tokenInterceptor: coloca o token em toda requisicao e desloga quando vem 401
  components/    cartao do veiculo e o "carregando"
  pages/         uma pasta para cada tela
  app.routes.ts  as rotas com os guards
```

O visual todo esta no `src/styles.css`, com as cores em variaveis (`--vermelho`, `--preto`...).

O token do login fica no `localStorage`. O guard so esconde a tela, quem realmente barra e a API (401 sem token e 403
com perfil errado).

## Testes

```bash
npx ng test --watch=false
```

19 testes com Vitest: catalogo, formulario de login, validacao da foto no cadastro de veiculo, servico de veiculos,
tela de agendamento, meus agendamentos, guards, interceptor e AuthService.

Com cobertura: `npx ng test --watch=false --coverage` (relatorio em `coverage/lojacarro-web/index.html`).
