# Online Code Compiler

Online code execution platform with a React frontend and a Node.js + TypeScript backend.
The system queues jobs in RabbitMQ, stores status/output in Redis, and runs untrusted code inside isolated Docker containers.

## What is included

- Frontend editor built with React + Vite + Monaco
- Backend REST API built with Express + TypeScript
- Async execution pipeline (API -> RabbitMQ -> worker -> Redis)
- Status and output retrieval by job ID
- Socket.IO + Redis pub/sub infrastructure for real-time updates

## Supported languages

- JavaScript
- Python
- C
- Bash

## Architecture overview

1. Client sends code to POST /code/execute.
2. Backend validates and sanitizes input, creates a job ID, and stores queued status in Redis.
3. Backend enqueues the job to RabbitMQ.
4. Worker consumes the job and executes code in a Docker container with limits.
5. Worker stores final output/status in Redis.
6. Client polls GET /code/:jobId to read current status and output.

Note: WebSocket updates are implemented in backend services, but the current frontend uses HTTP polling.

## Tech stack

- React, TypeScript, Vite, Monaco Editor
- Node.js, Express, TypeScript
- Docker
- RabbitMQ
- Redis
- Socket.IO

## Project layout

```text
.
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── worker.ts
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── docker/runners/
│   │   │   ├── queue/
│   │   │   └── storage/
│   │   ├── queue/
│   │   ├── redis/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── workers/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- Docker running locally
- RabbitMQ available at amqp://localhost
- Redis available at redis://localhost:6379

Optional quick start for Redis and RabbitMQ with Docker:

```bash
docker run -d --name occ-redis -p 6379:6379 redis:7
docker run -d --name occ-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Installation

Install dependencies in each app:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Running locally

Start backend:

```bash
cd backend
npm run dev
```

Start frontend in another terminal:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

Vite is configured to proxy /code requests to the backend.

## Backend configuration

Current backend values are hardcoded in source for Redis and RabbitMQ:

- Redis: redis://localhost:6379
- RabbitMQ: amqp://localhost

Environment variable used by backend:

- PORT (optional, defaults to 3000)
- RUN_WORKER (see note below)

Worker flag note:

- Current implementation starts worker when RUN_WORKER is set to false.
- If RUN_WORKER is undefined or true, jobs may remain queued.

## API

Base URL: http://localhost:3000

### 1) Execute code

POST /code/execute

Request body:

```json
{
  "language": "python",
  "code": "print('Hello from Python')",
  "input": ""
}
```

Response:

```json
{
  "jobId": "8d4b6f63-cde2-4db2-a661-d4f58b4b7b65",
  "status": "queued"
}
```

### 2) Fetch result/status

GET /code/:jobId

Response example:

```json
{
  "jobId": "8d4b6f63-cde2-4db2-a661-d4f58b4b7b65",
  "status": "done",
  "stdout": "Hello from Python\n",
  "stderr": ""
}
```

## Job statuses

- queued
- running
- done
- error

## Limits and safety

- Language whitelist: python, javascript, c, bash
- Input sanitization:
  - code max length: 100000
  - stdin max length: 20000
  - null bytes removed
- API rate limiting:
  - POST /code/execute: 10 requests/minute
  - GET /code/:jobId: 100 requests/15 minutes
- Docker execution limits:
  - --network none
  - --memory 100m
  - --cpus 0.5
  - timeout around 20 seconds
  - temp job directory is removed after execution

## WebSocket events (available in backend)

Socket server is attached to backend HTTP server.

- Client event: joinJob with payload jobId
- Server event: jobUpdate with payload containing status/output

## Extending to a new language

1. Add a new runner in backend/src/services/docker/runners.
2. Register it in backend/src/services/docker/index.ts.
3. Add language value in backend/src/types/languages.ts.
4. Update language validation in backend/src/utils/sanitize.ts.
5. Add option in frontend/src/components/SelectProgram.tsx.
