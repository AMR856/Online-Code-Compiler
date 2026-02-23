# Online Compiler API

An **online code execution platform** built with **Node.js**, **TypeScript**, **Docker**, **RabbitMQ**, and **Redis**.
Currently supports **Python** and **JavaScript** execution in safe sandboxes, with planned support for more languages.
Includes **job queue processing**, **real-time job updates via WebSockets**, and a modular structure for adding more languages easily.

---

## Features

* Execute code safely in **Docker containers** with resource limits
* Supports **Python** and **JavaScript** (more languages coming soon)
* Accepts **code, language, and input** as JSON
* Returns **stdout**, **stderr**, and **job status**
* **Asynchronous execution** using RabbitMQ queue
* **Job status streaming** in real-time via WebSockets
* **Modular services** for adding new programming languages
* **Redis** used for storing job states
* Planned: **Unit testing** for service and controller layers

---

## Technology Stack

* **Node.js** + **TypeScript**
* **Express.js** for REST API
* **Docker** for safe code execution
* **RabbitMQ** for async job processing
* **Redis** for job storage & pub/sub
* **Socket.IO** for real-time updates
* **uuid** for unique job IDs

---

## Project Structure

```text
src/
├─ app.ts                  # Express app setup
├─ server.ts               # Entry point for starting server
├─ worker.ts               # Worker starter
├─ controllers/
│  └─ code.controller.ts   # API controller
├─ services/
│  ├─ code.service.ts      # Dispatches execution to language services
│  ├─ execution.service.ts # Handles worker execution logic
│  └─ docker/
│     ├─ docker.runner.ts  # Generic Docker runner
│     ├─ py.service.ts     # Python service
│     └─ js.service.ts     # JavaScript service
├─ queue/
│  ├─ producer.ts          # Sends jobs to RabbitMQ
│  ├─ consumer.service.ts  # Consumes jobs
│  └─ rabbitmq.ts          # RabbitMQ connection
├─ redis/
│  ├─ client.ts            # Redis connection
│  └─ pubsub.ts            # Redis pub/sub for real-time updates
├─ socket/
│  ├─ socket.ts            # Socket.IO setup
│  └─ subscriber.ts        # WebSocket subscriber for job updates
├─ routes/
│  └─ code.route.ts        # API routes
├─ types/
│  ├─ executeJob.ts
│  ├─ executeRequest.ts
│  ├─ executeResponse.ts
│  ├─ executionResult.ts
│  ├─ languages.ts
│  └─ HTTPStatusText.ts
└─ utils/
   └─ errorHandler.ts
```

---

## Setup

### Prerequisites

* Node.js v20+
* Docker installed and running
* RabbitMQ installed and running
* Redis installed and running
* Yarn or npm

### Install dependencies

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file:

```env
PORT=3000
RUN_WORKER=true
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
```

### Run the server

```bash
npm run dev
# or
yarn dev
```

Server runs at:

```
http://localhost:3000
```

Worker runs automatically if `RUN_WORKER=true`.

---

## API Usage

### Execute Code

```
POST /code/execute
```

#### Request Body

```json
{
  "language": "python",
  "code": "print('Hello world!')",
  "input": ""
}
```

#### Response

```json
{
  "jobId": "uuid-job-id",
  "status": "queued"
}
```

---

### Get Job Result

```
GET /code/result/:jobId
```

#### Response

```json
{
  "jobId": "uuid-job-id",
  "status": "done",
  "stdout": "Hello world!\n",
  "stderr": ""
}
```

---

### Real-Time Job Updates (WebSocket)

* Connect to the WebSocket server (`ws://localhost:3000`)
* Join a job room:

```ts
socket.emit("joinJob", "uuid-job-id");
```

* Listen for job updates:

```ts
socket.on("jobUpdate", (data) => {
  console.log(data);
});
```

#### Example WebSocket Update

```json
{
  "jobId": "uuid-job-id",
  "status": "running"
}
```

```json
{
  "jobId": "uuid-job-id",
  "status": "done",
  "stdout": "Hello world!\n",
  "stderr": ""
}
```

---

## Adding New Languages

1. Create a **Docker service** in `src/services/docker/`:

```
ts.service.ts       # TypeScript
cpp.service.ts      # C++
ruby.service.ts     # Ruby
```

2. Add it to `CodeService` dispatcher:

```ts
switch (language.toLowerCase()) {
  case Languages.PYTHON:
    return runPythonDocker(code, input);
  case Languages.JAVASCRIPT:
    return runJavaScriptDocker(code, input);
  // Add new languages here
}
```

3. Add the language to your `Languages` enum (`src/types/languages.ts`).

---

## Future Improvements

* Add more languages (C++, TypeScript, Ruby, etc.)
* Full **unit testing** with Jest / Mocha
* Rate limiting and resource monitoring
* Frontend for interactive code execution


## Security Considerations

* All code executes in **isolated Docker containers** with:

  * Disabled network
  * Memory & CPU limits
  * Automatic cleanup of temporary files
* **Only whitelisted languages** are allowed
* Jobs are **queued** and **executed asynchronously** for safety
