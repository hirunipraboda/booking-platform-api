# EN2H Booking Platform REST API

## Project Overview

Welcome to the EN2H Booking Platform API! This project is a robust, clean REST API built with NestJS, designed for managing bookable services and customer bookings. 

It implements essential backend functionality, including JWT-based authentication, complete CRUD operations for services and bookings, role-based access restrictions (where customers can book publicly and admins/staff can manage services), alongside several bonus features to ensure a production-ready approach out of the box.

### Bonus Features Implemented
- **Advanced Querying**: Search, Filter by status, and Pagination on `GET /bookings`.
- **Validation**: Global `ValidationPipe` with `class-validator` stripping un-whitelisted data.
- **Duplicate Prevention**: Rejects identical bookings for the same service at the exact same date & time.
- **Global Error Handling**: Comprehensive catching of unhandled errors via `HttpExceptionFilter` and `AllExceptionsFilter`.
- **Refresh Tokens**: Users receive an `accessToken` (15m) and `refreshToken` (7d), allowing persistent, secure sessions via POST `/auth/refresh`.
- **Docker Support**: Included `Dockerfile` and `docker-compose.yml` for instant, containerized environments alongside PostgreSQL.
- **API Documentation**: Fully documented via deeply integrated Swagger UI.
- **Unit Testing**: Included basic spec testing ensuring business logic robustness.

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

## Future Improvements
1. **RBAC (Role Based Access Control)**: Restrict service management strictly to users with an "Admin" or "Provider" role.
2. **Email Notifications**: Implement Amazon SES or Nodemailer to send actual confirmation emails upon successfully creating a booking.
3. **Improved Timeslot System**: Introduce an "Availability" timetable on the `Service` model, ensuring users can only book slots explicitly designated as open.
