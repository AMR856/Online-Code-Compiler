# Online Compiler API

An **online code execution platform** built with **Node.js**, **TypeScript**, and **Docker**.  
Currently supports **Python** execution in a safe sandbox, with planned support for multiple languages. Future improvements include **RabbitMQ-based job processing** and **unit testing** for robust development.

---

## Features

- Execute Python code safely in a **Docker sandbox**
- Accepts **code, language, and input** as JSON
- Returns **stdout** and **stderr**
- Modular service structure for adding **more programming languages**
- Planned: **RabbitMQ worker** for asynchronous execution
- Planned: **Unit tests** for service and controller layers

---

## Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** for API handling
- **Docker** for safe code execution
- **uuid** for job management and temporary directories
- **Body-parser** for JSON request parsing

---

## Project Structure

```text
src/
├─ app.ts               # Express app setup
├─ server.ts            # Entry point for starting server
├─ controllers/
│  └─ code.controller.ts
├─ services/
│  ├─ code.service.ts    # Dispatcher for languages
│  └─ docker/
│     └─ python.service.ts
├─ routes/
│  └─ code.route.ts
├─ types/
│  ├─ executeRequest.ts
│  └─ executeResponse.ts
````

---

## Setup

### Prerequisites

* Node.js v20+
* Docker installed and running
* Yarn or npm

### Install dependencies

```bash
npm install
# or
yarn install
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

---

## API Usage

### Endpoint

```
POST /execute
```

### Request Body

```json
{
  "language": "python",
  "code": "print('Hello world!')",
  "input": ""
}
```

### Response

```json
{
  "stdout": "Hello world!\n",
  "stderr": ""
}
```

---

## Adding New Languages

Each language has its **own Docker service** in `src/services/docker/`.

Example:

```
src/services/docker/python.service.ts
src/services/docker/js.service.ts      # future
src/services/docker/cpp.service.ts     # future
```

The main `CodeService` dispatches execution to the correct service based on the language.

---

## Future Improvements

1. **Multi-language support** – JavaScript, C++, and more
2. **RabbitMQ worker queue** – handle long-running or async code safely
3. **Unit testing** – Jest or Mocha for controllers, services, and Docker execution
4. **Rate limiting & security** – prevent abuse and heavy resource usage
5. **Frontend client** – to submit code and display results interactively

---

## Security Considerations

* All code runs **inside Docker containers** with:

  * Disabled network
  * CPU and memory limits
  * Automatic cleanup of temp directories
* Only **trusted languages** are allowed to prevent malicious code execution
* Planned **job queue with RabbitMQ** to isolate and control execution further
