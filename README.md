# QuickNote

**Capture first. Organize later.**

QuickNote is a lightweight note-taking application designed to help you capture ideas quickly before they get lost.

The goal is simple: open the app, write down an idea, and save it without unnecessary friction.

## Features

- **Create notes** — capture ideas quickly.
- **View notes** — retrieve saved notes from the database.
- **Edit notes** — update existing note content.
- **Delete notes** — remove notes you no longer need.
- **Input validation** — prevent empty or invalid note content.
- **Persistent storage** — store notes using SQLite.
- **Automated backend tests** — verify API behavior and validation.
- **Responsive interface** — use the application across different screen sizes.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- TypeScript
- SQLite
- better-sqlite3
- Zod
- Vitest
- Supertest

## Project Structure

```text
quicknote/
├── backend/
│   ├── src/
│   ├── tests/
│   └── ...
├── frontend/
│   ├── src/
│   └── ...
├── .gitignore
└── README.md
```

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jatiagungidn-dev/quick-note
cd quick-note
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Configure the environment variables required by the backend. Use the project's environment schema and `.env.example`, if available, as the source of truth.

### 3. Start the backend

From the `backend/` directory, run the development command defined in `backend/package.json`.

The API should be available at the configured backend port. The frontend's Vite proxy is configured to forward `/api` requests to `http://localhost:3000`; make sure the backend port matches that configuration.

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Running Tests

From the `backend/` directory:

```bash
npm test
```

## Production Build

From the `frontend/` directory:

```bash
npm run build
```

## API Endpoints

The notes API is available under `/api/notes`.

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/api/notes`     | Retrieve all notes    |
| POST   | `/api/notes`     | Create a note         |
| GET    | `/api/notes/:id` | Retrieve a note by ID |
| PATCH  | `/api/notes/:id` | Update a note         |
| DELETE | `/api/notes/:id` | Delete a note         |

### Create a Note

`POST /api/notes`

Request body:

```json
{
  "content": "Remember to build something useful."
}
```

### Update a Note

`PATCH /api/notes/:id`

Request body:

```json
{
  "content": "Updated note content."
}
```

The API validates incoming content and returns appropriate HTTP status codes for successful operations and errors.

## Design Philosophy

QuickNote prioritizes speed and simplicity.

Instead of introducing complex organization features too early, it focuses on making capturing, editing, and deleting notes straightforward.

**Capture first. Organize later.**

## Project Status

QuickNote's core CRUD functionality is implemented, with frontend integration and backend tests completed. Documentation and deployment can be finalized as the project progresses.

## License

No license has been specified yet. Add a license if you intend to distribute or reuse this project publicly.
