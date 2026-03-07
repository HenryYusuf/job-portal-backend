# Product Guidelines: Job Portal Backend

## 1. Code Organization
- **Modular/Feature-based:** We will organize the code by feature (e.g., `src/features/auth`, `src/features/jobs`). Each feature directory should contain its own routes, business logic, and data access layers.
- **Directory Structure (Proposed):**
  - `src/features/` - Core feature implementation.
  - `src/middleware/` - Global Hono middlewares (e.g., Auth, Error Handling).
  - `src/db/` - Database connection and schema definitions.
  - `src/lib/` - Shared utility functions and libraries.

## 2. API Design & Structure
- **Strict RESTful:** The API will follow REST principles with clear, resource-based endpoints (e.g., `GET /jobs`, `POST /jobs`, `GET /jobs/:id`).
- **Standardized Responses:** All responses follow a strict format using helpers in `src/lib/api-response.ts`.
  - **Success:** `{ success: true, data: ..., meta? }`
  - **Error:** `{ success: false, error: { message, code? } }`

## 3. Documentation
- **Swagger/OpenAPI (Automated):** We will use `@hono/zod-openapi` to automatically generate and serve OpenAPI-compliant documentation. This ensures that the documentation is always in sync with the code.

## 4. Error Handling
- **Global Middleware Handler:** We will implement a centralized `app.onError` handler to catch and format all errors into a standard JSON response using the `sendError` utility.
- **Validation:** Use `zod` for input validation to catch errors before they reach the business logic.

## 5. Coding Standards
- **TypeScript First:** All code must be fully typed. Avoid the `any` type at all costs.
- **Asynchronous Code:** Prefer `async/await` for all asynchronous operations.
- **Naming Conventions:** Use camelCase for variables and functions, PascalCase for classes and types, and SCREAMING_SNAKE_CASE for constants.
