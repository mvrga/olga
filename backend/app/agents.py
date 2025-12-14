def decidir_resposta(mensagem_usuario: str) -> str:
    return agente_agronomo(mensagem_usuario)


def agente_agronomo(mensagem_usuario: str) -> str:
    mensagem_normalizada = normalizar_mensagem(mensagem_usuario)

    if not mensagem_normalizada:
        return "Me manda uma mensagem com sua dúvida (ex: praga, chuva, plantio)."

    if contem_alguma_palavra_chave(mensagem_normalizada, palavras_chave_pragas()):
        return (
            "Possível praga/doença.\n"
            "1) Observe folhas (furos/manchas/insetos).\n"
            "2) Não aplique produto sem identificar.\n"
            "3) Me diga: qual cultura e o que você viu na folha."
        )

    if contem_alguma_palavra_chave(mensagem_normalizada, palavras_chave_clima()):
        return (
            "Clima/água.\n"
            "1) Cheque umidade do solo (5–10 cm).\n"
            "2) Regue cedo ou fim da tarde.\n"
            "3) Se puder, use cobertura do solo (palha)."
        )

    if contem_alguma_palavra_chave(mensagem_normalizada, palavras_chave_plantio()):
        return (
            "Plantio.\n"
            "Me responda 2 coisas:\n"
            "1) Cultura (ex: milho)\n"
            "2) Cidade/UF (ex: Valença/RJ)"
        )

    return (
        "Me diga em 1 frase o problema e responda:\n"
        "• Qual cultura?\n"
        "• Qual cidade/UF?"
    )


def normalizar_mensagem(mensagem_usuario: str) -> str:
    return (mensagem_usuario or "").strip().lower()


def contem_alguma_palavra_chave(mensagem_normalizada: str, lista_palavras_chave: list[str]) -> bool:
    return any(
        palavra_chave in mensagem_normalizada
        for palavra_chave in lista_palavras_chave
    )


def palavras_chave_pragas() -> list[str]:
    return ["praga", "lagarta", "pulg", "fungo", "mancha"]


def palavras_chave_clima() -> list[str]:
    return ["chuva", "seca", "calor", "murcha", "irrig", "vento", "geada"]


def palavras_chave_plantio() -> list[str]:
    return ["plantar", "semente", "muda", "época", "quando plantar"]
