from fastapi import FastAPI
from app.routes.whatsapp import router as whatsapp_router
from app.agents import decidir_resposta

app = FastAPI()

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
