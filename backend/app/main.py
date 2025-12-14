from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.whatsapp import router as whatsapp_router
from app.agents import decidir_resposta
from app import stores

app = FastAPI()

# CORS (dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(whatsapp_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/decide")
def decide(data: dict):
    mensagem_usuario = str(data.get("texto") or data.get("text") or data.get("message") or "")
    resposta_agente = decidir_resposta(mensagem_usuario)

    return {
        "status": "received",
        "data": data,
        "reply": resposta_agente
    }

@app.get("/dashboard")
def get_dashboard():
    return stores.get_dashboard_data()

@app.post("/dashboard/todo/toggle")
def toggle_dashboard_todo(payload: dict):
    try:
        index = int(payload.get("index", -1))
    except (TypeError, ValueError):
        index = -1
    stores.toggle_todo_today(index)
    return stores.get_dashboard_data()

@app.get("/planning/suggestions")
def planning_suggestions():
    return stores.get_planning_suggestions()

@app.get("/planning/active")
def planning_active():
    return stores.get_planning_active()

@app.get("/community/forum")
def community_forum():
    return stores.get_forum()

@app.get("/community/resources")
def community_resources():
    return stores.get_resources()

@app.get("/community/market")
def community_market():
    return stores.get_market()
