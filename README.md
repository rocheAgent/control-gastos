# 💰 Control de Gastos

App de control de gastos personales — React 18 + Vite + TypeScript. Persistencia en LocalStorage.

## Requisitos

- Node.js 20+
- Docker + Docker Compose (para deploy)

## Desarrollo

```bash
npm install
npm run dev
```

App en `http://localhost:5173`.

### Con Docker (hot reload)

```bash
make dev
# o
docker compose -f docker-compose.dev.yml up --build
```

## Producción

### Docker

```bash
make prod
# o
docker compose up --build -d
```

App en `http://localhost:8080` (configurable con `APP_PORT`).

### Build manual

```bash
npm run build
npm run preview
```

## Comandos Make

| Comando       | Descripción                        |
| ------------- | ---------------------------------- |
| `make dev`    | Desarrollo con hot reload (Docker) |
| `make prod`   | Producción local (Docker)          |
| `make build`  | Solo build imágenes                |
| `make stop`   | Detener contenedores               |
| `make clean`  | Detener + limpiar imágenes         |
| `make logs`   | Logs de producción                 |

## CI/CD

GitHub Actions en `.github/workflows/ci.yml`:
- Lint + build en cada push/PR a `main`
- Build + push imagen Docker a GHCR (solo `main`)

## Stack

- React 18 + TypeScript + Vite
- Nginx para servir producción
- Docker multi-stage build
