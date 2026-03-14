# Backend (MVC)

This backend follows a simple MVC layout:

- `index.js` wires middleware and routes.
- `controllers/` holds request handlers.
- `models/` wraps database access.
- `routes/` defines HTTP endpoints.
- `middleware/` contains auth helpers.
- `config/` stores shared configuration (e.g., uploads).

## Run

```bash
npm install
npm run dev
```

## Notes

- File uploads are served from `/uploads`.
- Auth, forms, applications, and admin endpoints are grouped under their route files.
