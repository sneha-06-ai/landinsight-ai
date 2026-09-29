# LandInsight AI

National Digital Platform for Research, Policy Innovation and Evidence-Based Land Governance.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use the left navigation to move between the dashboard, research copilot, repository, GIS intelligence center, policy simulation, digital twin, analytics, collaboration, and innovation hub. The profile menu previews role-based navigation; it is not a login system.

## Project contents

- `app/` — Next.js App Router, responsive screens, theme, and global styles.
- `components/land-map.tsx` — Leaflet map with OpenStreetMap and Esri imagery layers.
- `data/sample-data.json` — Synthetic demonstration records; not official statistics.
- `docs/architecture.md` — Service boundaries, Mermaid architecture diagram, roles, flows, and delivery sequence.
- `docs/schema.sql` — PostgreSQL, PostGIS, and pgvector schema proposal.
- `docs/openapi.yaml` — Versioned FastAPI service contract.

## Checks

```bash
npm run lint
npm run build
```

## Production integration boundary

This repository currently delivers a frontend prototype and backend design artifacts. Search, assistant answers, map indicators, and policy simulation use illustrative client-side data; there is no FastAPI service, authentication provider, live government data connection, object storage, or model integration configured. Review data licensing, privacy, security, accessibility, model evaluation, and operational controls before a government deployment. See `docs/architecture.md` for the implementation sequence.
