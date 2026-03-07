# Specification: Create utility function to format JSON response API

## Overview
Standardize the API response structure across the Job Portal Backend to ensure consistency, improve client-side parsing, and simplify error handling.

## Functional Requirements
- **Success Response Utility:** A function to format successful API responses.
  - Required fields: `success: true`, `data: <payload>`.
  - Optional field: `meta: <metadata>` (e.g., pagination info).
- **Error Response Utility:** A function to format error API responses.
  - Required fields: `success: false`, `error: { message: string, code?: string }`.
  - Should accept an optional HTTP status code for mapping.
- **Pagination Support:** Built-in logic to format pagination metadata (`page`, `limit`, `total`, `totalPages`) within the `meta` object.
- **Implementation:** Exported TypeScript helper functions located in `src/lib/api-response.ts`.

## Technical Requirements
- **Type Safety:** Use TypeScript generics to ensure the `data` field is correctly typed in responses.
- **Integration:** The utilities should be easily usable within Hono route handlers.
- **Consistency:** All job-related endpoints should be refactored to use these utilities.

## Acceptance Criteria
- [ ] `ApiResponse` utility functions are implemented and tested.
- [ ] Success responses consistently return the `{ success: true, data, meta? }` structure.
- [ ] Error responses consistently return the `{ success: false, error }` structure.
- [ ] Pagination metadata is correctly calculated and returned in the `meta` object for list endpoints.
- [ ] All existing `/jobs` endpoints are updated to use the new utilities.
