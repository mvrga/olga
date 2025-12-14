from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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


class NewPlanIn(BaseModel):
    crop: str
    emoji: str
    areaHa: float
    startDate: str


@app.post("/planning/active")
def planning_add(plan: NewPlanIn):
    created = stores.add_planning_plan(plan.crop, plan.emoji, plan.areaHa, plan.startDate)
    return {"created": created, **stores.get_planning_active()}

@app.get("/community/forum")
def community_forum():
    return stores.get_forum()


class ForumMessageIn(BaseModel):
    author: str
    message: str
    avatar: str | None = None
    isMe: bool = False


@app.post("/community/forum")
def community_forum_add(msg: ForumMessageIn):
    item = stores.add_forum_message(
        author=msg.author,
        message=msg.message,
        avatar=msg.avatar,
        is_me=msg.isMe,
    )
    return {"created": item, "messages": stores.get_forum()["messages"]}

@app.get("/community/resources")
def community_resources():
    return stores.get_resources()


class ResourceIn(BaseModel):
    name: str
    emoji: str
    owner: str
    location: str
    distance: str
    price: str
    unit: str
    rating: float
    available: bool = True


@app.post("/community/resources")
def community_resources_add(payload: ResourceIn):
    item = stores.add_resource(
        name=payload.name,
        emoji=payload.emoji,
        owner=payload.owner,
        location=payload.location,
        distance=payload.distance,
        price=payload.price,
        unit=payload.unit,
        rating=payload.rating,
        available=payload.available,
    )
    return {"created": item, "resources": stores.get_resources()["resources"]}


@app.post("/community/resources/{index}/reserve")
def community_resources_reserve(index: int):
    stores.reserve_resource(index)
    return stores.get_resources()

@app.get("/community/market")
def community_market():
    return stores.get_market()


class MarketOfferIn(BaseModel):
    seller: str
    product: str
    quantity: str
    price: str
    unit: str
    location: str
    image: str
    quality: str
    verified: bool = True


@app.post("/community/market")
def community_market_add(offer: MarketOfferIn):
    item = stores.add_market_offer(
        seller=offer.seller,
        product=offer.product,
        quantity=offer.quantity,
        price=offer.price,
        unit=offer.unit,
        location=offer.location,
        image=offer.image,
        quality=offer.quality,
        verified=offer.verified,
    )
    return {"created": item, "offers": stores.get_market()["offers"], "trends": stores.get_market()["trends"]}
