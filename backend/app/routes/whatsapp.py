from fastapi import APIRouter, Form
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse
from ..agents import decidir_resposta

router = APIRouter()

@router.post("/whatsapp/webhook")
def webhook_whatsapp(
    numero_remetente: str = Form(..., alias="From"),
    mensagem_recebida: str = Form("", alias="Body"),
):
    resposta_agente = decidir_resposta(mensagem_recebida)

    resposta_twiml = MessagingResponse()
    resposta_twiml.message(resposta_agente)

    return Response(str(resposta_twiml), media_type="application/xml")
