from __future__ import annotations

from datetime import date, timedelta
import hashlib
import secrets
import math

_todos_today = [
    {"task": "Fertilizar tomate", "crop": "🍅", "time": "06:00", "completed": False},
    {"task": "Colher couve", "crop": "🥬", "time": "07:30", "completed": False},
]

_todos_week = [
    {"day": "Ter", "task": "Aplicar calda de fumo no tomate", "crop": "🍅"},
    {"day": "Qua", "task": "Proteger cenoura da chuva", "crop": "🥕"},
    {"day": "Qui", "task": "Irrigar alface (manhã)", "crop": "🥬"},
]

_crops = [
    {
        "name": "Couve",
        "emoji": "🥬",
        "area": "1.5 ha",
        "health": 95,
        "daysToHarvest": 5,
        "status": "ready",
        "insight": "Preço alto no mercado",
        "planted": "10/Nov",
        "harvest": "19/Dez",
        "progress": 97,
        "tasks": [
            {"task": "Colher couve", "time": "07:30", "completed": False},
            {"task": "Preparar para venda", "time": "10:00", "completed": False},
        ],
        "alerts": [],
        "weather": "Sol, 30°C",
    },
    {
        "name": "Tomate",
        "emoji": "🍅",
        "area": "3.5 ha",
        "health": 92,
        "daysToHarvest": 13,
        "status": "healthy",
        "insight": "Fertilizar amanhã",
        "planted": "03/Nov",
        "harvest": "27/Dez",
        "progress": 82,
        "tasks": [
            {"task": "Fertilizar tomate", "time": "06:00", "completed": False},
            {"task": "Verificar tutoramento", "time": "15:00", "completed": False},
        ],
        "alerts": [],
        "weather": "Chuva quarta (80mm)",
    },
]

_weather_week = [
    {"day": "Seg", "temp": 30, "rain": 10},
    {"day": "Qua", "temp": 24, "rain": 80},
    {"day": "Sex", "temp": 29, "rain": 15},
]

_events: list[dict] = []
_events_max = 100


def add_event(event_type: str, message: str, meta: dict | None = None) -> dict:
    from datetime import datetime

    item = {
        "time": datetime.utcnow().isoformat() + "Z",
        "type": event_type,
        "message": message,
        "meta": meta or {},
    }
    _events.append(item)
    if len(_events) > _events_max:
        del _events[: len(_events) - _events_max]
    return item


def get_events() -> dict:
    return {"events": list(_events)[-_events_max:]}


def clear_events() -> dict:
    _events.clear()
    return {"cleared": True}

_users: list[dict] = []
_sessions: dict[str, str] = {}

def _hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode("utf-8")).hexdigest()

def create_user(name: str, email: str, password: str) -> dict:
    e = email.strip().lower()
    if any(u.get("email") == e for u in _users):
        return {"ok": False, "error": "user_exists"}
    user = {"name": name.strip(), "email": e, "password": _hash_password(password)}
    _users.append(user)
    add_event("auth_signup", f"Novo usuário: {e}")
    return {"ok": True, "user": {"name": user["name"], "email": user["email"]}}

def login_user(email: str, password: str) -> dict:
    e = email.strip().lower()
    hpw = _hash_password(password)
    user = next((u for u in _users if u.get("email") == e and u.get("password") == hpw), None)
    if not user:
        return {"ok": False, "error": "invalid_credentials"}
    token = secrets.token_hex(16)
    _sessions[token] = e
    add_event("auth_login", f"Login: {e}")
    return {"ok": True, "token": token, "user": {"name": user["name"], "email": user["email"]}}

def get_user_by_token(token: str | None) -> dict:
    if not token:
        return {"ok": False, "error": "no_token"}
    email = _sessions.get(token)
    if not email:
        return {"ok": False, "error": "invalid_token"}
    user = next((u for u in _users if u.get("email") == email), None)
    if not user:
        return {"ok": False, "error": "not_found"}
    return {"ok": True, "user": {"name": user["name"], "email": user["email"]}}


def get_weather_demo(lat: float, lon: float) -> dict:
    location_seed = (abs(lat) * 3.0 + abs(lon) * 2.0) % 1.0
    rain_next_7d_mm = int(8 + location_seed * 35)
    temp_max_next_3d_c = int(28 + location_seed * 8)

    return {
        "label": "Clima (demo)",
        "rain_next_7d_mm": rain_next_7d_mm,
        "temp_max_next_3d_c": temp_max_next_3d_c,
    }


def build_insights(ndvi_current: float, ndvi_delta_7d: float, weather_demo: dict) -> list[str]:
    insights: list[str] = []

    rain_next_7d_mm = int(weather_demo.get("rain_next_7d_mm", 0))
    temp_max_next_3d_c = int(weather_demo.get("temp_max_next_3d_c", 0))

    if ndvi_delta_7d <= -0.07:
        insights.append("Alerta: queda forte de NDVI em 7 dias. Pode indicar estresse (água/manejo/solo exposto).")
    elif ndvi_delta_7d <= -0.03:
        insights.append("Atenção: NDVI caiu na semana. Vale checar irrigação e sinais na planta.")
    elif ndvi_delta_7d >= 0.05:
        insights.append("Bom sinal: NDVI subindo. Provável aumento de vigor vegetativo.")
    else:
        insights.append("NDVI está estável na semana.")

    if temp_max_next_3d_c >= 34 and rain_next_7d_mm <= 12:
        insights.append("Risco (demo): calor + pouca chuva. Priorize checar umidade do solo.")
    elif rain_next_7d_mm >= 30:
        insights.append("Atenção (demo): chuva alta. Monitorar encharcamento e fungos.")

    return insights


def get_satellite_context(lat: float = -22.9, lon: float = -43.2) -> dict:
    today_date = date.today()
    number_of_days = 14

    ndvi_series: list[dict] = []
    base_seed = (abs(lat) + abs(lon)) % 1.0

    for day_index in range(number_of_days):
        day_date = today_date - timedelta(days=(number_of_days - 1 - day_index))
        seasonal_wave = math.sin((day_index / 3.0) + (base_seed * 6.0)) * 0.08
        baseline = 0.58 + (base_seed * 0.10)
        ndvi_value = max(0.05, min(0.90, baseline + seasonal_wave))
        ndvi_series.append({"date": day_date.isoformat(), "ndvi": round(ndvi_value, 3)})

    current_ndvi = float(ndvi_series[-1]["ndvi"])
    ndvi_7_days_ago = float(ndvi_series[-8]["ndvi"])
    delta_7d = round(current_ndvi - ndvi_7_days_ago, 3)

    last_image_date = (today_date - timedelta(days=2)).isoformat()
    weather_demo = get_weather_demo(lat=lat, lon=lon)
    insights = build_insights(ndvi_current=current_ndvi, ndvi_delta_7d=delta_7d, weather_demo=weather_demo)

    return {
        "label": "NDVI (demo)",
        "location": {"lat": lat, "lon": lon},
        "ndvi": {
            "current_mean": current_ndvi,
            "delta_7d": delta_7d,
            "last_image_date": last_image_date,
            "quality": "ok",
            "series_14d": ndvi_series,
        },
        "weather_demo": weather_demo,
        "insights": insights,
    }


def get_dashboard_data() -> dict:
    return {
        "crops": _crops,
        "todosToday": _todos_today,
        "todosWeek": _todos_week,
        "weatherWeek": _weather_week,
        "satellite": get_satellite_context(),
    }


def toggle_todo_today(index: int) -> None:
    if 0 <= index < len(_todos_today):
        _todos_today[index]["completed"] = not _todos_today[index].get("completed", False)


_planning_suggestions = [
    {
        "crop": "Brócolis",
        "emoji": "🥦",
        "score": 95,
        "reason": "Solo perfeito + clima ideal + mercado pagando 35% mais",
        "yield": "12-15 ton/ha",
        "revenue": "R$ 18-22k",
        "water": "Médio",
        "cycle": "70-90 dias",
        "difficulty": "Fácil",
    },
    {
        "crop": "Espinafre",
        "emoji": "🌿",
        "score": 88,
        "reason": "Usa pouca água + demanda crescente nas feiras",
        "yield": "8-10 ton/ha",
        "revenue": "R$ 12-15k",
        "water": "Baixo",
        "cycle": "40-50 dias",
        "difficulty": "Fácil",
    },
]

_planning_active = [
    {
        "crop": "Tomate",
        "emoji": "🍅",
        "area": "3.5 ha",
        "progress": 82,
        "daysRemaining": 13,
        "nextTask": "Fertilizar amanhã",
        "health": 92,
        "status": "healthy",
        "planted": "03/Nov",
        "harvest": "27/Dez",
        "weather": "Chuva quarta (80mm)",
        "tasks": 2,
        "alerts": [],
    },
    {
        "crop": "Alface",
        "emoji": "🥬",
        "area": "2.0 ha",
        "progress": 65,
        "daysRemaining": 22,
        "nextTask": "Irrigar em 2 dias",
        "health": 85,
        "status": "attention",
        "planted": "22/Nov",
        "harvest": "05/Jan",
        "weather": "Sol, 32°C quinta",
        "tasks": 1,
        "alerts": ["Umidade baixa"],
    },
]


def get_planning_suggestions() -> dict:
    return {"suggestions": _planning_suggestions}


def get_planning_active() -> dict:
    return {"plans": _planning_active}


def add_planning_plan(crop: str, emoji: str, area_ha: float, start_date: str) -> dict:
    plan = {
        "crop": crop,
        "emoji": emoji,
        "area": f"{area_ha} ha",
        "progress": 0,
        "daysRemaining": 90,
        "nextTask": "Preparo do solo",
        "health": 100,
        "status": "healthy",
        "planted": start_date,
        "harvest": "+90d",
        "weather": "Sol, 30°C",
        "tasks": 0,
        "alerts": [],
    }
    _planning_active.append(plan)
    return plan


_forum_messages = [
    {
        "author": "Maria Santos",
        "avatar": "MS",
        "message": "Bom dia pessoal! 🌅 Consegui eliminar pragas do tomate com calda de fumo.",
        "time": "08:24",
        "isMe": False,
    },
    {
        "author": "Carlos Oliveira",
        "avatar": "CO",
        "message": "Maria, você usa quanto de fumo pra cada litro?",
        "time": "08:31",
        "isMe": False,
    },
    {
        "author": "Você",
        "avatar": "JS",
        "message": "Boa Maria! Tenho problema parecido aqui",
        "time": "08:45",
        "isMe": True,
    },
]


def get_forum() -> dict:
    return {"messages": _forum_messages}


def add_forum_message(
    author: str,
    message: str,
    avatar: str | None = None,
    is_me: bool = False,
    time: str | None = None,
) -> dict:
    parts = author.split(" ")
    initials = (parts[0][:1] + (parts[1][:1] if len(parts) > 1 else "")).upper()
    item = {
        "author": author,
        "avatar": avatar or initials,
        "message": message,
        "time": time or "agora",
        "isMe": is_me,
    }
    _forum_messages.append(item)
    return item


_resources = [
    {
        "name": "Trator Massey Ferguson",
        "emoji": "🚜",
        "owner": "José Carlos",
        "location": "Cabreúva Centro",
        "distance": "3.2 km",
        "price": "R$ 200",
        "unit": "/dia",
        "rating": 4.8,
        "available": True,
    },
    {
        "name": "Pulverizador 20L",
        "emoji": "💦",
        "owner": "Marina Costa",
        "location": "Bairro Rural",
        "distance": "1.8 km",
        "price": "R$ 30",
        "unit": "/dia",
        "rating": 5.0,
        "available": True,
    },
]


def get_resources() -> dict:
    return {"resources": _resources}


def add_resource(
    name: str,
    emoji: str,
    owner: str,
    location: str,
    distance: str,
    price: str,
    unit: str,
    rating: float,
    available: bool = True,
) -> dict:
    item = {
        "name": name,
        "emoji": emoji,
        "owner": owner,
        "location": location,
        "distance": distance,
        "price": price,
        "unit": unit,
        "rating": rating,
        "available": available,
    }
    _resources.append(item)
    return item


def reserve_resource(index: int) -> None:
    if 0 <= index < len(_resources):
        _resources[index]["available"] = False


_market_trends = [
    {"product": "Tomate", "trend": "+12%", "up": True},
    {"product": "Alface", "trend": "+8%", "up": True},
    {"product": "Cenoura", "trend": "-3%", "up": False},
]

_market_offers = [
    {
        "seller": "Maria Santos",
        "product": "Tomate Orgânico",
        "quantity": "500 kg",
        "price": "R$ 4,50",
        "unit": "/kg",
        "location": "3 km",
        "image": "🍅",
        "quality": "Certificado",
        "verified": True,
    },
    {
        "seller": "Carlos Oliveira",
        "product": "Alface Crespa",
        "quantity": "300 un",
        "price": "R$ 2,00",
        "unit": "/un",
        "location": "2 km",
        "image": "🥬",
        "quality": "Sem agrotóxico",
        "verified": True,
    },
]


def get_market() -> dict:
    return {"trends": _market_trends, "offers": _market_offers}


def add_market_offer(
    seller: str,
    product: str,
    quantity: str,
    price: str,
    unit: str,
    location: str,
    image: str,
    quality: str,
    verified: bool = True,
) -> dict:
    item = {
        "seller": seller,
        "product": product,
        "quantity": quantity,
        "price": price,
        "unit": unit,
        "location": location,
        "image": image,
        "quality": quality,
        "verified": verified,
    }
    _market_offers.append(item)
    return item
