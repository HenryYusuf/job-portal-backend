# Job Portal Backend

A robust and type-safe backend for a Job Portal application, built with Hono and Zod OpenAPI.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono](https://hono.dev/) with [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Documentation**: Swagger UI via OpenAPI specifications

## Features

- **Full CRUD for Jobs**: Create, read, update, and delete job listings.
- **Advanced Search**: Filter jobs by keyword, location, and category.
- **Pagination**: Efficiently list jobs with custom page and limit parameters.
- **Type Safety**: End-to-end type safety using Zod and TypeScript.
- **OpenAPI Integration**: Automatic documentation generation.
- **Global Error Handling**: Consistent error responses across the API.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A PostgreSQL database instance.

### Installation

1. Install dependencies:
   ```sh
   bun install
   ```

2. Set up your environment variables (create a `.env` file):
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/job_portal
   ```

3. Run database migrations:
   ```sh
   # Update your DB schema
   bunx drizzle-kit push
   ```

### Running the Project

To start the development server with hot reload:
```sh
bun run dev
```

The server will be running at `http://localhost:3000`.

## API Documentation

The API is fully documented using OpenAPI. Once the server is running, you can access:

- **Swagger UI**: [http://localhost:3000/ui](http://localhost:3000/ui)
- **OpenAPI JSON**: [http://localhost:3000/doc](http://localhost:3000/doc)

## Project Structure

- `src/index.ts`: Application entry point and route registration.
- `src/features/jobs`: Job-related routes, schemas, and logic.
- `src/db`: Database schema and configuration using Drizzle.
- `src/lib`: Shared utilities and helpers for consistent API responses.
