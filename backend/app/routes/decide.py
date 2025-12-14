from fastapi import APIRouter
from pydantic import BaseModel
from agent import decidir_resposta

router = APIRouter()

class EntradaDecisao(BaseModel):
    texto: str = ""

class SaidaDecisao(BaseModel):
    resposta: str

@router.post("/decide", response_model=SaidaDecisao)
def decidir(entrada_decisao: EntradaDecisao):
    resposta_agente = decidir_resposta(entrada_decisao.texto)
    return SaidaDecisao(resposta=resposta_agente)
