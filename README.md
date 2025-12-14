# Olga — Plataforma de Gestão Agrícola

Manual de execução e teste para a banca. Este repositório contém:
- Backend FastAPI (Python) em `backend/`
- Frontend React + Vite (TypeScript) em `frontend/`

A autenticação é simples (em memória) e o Dashboard exibe dados de clima (demo) e um bloco de Satélite com NDVI (demo) dos últimos 14 dias.

## Estrutura
- `backend/app/main.py` — Rotas FastAPI (auth, dashboard, comunidade, etc.)
- `backend/app/stores.py` — "banco" em memória e geradores de dados (inclui NDVI demo)
- `backend/requirements.txt` — dependências do backend
- `backend/Dockerfile` — imagem pronta para deploy (honra env `PORT`)
- `render.yaml` — configuração para deploy do backend no Render
- `frontend/src` — código React
- `frontend/vite.config.ts` — configuração do Vite

## Requisitos
- Node 18+ e npm
- Python 3.11+

Opcional (para produção/containers):
- Docker
- Conta no Render (backend) e Vercel (frontend)

---

## Rodando Localmente (Desenvolvimento)

### 1) Backend (porta 8000)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Healthcheck: http://localhost:8000/health

### 2) Frontend (porta 3000)
```bash
cd frontend
npm i
npm run dev
```
Por padrão o frontend chama `http://localhost:8000` (padrão de `VITE_API_BASE`).

Se quiser apontar para outro backend:
```bash
# macOS/Linux
export VITE_API_BASE="https://sua-api"
npm run dev
```

---

## Fluxo de Teste (banca)
1) Abra o frontend (http://localhost:3000). A aplicação abre na tela de Login.
2) Clique em "Criar conta" e cadastre nome, e‑mail e senha.
3) Após o cadastro, o login é feito automaticamente. O token fica salvo no `localStorage`.
4) Você verá o Dashboard com:
   - Bloco Satélite (NDVI 14 dias, variação 7d, qualidade e insights)
   - Eventos em tempo real (exibe logs do backend)
   - Botões de culturas cadastradas para detalhes
   - To‑dos e Clima da semana
5) Use o botão "Sair" no topo para encerrar a sessão (limpa o token).

Observação: os dados são em memória (não persistem após reiniciar o backend).

---

## Endpoints Principais
- `GET /health` — Status do backend (`backend/app/main.py`)
- Autenticação:
  - `POST /auth/signup` — cria usuário (nome, e‑mail, senha)
  - `POST /auth/login` — retorna token de sessão
  - `GET /auth/me?token=...` — valida token
- Dashboard:
  - `GET /dashboard` — retorna dados gerais, incluindo `satellite` com NDVI demo
  - `POST /dashboard/todo/toggle` — alterna conclusão de um to‑do do dia
- Eventos:
  - `GET /events` — lista eventos (logs breves)
  - `DELETE /events` — limpa eventos
- Comunidade (exemplos):
  - `GET/POST /community/forum`
  - `GET/POST /community/resources`
  - `GET/POST /community/market`

Referências no código:
- NDVI demo: `backend/app/stores.py:get_satellite_context`
- Rota do Dashboard: `backend/app/main.py:get_dashboard`

---

## Variáveis de Ambiente
- Frontend:
  - `VITE_API_BASE` — URL base da API (ex.: `https://olga-backend.onrender.com`). Padrão: `http://localhost:8000`.
- Backend (opcionais, apenas se for usar integrações reais):
  - `OPENAI_API_KEY`, `OPENAI_MODEL` (em `backend/app/agents.py`)
  - `EVOLUTION_API_BASE`, `EVOLUTION_API_KEY`, `EVOLUTION_SESSION` (em `backend/app/evolution.py`)

Nada sensível é obrigatório para rodar o demo.

---

## Docker (backend)
Build e execução local (usa `PORT=8000` por padrão):
```bash
cd backend
docker build -t olga-backend .
docker run -e PORT=8000 -p 8000:8000 olga-backend
```
Teste: http://localhost:8000/health

---

## Deploy de Produção

### Backend — Render
1) Conecte o repositório no Render.
2) O Render detecta `render.yaml` e cria um serviço Web com root `backend/`.
3) Healthcheck: `/health`.
4) Após deploy, anote a URL (ex.: `https://olga-backend.onrender.com`).

### Frontend — Vercel
1) Conecte o diretório `frontend/` no projeto Vercel.
2) Configure a env `VITE_API_BASE` com a URL do backend publicado.
3) Build Command: `npm run build`
4) Output: `build` (Vite já configura em `vite.config.ts`).

---

## Dicas de Troubleshooting
- 404/Erro CORS: confirme `VITE_API_BASE` e se o backend está acessível.
- Login falha: usuários não persistem; crie uma conta nova após reiniciar o backend.
- Porta ocupada: altere a porta do frontend em `vite.config.ts` ou rode `uvicorn` em outra porta e ajuste `VITE_API_BASE`.

---

## Créditos Técnicos
- FastAPI, Uvicorn (backend)
- React, Vite, TypeScript, Tailwind (frontend)

Este manual cobre o fluxo completo para a banca testar autenticação, Dashboard e NDVI demo.
