# EN2H Booking Platform REST API

A highly scalable, robust REST API built with [NestJS](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/) for managing bookable services and customer bookings.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Installation Steps](#installation-steps)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running Migrations](#running-migrations)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Assumptions Made](#assumptions-made)
- [Future Improvements](#future-improvements)

---

## 🚀 Project Overview

Welcome to the **EN2H Booking Platform API**! This project implements essential backend functionality, including JWT-based authentication, complete CRUD operations for services and bookings, and role-based access restrictions (where customers can book publicly and authenticated users can manage services).

It was designed following strict NestJS best practices, maintaining a clean module-driven folder structure, class-validator DTOs, and global filters for clean error handling.

### 🌟 Bonus Features Implemented
- **Advanced Querying**: Search (by name, email, phone), Filter by status, and Pagination on `GET /bookings`.
- **Duplicate Prevention**: Rejects duplicate bookings for the same service at the exact same date & time.
- **Refresh Tokens**: Users receive an `accessToken` (15m) and `refreshToken` (7d) during login/registration, allowing persistent and secure sessions via `POST /auth/refresh`.
- **Validation**: Global `ValidationPipe` leveraging `class-validator` to strip un-whitelisted data securely.
- **Global Error Handling**: Comprehensive catching of unhandled errors via custom `HttpExceptionFilter` and `AllExceptionsFilter`.
- **Docker Support**: Included `Dockerfile` and `docker-compose.yml` for instant, containerized environments alongside PostgreSQL.
- **API Documentation**: Fully documented and testable via a deeply integrated Swagger UI.
- **Unit Testing**: Included basic spec testing ensuring business logic robustness (run via `npm test`).

---

## Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hirunipraboda/booking-platform-api.git
   cd booking-platform-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Environment Variables

Check the `.env.example` file provided in the repo. Create a `.env` file in the root based on this:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=en2h_booking

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
PORT=3000
```

---

## Database Setup

1. Make sure you have PostgreSQL running locally (or run it via Docker Compose).
2. Ensure you have created a database matching your `.env` configuration (e.g., `en2h_booking`).

---

## Running Migrations

Database tables are managed using TypeORM migrations. To generate or run them:

- **Run current migrations**:
  ```bash
  npm run migration:run
  ```
- **Revert the last migration**:
  ```bash
  npm run migration:revert
  ```
- **Generate a new migration** (after changing an entity):
  ```bash
  npm run migration:generate src/migrations/YourMigrationName
  ```

---

## Running the Application

**Option 1: Using Node (Locally)**
```bash
npm run start:dev
```

**Option 2: Using Docker Compose**
Instantly spin up the database and the API concurrently:
```bash
docker-compose up --build
```

---

## API Documentation

Swagger is built directly into the application. Once the server is running, navigate to:

👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

This interface will allow you to execute endpoints directly from the browser. 

*(For protected endpoints, hit `POST /auth/login`, copy the `accessToken`, click "Authorize" at the top of the Swagger UI, and paste it in.)*

---

## Assumptions Made
1. **Public Bookings**: Customers do not require an active "User Account" to book a service. Customer details (name, email, phone) are stored on the `Booking` entity directly.
2. **Date Granularity**: Past date constraint is evaluated at "Day" granularity. So booking exactly today for a future time might pass the "date in past" validation (in a stricter implementation, we would compare the combined DateTime with timezone).
3. **Database Timezones**: `date` and `time` are stored without explicitly dealing with intense daylight savings logic since they map basically to the standard Postgres Types.

---


