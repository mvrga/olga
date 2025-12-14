from app.agents import agronomo, mercado, risco

def decidir(d):
    if risco(d["lat"], d["lon"]) == "alto":
        return "⚠️ Risco climático alto"

    if agronomo(d["soil"], d["crop"]) == "nao":
        return "❌ Cultura não recomendada"

    return f"✅ Pode plantar | Mercado: {mercado(d['crop'], d['month'])}"

