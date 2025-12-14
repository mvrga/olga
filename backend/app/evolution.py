import os
import requests


_override_base = None
_override_apikey = None
_override_session = None


def _cfg() -> tuple[str, str, str]:
    base = (_override_base or os.getenv("EVOLUTION_API_BASE", "http://localhost:8080")).rstrip("/")
    apikey = (_override_apikey or os.getenv("EVOLUTION_API_KEY", "")).strip()
    session = (_override_session or os.getenv("EVOLUTION_SESSION", "default")).strip()
    return base, apikey, session


def send_text(to: str, text: str) -> dict:
    base, apikey, session = _cfg()
    if not to or not text or not apikey:
        return {"sent": False, "reason": "missing_config_or_params"}
    url = f"{base}/message/sendText/{session}"
    headers = {"Content-Type": "application/json", "apikey": apikey}
    payload = {"number": to, "text": text}
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=10)
        ok = 200 <= r.status_code < 300
        return {"sent": ok, "status": r.status_code, "body": r.text[:200]}
    except Exception as e:
        return {"sent": False, "reason": str(e)[:200]}


def configure_evolution(base: str | None = None, apikey: str | None = None, session: str | None = None) -> dict:
    global _override_base, _override_apikey, _override_session
    if base is not None:
        _override_base = base
    if apikey is not None:
        _override_apikey = apikey
    if session is not None:
        _override_session = session
    b, k, s = _cfg()
    return {"configured": True, "base": b, "session": s, "hasKey": bool(k)}


def set_webhook(url: str, events: list[str] | None = None, webhook_by_events: bool = False, enabled: bool = True) -> dict:
    base, apikey, session = _cfg()
    if not apikey or not url:
        return {"ok": False, "reason": "missing_config_or_params"}
    headers = {"Content-Type": "application/json", "apikey": apikey}
    body = {
        "enabled": enabled,
        "url": url,
        "webhook_by_events": webhook_by_events,
        "events": events or ["MESSAGES_UPSERT"],
    }
    try_paths = [f"{base}/webhook/instance/{session}", f"{base}/webhook/instance"]
    for path in try_paths:
        try:
            r = requests.post(path, json=body, headers=headers, timeout=10)
            if 200 <= r.status_code < 300:
                return {"ok": True, "status": r.status_code, "endpoint": path}
        except Exception as e:
            last_err = str(e)[:200]
            continue
    return {"ok": False, "status": getattr(locals().get('r', None), 'status_code', None), "endpoint": try_paths[-1], "error": locals().get('last_err', '')}
