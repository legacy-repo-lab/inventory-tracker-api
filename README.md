# inventory-tracker-api

A simple Express.js REST API for managing small warehouse inventory, stock levels, and supplier syncs.

> **Status:** Maintenance mode / unmaintained. PRs welcome if anyone wants to pick this up.

## Features

- CRUD endpoints for inventory items (`/api/items`)
- Low-stock filtering and stock adjustment endpoint
- Supplier directory and webhook sync (`/api/suppliers`)
- In-memory data store (SQLite adapter planned for v0.5.0)

## Getting Started

### Prerequisites

- Node.js 14.x
- npm 6+

### Installation

```bash
cp .env.example .env
npm install
npm run dev
```

### Running Tests

```bash
npm test
```

### Docker

```bash
docker build -t inventory-tracker-api .
docker run -p 3000:3000 inventory-tracker-api
```

## API Endpoints

- `GET /health` - Service healthcheck
- `GET /api/items` - List all items (supports `?category=` and `?lowStock=true`)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create a new item
- `PATCH /api/items/:id/stock` - Adjust item stock
- `DELETE /api/items/:id` - Remove an item
- `GET /api/suppliers` - List suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Add supplier (requires `x-api-key`)
- `POST /api/suppliers/:id/sync` - Sync stock from supplier endpoint

## License

MIT
# inventory-tracker-api
# inventory-tracker-api
# inventory-tracker-api
