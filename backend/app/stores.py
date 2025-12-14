from __future__ import annotations

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


def get_dashboard_data() -> dict:
    return {
        "crops": _crops,
        "todosToday": _todos_today,
        "todosWeek": _todos_week,
        "weatherWeek": _weather_week,
    }


def toggle_todo_today(index: int) -> None:
    if 0 <= index < len(_todos_today):
        _todos_today[index]["completed"] = not _todos_today[index].get("completed", False)


_planning_suggestions = [
    {"crop": "Brócolis", "emoji": "🥦", "score": 95, "reason": "Solo perfeito + clima ideal + mercado pagando 35% mais", "yield": "12-15 ton/ha", "revenue": "R$ 18-22k", "water": "Médio", "cycle": "70-90 dias", "difficulty": "Fácil"},
    {"crop": "Espinafre", "emoji": "🌿", "score": 88, "reason": "Usa pouca água + demanda crescente nas feiras", "yield": "8-10 ton/ha", "revenue": "R$ 12-15k", "water": "Baixo", "cycle": "40-50 dias", "difficulty": "Fácil"},
]

_planning_active = [
    {"crop": "Tomate", "emoji": "🍅", "area": "3.5 ha", "progress": 82, "daysRemaining": 13, "nextTask": "Fertilizar amanhã", "health": 92, "status": "healthy", "planted": "03/Nov", "harvest": "27/Dez", "weather": "Chuva quarta (80mm)", "tasks": 2, "alerts": []},
    {"crop": "Alface", "emoji": "🥬", "area": "2.0 ha", "progress": 65, "daysRemaining": 22, "nextTask": "Irrigar em 2 dias", "health": 85, "status": "attention", "planted": "22/Nov", "harvest": "05/Jan", "weather": "Sol, 32°C quinta", "tasks": 1, "alerts": ["Umidade baixa"]},
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
    {"author": "Maria Santos", "avatar": "MS", "message": "Bom dia pessoal! 🌅 Consegui eliminar pragas do tomate com calda de fumo.", "time": "08:24", "isMe": False},
    {"author": "Carlos Oliveira", "avatar": "CO", "message": "Maria, você usa quanto de fumo pra cada litro?", "time": "08:31", "isMe": False},
    {"author": "Você", "avatar": "JS", "message": "Boa Maria! Tenho problema parecido aqui", "time": "08:45", "isMe": True},
]


def get_forum() -> dict:
    return {"messages": _forum_messages}


def add_forum_message(author: str, message: str, avatar: str | None = None, is_me: bool = False, time: str | None = None) -> dict:
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
    {"name": "Trator Massey Ferguson", "emoji": "🚜", "owner": "José Carlos", "location": "Cabreúva Centro", "distance": "3.2 km", "price": "R$ 200", "unit": "/dia", "rating": 4.8, "available": True},
    {"name": "Pulverizador 20L", "emoji": "💦", "owner": "Marina Costa", "location": "Bairro Rural", "distance": "1.8 km", "price": "R$ 30", "unit": "/dia", "rating": 5.0, "available": True},
]


def get_resources() -> dict:
    return {"resources": _resources}


def add_resource(name: str, emoji: str, owner: str, location: str, distance: str, price: str, unit: str, rating: float, available: bool = True) -> dict:
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
    {"seller": "Maria Santos", "product": "Tomate Orgânico", "quantity": "500 kg", "price": "R$ 4,50", "unit": "/kg", "location": "3 km", "image": "🍅", "quality": "Certificado", "verified": True},
    {"seller": "Carlos Oliveira", "product": "Alface Crespa", "quantity": "300 un", "price": "R$ 2,00", "unit": "/un", "location": "2 km", "image": "🥬", "quality": "Sem agrotóxico", "verified": True},
]


def get_market() -> dict:
    return {"trends": _market_trends, "offers": _market_offers}


def add_market_offer(seller: str, product: str, quantity: str, price: str, unit: str, location: str, image: str, quality: str, verified: bool = True) -> dict:
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
