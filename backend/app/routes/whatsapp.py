from fastapi import APIRouter, Form
from ..agents import decidir_resposta
from .. import stores
from ..evolution import send_text, configure_evolution, set_webhook

router = APIRouter()

@router.post("/whatsapp/webhook")
def webhook_whatsapp(
    numero_remetente: str = Form(..., alias="From"),
    mensagem_recebida: str = Form("", alias="Body"),
):
    resposta_agente = decidir_resposta(mensagem_recebida)
    stores.add_event(
        "twilio_in",
        f"De {numero_remetente}: {mensagem_recebida}",
        {"from": numero_remetente, "body": mensagem_recebida},
    )

    destino = numero_remetente.replace("whatsapp:", "").strip()
    envio = send_text(to=destino, text=resposta_agente)
    stores.add_event(
        "twilio_out",
        f"Para {destino}: {resposta_agente}",
        {"to": destino, "reply": resposta_agente, "send": envio},
    )

    return {"processed": True, "to": destino, "send_result": envio}

@router.post("/evolution/webhook")
def evolution_webhook(payload: dict):
    data = payload.get("data") or {}
    # Evolution can send either data.message or data.messages[0]
    msg = data.get("message") or {}
    if not msg:
        msgs = data.get("messages") or []
        if isinstance(msgs, list) and msgs:
            msg = msgs[0] or {}

    texto = ""
    if isinstance(msg.get("extendedTextMessage"), dict):
        texto = str((msg.get("extendedTextMessage") or {}).get("text") or "")
    if not texto and isinstance(msg.get("conversation"), str):
        texto = str(msg.get("conversation") or "")
    if not texto and isinstance(msg.get("imageMessage"), dict):
        texto = str((msg.get("imageMessage") or {}).get("caption") or "")
    if not texto and isinstance(msg.get("videoMessage"), dict):
        texto = str((msg.get("videoMessage") or {}).get("caption") or "")

    key = data.get("key") or {}
    if not key and isinstance(msg, dict):
        key = msg.get("key") or {}
    remote = str(key.get("remoteJid") or "")
    participant = str(key.get("participant") or "")

    jid = participant or remote
    numero = jid.split("@")[0] if jid else ""

    if not numero or not texto:
        stores.add_event(
            "evolution_skip",
            "Ignorado: falta número ou texto",
            {"payload": payload},
        )
        return {"processed": False, "reason": "missing_number_or_text"}

    resposta = decidir_resposta(texto)
    stores.add_event(
        "evolution_in",
        f"De {numero}: {texto}",
        {"from": numero, "text": texto},
    )
    envio = send_text(to=numero, text=resposta)
    stores.add_event(
        "evolution_out",
        f"Para {numero}: {resposta}",
        {"to": numero, "reply": resposta, "send": envio},
    )
    return {"processed": True, "to": numero, "send_result": envio}


@router.post("/evolution/setup")
def evolution_setup(payload: dict):
    base = str(payload.get("base") or "").strip()
    apikey = str(payload.get("apikey") or "").strip()
    session = str(payload.get("session") or "").strip()
    public_url = str(payload.get("publicUrl") or "").strip()

    cfg = configure_evolution(base or None, apikey or None, session or None)
    stores.add_event(
        "evolution_cfg",
        "Configuração aplicada",
        {"base": base, "hasKey": bool(apikey), "session": session},
    )
    webhook = {}
    if public_url:
        webhook = set_webhook(url=f"{public_url.rstrip('/')}/evolution/webhook")
        stores.add_event(
            "evolution_webhook",
            "Webhook solicitado",
            {"publicUrl": public_url, "result": webhook},
        )
    return {"configured": cfg, "webhook": webhook}
