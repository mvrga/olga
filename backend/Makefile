PYTHON=python3
VENV=.venv

venv:
	$(PYTHON) -m venv $(VENV)
	@echo "Venv criado"

activate:
	@echo "Rode: source .venv/bin/activate"

install:
	. $(VENV)/bin/activate && pip install --upgrade pip && pip install fastapi uvicorn

run:
	. $(VENV)/bin/activate && python -m uvicorn app.main:app --reload

clean:
	rm -rf $(VENV)
