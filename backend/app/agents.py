import os
from dotenv import load_dotenv
try:
    from openai import OpenAI  # type: ignore
except Exception:  # openai may not be installed in dev
    OpenAI = None  # type: ignore

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY", "").strip()
openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip()

openai_client = None
if OpenAI and openai_api_key:
    try:
        openai_client = OpenAI(api_key=openai_api_key)
    except Exception:
        openai_client = None


def decidir_resposta(mensagem_usuario: str) -> str:
    mensagem_normalizada = normalizar_mensagem(mensagem_usuario)

    if not mensagem_normalizada:
        return "Me manda sua dúvida em 1 frase (ex: praga no feijão, quando plantar milho, preço do tomate)."

    agente_selecionado = selecionar_agente(mensagem_normalizada)

    if openai_client is None:
        # fallback seguro se a chave não estiver no ambiente
        return resposta_fallback_sem_ai(agente_selecionado)

    return responder_com_ai(
        mensagem_usuario=mensagem_usuario,
        agente_selecionado=agente_selecionado,
    )


def selecionar_agente(mensagem_normalizada: str) -> str:
    palavras_mercado = ["preço", "preco", "vender", "comprar", "ceasa", "mercado", "demanda", "valor", "quanto tá"]
    palavras_planejamento = ["planejar", "cronograma", "época", "epoca", "quando plantar", "plantio", "colheita", "adubar", "adubação"]
    palavras_agronomo = ["praga", "fungo", "lagarta", "pulg", "mancha", "doença", "doenca", "seca", "chuva", "murcha", "irrig", "irrigação"]

    if contem_alguma_palavra_chave(mensagem_normalizada, palavras_mercado):
        return "mercado"
    if contem_alguma_palavra_chave(mensagem_normalizada, palavras_planejamento):
        return "planejamento"
    if contem_alguma_palavra_chave(mensagem_normalizada, palavras_agronomo):
        return "agronomo"

    return "agronomo"


def responder_com_ai(mensagem_usuario: str, agente_selecionado: str) -> str:
    system_prompt = montar_system_prompt(agente_selecionado)

    if not openai_client:
        return resposta_fallback_sem_ai(agente_selecionado)

    resposta = openai_client.responses.create(
        model=openai_model,
        input=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": mensagem_usuario},
        ],
    )

    texto_resposta = extrair_texto_resposta(resposta)

    if not texto_resposta:
        return "Não entendi. Me diga: qual cultura e sua cidade/UF?"

    return texto_resposta


def montar_system_prompt(agente_selecionado: str) -> str:
    regras_base = (
        "Você é um agente via WhatsApp para agricultores familiares do Brasil.\n"
        "Responda em português simples, curto e direto (máximo 6 linhas).\n"
        "Não invente dados: nada de preço real, clima real, doses, nomes de agrotóxicos.\n"
        "Se faltar informação, faça no máximo 2 perguntas objetivas.\n"
        "Se o usuário pedir veneno/dosagem, recuse e oriente procurar um agrônomo local; foque em identificação e manejo geral.\n"
        "Sempre que possível, peça: cultura e cidade/UF.\n"
    )

    if agente_selecionado == "agronomo":
        return regras_base + (
            "Papel: AGRÔNOMO.\n"
            "Objetivo: identificar problema e orientar ações gerais seguras.\n"
            "Se for praga/doença: peça cultura + sintomas (cor, onde aparece, se tem inseto).\n"
            "Se for água/clima: peça cultura + se tem irrigação + solo seco/encharcado.\n"
        )

    if agente_selecionado == "planejamento":
        return regras_base + (
            "Papel: PLANEJAMENTO.\n"
            "Objetivo: dar um micro-plano em 3 passos (preparo / plantio / manejo) sem datas exatas.\n"
            "Peça cultura + cidade/UF + tamanho aproximado da área + objetivo (consumo/venda).\n"
        )

    if agente_selecionado == "mercado":
        return regras_base + (
            "Papel: MERCADO.\n"
            "Objetivo: orientar venda/posicionamento sem preço real.\n"
            "Peça cidade/UF e produto.\n"
            "Sugira 2 canais de venda (feira/cooperativa/CEASA local) e faça 2 perguntas para ajustar.\n"
        )

    return regras_base


def resposta_fallback_sem_ai(agente_selecionado: str) -> str:
    if agente_selecionado == "mercado":
        return "Mercado: qual produto e sua cidade/UF? Posso sugerir canais (feira, cooperativa, CEASA local)."
    if agente_selecionado == "planejamento":
        return "Planejamento: qual cultura, sua cidade/UF e tamanho da área? Eu monto um micro-plano em 3 passos."
    return "Agrônomo: qual cultura e sua cidade/UF? Descreva o que você está vendo na planta (mancha, cor, inseto, murcha)."


def normalizar_mensagem(mensagem_usuario: str) -> str:
    return (mensagem_usuario or "").strip().lower()


def contem_alguma_palavra_chave(mensagem_normalizada: str, lista_palavras_chave: list[str]) -> bool:
    return any(palavra_chave in mensagem_normalizada for palavra_chave in lista_palavras_chave)


def extrair_texto_resposta(resposta_openai) -> str:
    try:
        return (resposta_openai.output_text or "").strip()
    except Exception:
        return ""


def gerar_sugestoes_ai(contexto: dict) -> list[dict]:
    base = [
        {"crop": "Brócolis", "emoji": "🥦", "score": 92, "reason": "Solo adequado e demanda local", "yield": "12-15 ton/ha", "revenue": "R$ 18-22k", "water": "Médio", "cycle": "70-90 dias", "difficulty": "Fácil"},
        {"crop": "Espinafre", "emoji": "🌿", "score": 88, "reason": "Baixa água e boa aceitação", "yield": "8-10 ton/ha", "revenue": "R$ 12-15k", "water": "Baixo", "cycle": "40-50 dias", "difficulty": "Fácil"},
    ]
    prompt_user = str(contexto.get("prompt") or "").strip()
    if openai_client is None or not prompt_user:
        cidade = str(contexto.get("city") or "").strip()
        uf = str(contexto.get("state") or "").strip()
        motivo = ", ".join([p for p in [cidade, uf] if p])
        if motivo:
            for s in base:
                s["reason"] = s["reason"] + f" • {motivo}"
        return base

    system = (
        "Gere de 2 a 3 sugestões de culturas para pequenos produtores no Brasil. "
        "Responda em JSON puro, como uma lista, sem texto fora do JSON. "
        "Cada item deve conter as chaves: crop, emoji, score, reason, yield, revenue, water, cycle, difficulty. "
        "score é inteiro 0-100. Não invente dados reais de preço; mantenha valores genéricos."
    )
    try:
        resp = openai_client.responses.create(
            model=openai_model,
            input=[{"role": "system", "content": system}, {"role": "user", "content": prompt_user}],
        )
        txt = extrair_texto_resposta(resp)
        import json
        dados = json.loads(txt)
        if isinstance(dados, list):
            saida = []
            for it in dados:
                if not isinstance(it, dict):
                    continue
                item = {
                    "crop": str(it.get("crop") or ""),
                    "emoji": str(it.get("emoji") or ""),
                    "score": int(it.get("score") or 80),
                    "reason": str(it.get("reason") or "Sugestão gerada"),
                    "yield": str(it.get("yield") or "-"),
                    "revenue": str(it.get("revenue") or "-"),
                    "water": str(it.get("water") or "-"),
                    "cycle": str(it.get("cycle") or "-"),
                    "difficulty": str(it.get("difficulty") or "-"),
                }
                saida.append(item)
            if saida:
                return saida
    except Exception:
        pass
    return base
