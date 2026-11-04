# LojaCarro - Frontend

Telas da LojaCarro em Angular 22.

Autor: Jose Augusto

O front conversa com duas APIs:

- `lojacarro` (porta 8080): carros e auditoria
- `lojacarro-usuarios-api` (porta 8081): usuarios

## Como rodar

Com as duas APIs rodando:

```bash
npm install
npm start
```

Abre em http://localhost:4200. O `proxy.conf.json` manda `/loja-api` para a porta 8080 e `/usuarios-api` para a
8081.

No Docker o nginx faz o mesmo papel (`nginx.conf`). Para subir tudo junto use o `docker-compose.yml` do
repositorio da LojaCarro.

## Telas

- Usuarios: cadastro de usuarios (so GERENTE altera)
- Carros, Vendas, Test Drive e Contabilidade: cadastro de cada modulo (precisa escolher um usuario no topo)
- ADM: cadastro de administradores e o botao "Buscar logs", que pede as ultimas operacoes para o modulo de log
  pelo RabbitMQ
- Auditoria: registros das operacoes

O usuario escolhido no topo vai no header `X-Usuario-Id` de todas as requisicoes. Cada requisicao tambem leva um
`X-Request-Id`, que aparece no console do navegador e nos logs das APIs.
