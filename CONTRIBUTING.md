# Contributing

Thanks for taking an interest in `inventory-tracker-api`.

## Compatibility & Contract Rules

1. **Public API Contract Must Not Change:** Existing route paths, HTTP methods, request payload fields, response JSON shapes, and status codes under `/api/items`, `/api/suppliers`, `/api/reports`, `/api/notifications`, and `/api/warehouses` are consumed by downstream warehouse scripts and must remain backwards-compatible.
2. **Node 14 Deployment Support:** Production still runs on an older Node 14.x environment. Do not introduce syntax or standard library APIs that drop Node 14 compatibility.
3. **Pull Requests:** Run `npm run lint` and `npm test` before opening a PR.
