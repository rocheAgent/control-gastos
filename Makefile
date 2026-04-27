.PHONY: dev prod build stop clean logs

# Desarrollo con hot reload
dev:
	docker compose -f docker-compose.dev.yml up --build

# Producción local
prod:
	docker compose up --build -d
	@echo "✅ App en http://localhost:$${APP_PORT:-8080}"

# Solo build
build:
	docker compose build

# Detener
stop:
	docker compose down
	docker compose -f docker-compose.dev.yml down

# Limpiar imágenes
clean: stop
	docker rmi gastos-app-app 2>/dev/null || true

# Logs producción
logs:
	docker compose logs -f
