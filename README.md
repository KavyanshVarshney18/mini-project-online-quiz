# Online Quiz System

Full-stack role-based quiz platform built with Spring Boot, MongoDB, JWT authentication, and a React dashboard UI.

## Stack

- Backend: Spring Boot 3.3, Java 17, Spring Security, Spring Data MongoDB
- Database: MongoDB
- Authentication: JWT
- Frontend: React, TypeScript, Vite
- API docs: Swagger UI via `springdoc`

## Features

- User registration and login
- JWT-secured REST APIs
- Role-based access for `ADMIN` and `USER`
- Admin quiz creation, editing, deletion, and question authoring
- User quiz catalog, timed attempts, instant scoring, history, and leaderboard
- Admin analytics for quizzes, users, attempts, and top scorers

## Project Structure

```text
quiz-system/
├── frontend/                     # React dashboard
├── src/main/java/com/quizapp/quiz_system/
│   ├── config
│   ├── controller
│   ├── dto
│   ├── exception
│   ├── model
│   ├── repository
│   ├── security
│   └── service
└── src/test/java/com/quizapp/quiz_system/
```

## Environment Variables

Backend values can be set in the shell or `.env` tooling before starting Spring Boot:

```bash
MONGODB_URI=mongodb://localhost:27017/quiz_system
JWT_SECRET=change-me-change-me-change-me-change-me-1234567890
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@quizapp.com
ADMIN_PASSWORD=Admin@123
SERVER_PORT=8080
```

Frontend optional override:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Run Locally

### 1. Start MongoDB

Make sure a local MongoDB instance is running on the URI above, or provide your own `MONGODB_URI`.

### 2. Start the backend

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Default Admin

The app bootstraps an admin account automatically if the configured admin email does not exist:

- Email: `admin@quizapp.com`
- Password: `Admin@123`

Override those values with environment variables for real usage.

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Admin

- `GET /admin/dashboard`
- `GET /admin/quiz`
- `GET /admin/quiz/{id}`
- `POST /admin/quiz`
- `PUT /admin/quiz/{id}`
- `DELETE /admin/quiz/{id}`
- `POST /admin/question/{quizId}`
- `GET /admin/results`
- `GET /admin/analytics/top-scorers`

### User

- `GET /quiz/list`
- `GET /quiz/{id}`
- `POST /quiz/{id}/submit`
- `GET /user/results/{userId}`
- `GET /leaderboard`

## Swagger

Once the backend is running, open:

- `http://localhost:8080/swagger-ui.html`

## Verification

Backend tests:

```powershell
.\mvnw.cmd test
```

Frontend production build:

```bash
cd frontend
npm run build
```
