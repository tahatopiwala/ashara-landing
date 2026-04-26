# Ashara

Landing site for Ashara. Monorepo with three top-level packages:

- `client/` — React 19 + Vite + Tailwind v4 frontend
- `server/` — Express 5 API backed by DynamoDB and S3
- `shared/` — TypeScript types shared between client and server

## Prerequisites

- Node.js 20+
- npm
- Local DynamoDB (Docker or [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html))
- AWS credentials with S3 access (or a local S3 substitute) for image uploads

## Setup

### 1. Clone and install

```bash
git clone git@github.com:tahatopiwala/ashara-landing.git
cd ashara-landing

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `.env` to match your environment:

| Variable | Purpose |
| --- | --- |
| `AWS_REGION` | AWS region for DynamoDB and S3 |
| `DYNAMO_ENDPOINT` | Set to `http://localhost:8000` for local DynamoDB; leave blank to use AWS |
| `S3_BUCKET` | Bucket used for image uploads |
| `CLIENT_ORIGIN` | Allowed CORS origin (defaults to `http://localhost:5173`) |
| `PORT` | API port (defaults to `3001`) |
| `TABLE_*` | DynamoDB table names |

### 3. Start DynamoDB locally

Easiest with Docker:

```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

### 4. Seed the database

From `server/`:

```bash
npm run seed
```

This creates the required tables (if missing) and loads sample data.

## Running the app

Run the server and client in two terminals.

**Terminal 1 — API:**

```bash
cd server
npm run dev
```

Server runs at `http://localhost:3001`.

**Terminal 2 — Client:**

```bash
cd client
npm run dev
```

Client runs at `http://localhost:5173`. Vite proxies `/api/*` to the server, so no extra config is needed.

## Useful scripts

### Server (`server/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start API with watch mode (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run seed` | Create tables and seed sample data |

### Client (`client/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and produce a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
ashara/
├── client/         React frontend (pages, components, API clients)
├── server/         Express API
│   └── src/
│       ├── routes/   public/ and admin/ route handlers
│       ├── db/       DynamoDB client and seed script
│       ├── services/ S3 helpers
│       └── middleware/
└── shared/         Cross-package TypeScript types
```
