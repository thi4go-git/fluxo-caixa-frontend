# Fluxo de Caixa Frontend

Frontend Angular do sistema de fluxo de caixa. A aplicacao permite autenticar usuarios, consultar dashboards, gerenciar lancamentos financeiros e manter naturezas de lancamento.

## Tecnologias

- Angular 16
- Angular CLI 16
- TypeScript 4.9
- RxJS
- Angular Material
- Bootstrap 5
- ngx-mask
- Chart.js
- JWT com `@auth0/angular-jwt`
- Nginx para servir o build em ambiente Docker

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Angular CLI 16, opcional para uso global

Versoes usadas localmente neste projeto:

```bash
node --version
npm --version
```

## Instalacao

Na raiz do projeto, instale as dependencias:

```bash
npm install
```

## Execucao local

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

Ou:

```bash
npx ng serve
```

Acesse:

```text
http://localhost:4200
```

Por padrao, a rota inicial redireciona para:

```text
/graficos/dashboard-metabase
```

Caso o usuario nao esteja autenticado, o guard redireciona para:

```text
/login
```

## Build

Para gerar o build de producao:

```bash
npm run build
```

Os arquivos gerados ficam em:

```text
dist/fluxo-caixa-frontend
```

## Testes

Para executar os testes unitarios com Karma/Jasmine:

```bash
npm test
```

## Docker

O projeto possui `Dockerfile`, `docker-compose.yml` e configuracao customizada do Nginx.

Fluxo comum:

```bash
npm run build
docker build -t fluxo-caixa-frontend:latest .
docker-compose up -d
```

Com o `docker-compose.yml` atual, a aplicacao fica disponivel em:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
src/
  app/
    componentes/      Componentes compartilhados de tela, como layout, loading e dialogs
    guardiao/         Guards de rota, incluindo validacao de autenticacao
    interceptors/     Interceptors HTTP, incluindo injecao do token JWT
    model/            DTOs e modelos usados nas chamadas da API
    modulos/          Modulos funcionais da aplicacao
    pipes/            Pipes de formatacao
    services/         Servicos responsaveis por comunicacao com backend e estado auxiliar
  environments/       Configuracoes de API, token e versao
```

## Modulos principais

- `CoreModule`: modulo central da aplicacao. Declara componentes globais, importa os modulos principais e registra providers/interceptors.
- `SharedModule`: concentra imports compartilhados, como Forms, ReactiveForms, Angular Material, Router e ngx-mask.
- `LoginModule`: tela e fluxo de autenticacao.
- `LancamentoModule`: listagem, cadastro, edicao, exclusao, upload/download de anexos e operacoes sobre lancamentos.
- `NaturezaModule`: cadastro, listagem e exclusao de naturezas.
- `GraficosModule`: dashboards da aplicacao, incluindo dashboard embarcado do Metabase.
- `TemplateModule`: componentes visuais de cabecalho, menu e rodape.

## Rotas principais

```text
/login
/graficos/dashboard
/graficos/dashboard-metabase
/lancamento/listagem
/lancamento/listagem/:id
/lancamento/formulario
/naturezas/lista
/naturezas/formulario
```

As rotas de `graficos`, `lancamento` e `naturezas` sao protegidas pelo `authGuard`.

## Autenticacao

O login e feito atraves do servico `AutenticacaoService`, que solicita um token ao endpoint configurado em:

```text
src/environments/apiEnvironment.ts
```

Quando o login ocorre com sucesso, a resposta e salva no `localStorage` com a chave:

```text
access_token
```

O `TokenInterceptor` adiciona automaticamente o header abaixo nas chamadas HTTP, exceto na chamada de obtencao do token:

```text
Authorization: Bearer <token>
```

## Configuracao de ambiente

As principais configuracoes estao em:

```text
src/environments/apiEnvironment.ts
```

Campos principais:

- `apiUrl`: URL base da API backend.
- `tokenUrl`: URL para obtencao do token de autenticacao.
- `versao`: versao exibida na aplicacao.
- `cli_id`: client id usado na autenticacao.
- `cli_secret`: client secret usado na autenticacao.

Atencao: qualquer valor colocado no frontend fica exposto no bundle gerado pelo Angular. Em ambiente de producao, evite armazenar segredos sensiveis diretamente no codigo do frontend.

## Pipeline

O arquivo `Jenkinsfile` descreve um pipeline com as etapas:

1. Instalacao de dependencias.
2. Build Angular.
3. Analise SonarQube.
4. Quality Gate.
5. Build da imagem Docker.
6. Deploy com Docker Compose.
7. Limpeza de cache Docker.

## Scripts disponiveis

```bash
npm start
npm run build
npm run watch
npm test
```

## Observacoes

- O projeto usa Angular 16 conforme o `package.json`.
- O build padrao do Angular esta configurado como `production`.
- O servidor de desenvolvimento usa a configuracao `development`.
- O Nginx esta configurado com fallback para `index.html`, necessario para rotas SPA do Angular.
