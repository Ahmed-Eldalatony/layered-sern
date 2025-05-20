# Express.js + TypeScript Project Conventions
## 1. Project Structure

The project follows a modular structure within the `src` directory.

```
.
├── .env                # Environment variables (local, not committed)
├── .env.example        # Example environment variables
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts    # Vitest configuration
├── src
│   ├── __mocks__       # Manual mocks for Vitest/Jest
│   │   └── someModule.mock.ts
│   ├── __tests__       # General integration or utility tests (optional here if primarily co-locating)
│   ├── config          # Application configuration (e.g., database, env loading)
│   │   └── index.ts
│   │   └── env.validation.ts # (Optional) Zod/Joi schema for env validation
│   ├── dtos            # Data Transfer Objects (for request/response validation & shaping)
│   │   ├── user
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── index.ts    # Barrel file for DTOs
│   ├── e2e             # End-to-End tests
│   │   └── app.e2e-spec.ts
│   ├── handlers        # Request handlers (Controllers)
│   │   ├── user.handler.ts
│   │   └── user.handler.test.ts # Co-located unit/integration tests for handlers
│   │   └── index.ts    # Barrel file for handlers
│   ├── repositories    # Data access logic (interacting with DB/external APIs)
│   │   ├── user.repository.ts
│   │   └── user.repository.test.ts # Co-located unit tests for repositories
│   │   └── index.ts
│   │
│   ├── middlewares     # Custom Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │   └── index.ts
│   ├── routes          # Route definitions
│   │   ├── user.routes.ts
│   │   └── index.ts    # Main router aggregating all feature routes
│   ├── services        # Business logic, interacting with data sources
│   │   ├── user.service.ts
│   │   └── user.service.test.ts # Co-located unit tests for services
│   │   └── index.ts
│   ├── types           # Global or shared TypeScript type definitions and interfaces
│   │   ├── express.d.ts # Augmenting Express Request/Response if needed
│   │   └── custom.types.ts
│   ├── utils           # Utility functions
│   │   ├── logger.ts
│   │   └── api-response.ts
│   ├── createApp.ts    # Express application instantiation and core middleware setup
│   └── index.ts        # Main application entry point (starts the server)
└── public/             # Static assets (optional)
```

**Key Principles for Structure:**

*   **Modularity:** Group files by feature (e.g., `user`, `product`) within `dtos`, `handlers`, `services`, and `routes` when the application grows. For smaller apps, the provided structure is fine.
*   **Separation of Concerns (Handler -> Service -> Repository):**
    *   **`handlers` (Controllers):** Handle HTTP requests, validate input (often via DTOs and validation middleware), and call services. They should be lean.
    *   **`routes`:** Define API endpoints and map them to handlers.
    *   **`dtos`:** Define the shape of data for requests and responses.
    *   **`middlewares`:** For cross-cutting concerns like authentication, logging, error handling, validation.
    *   **`services`:** Contain the core business logic and orchestrate interactions, typically by calling repositories.
    *   **`repositories`:** Encapsulate data access logic, abstracting the database or external API details away from services.
*   **Co-location of Tests:** Unit/integration tests (`.test.ts` or `.spec.ts`) should be co-located with the files they test (e.g., `user.handler.ts` and `user.handler.test.ts`).
*   **Barrel Files (`index.ts`):** Use `index.ts` files within module directories (e.g., `src/handlers/index.ts`) to re-export entities, making imports cleaner:
    ```typescript
    // src/handlers/user.handler.ts
    export class UserHandler { /* ... */ }

    // src/handlers/index.ts
    export * from './user.handler';

    // Consuming code
    import { UserHandler } from '@/handlers'; // (assuming path alias)
    ```

## 2. Naming Conventions

*   **Folders:** `kebab-case` (e.g., `user-profiles`, `__tests__`).
*   **Files:**
    *   General TypeScript files: `camelCase.ts` (e.g., `createApp.ts`) or `kebab-case.ts` (e.g., `user-routes.ts`). Be consistent. `kebab-case` is often preferred for modules.
    *   Component types: `name.type.ts` (e.g., `user.handler.ts`, `user.service.ts`, `create-user.dto.ts`).
    *   Test files: `name.test.ts` or `name.spec.ts` (e.g., `user.handler.test.ts`).
*   **Classes & Interfaces & Types:** `PascalCase` (e.g., `User`, `CreateUserDto`, `IUserService`).
*   **Variables & Functions:** `camelCase` (e.g., `getUser`, `userService`).
*   **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_USERS`, `API_TIMEOUT`).
*   **Decorators:** `PascalCase` (if custom) or `camelCase` (if functions returning decorators).

## 3. TypeScript Best Practices

   **Strict Mode:** Enable all strict options in `tsconfig.json` (`"strict": true`).
   **Explicit Types:**
   *   Always define return types for functions.
   *   Define types for function parameters.
   *   Use interfaces or types for object shapes.
   **`interface` vs `type`:**
   *   Prefer `interface` for defining object shapes and for public APIs that can be extended (classes can `implement` interfaces).
    *   Use `type` for utility types, union types, intersection types, or aliasing primitive types.
   **Avoid `any`:** Use `unknown` when the type is truly unknown and perform type checking before use. Use specific types whenever possible.
   **Readonly:** Use `readonly` for properties that should not be reassigned after initialization and `Readonly<T>` for immutable types.
   **Enums:** Use string enums or `as const` objects for better readability and debuggability over numeric enums.
    ```typescript
    // String Enum
    export enum UserRole {
      ADMIN = 'ADMIN',
      USER = 'USER',
    }

    // As const object
    export const HttpStatus = {
      OK: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
    } as const;
    export type HttpStatus = typeof HttpStatus[keyof typeof HttpStatus];
    ```
*   **Modules:** Use ES Modules (`import`/`export`).
*   **Path Aliases:** Configure path aliases in `tsconfig.json` for cleaner imports (e.g., `@/*` pointing to `src/*`).
    ```json
    // tsconfig.json
    {
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@/*": ["src/*"]
        }
      }
    }
    ```

## 4. Express.js Best Practices

   **Async/Await:** Use `async/await` for all asynchronous operations in handlers and services.
   **Error Handling:**
    *   Use a centralized error-handling middleware (e.g., `src/middlewares/error.middleware.ts`). This should be the last middleware added.
    * Native Async Error Handling in Express 5

    In Express 5, if an asynchronous route handler or middleware function throws an error or returns a rejected promise, Express automatically catches the error and forwards it to the error-handling middleware. This enhancement simplifies error handling in asynchronous code.

    Example:
```ts
       app.get('/users/:id', async (req, res) => {
       const user = await getUserById(req.params.id); // Assume this is an async function
      if (!user) {
          throw new Error('User not found');
         }
               res.json(user);
         });
```

    *   Create custom error classes extending `Error` for specific error types (e.g., `NotFoundError`, `ValidationError`).
   **Validation:**
    *   Use DTOs (`src/dtos/`) with libraries like `class-validator` and `class-transformer` to validate and transform request bodies, query parameters, and path parameters.
    *   Create a `validation.middleware.ts` to apply DTO validation.
  
   **Configuration:**
  *   Use environment variables for configuration (`.env` files, loaded with `dotenv`).
   *   Create a `src/config/index.ts` to centralize access to configuration values, potentially with validation (e.g., using `zod` or `joi`).
   **Routing:**
   *   Use `express.Router()` to group routes for different resources/features (e.g., `src/routes/user.routes.ts`).
   *   Aggregate all routers in a main router file (e.g., `src/routes/index.ts`).
   **Security:**
    *   Use `helmet` for common security headers.
    *   Use `cors` for Cross-Origin Resource Sharing.
    *   Sanitize inputs to prevent XSS.
    *   Use Prisma as an ORM
    *   Rate limiting (e.g., `express-rate-limit`).

## 5. Project Structure and Code Principles
### DTOs (Data Transfer Objects)

*   Located in `src/dtos/`.
*   Define class-based DTOs using `class-validator` decorators for validation rules.
*   Use `class-transformer` (e.g., `@Expose()`, `@Transform()`) for shaping data.
*   Suffix DTOs with `Dto` (e.g., `CreateUserDto.ts`).
*   Have separate DTOs for creation, updates, and responses if their shapes differ significantly.

###  **Dependency Injection (DI):**
   *   For simpler projects, manual DI (passing dependencies via constructors) is sufficient.

```ts
// src/dtos/user/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
```

## 6. Testing (Vitest)

*   **Configuration:** `vitest.config.ts` at the root.
*   **File Naming:** `*.test.ts` or `*.spec.ts`.
*   **Unit Tests:**
    *   Test individual functions, classes, or modules in isolation.
    *   Mock dependencies using `vi.mock()`.
    *   Co-locate unit tests with the code they test (e.g., `user.service.ts` and `user.service.test.ts`).
*   **Integration Tests:**
    *   Test interactions between multiple components (e.g., a handler calling a service).
    *   May involve a test database or mocked external services.
    *   Can also be co-located or placed in `src/__tests__` if they span multiple modules.
*   **End-to-End (E2E) Tests:**
    *   Located in `src/e2e/`.
    *   Test the application through its public API (HTTP endpoints).
    *   Use libraries like `supertest` to make HTTP requests.
    *   Run against a running instance of the application, often with a dedicated test database.
*   **Assertions:** Use Vitest's built-in `expect` API.
*   **Coverage:** Aim for high test coverage. Configure coverage reporting in `vitest.config.ts`.

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'; // If using path aliases

export default defineConfig({
  plugins: [tsconfigPaths()], // If using path aliases
  test: {
    globals: true, // Optional: to use vi, expect, etc. without importing
    environment: 'node', // Or 'jsdom' if testing front-end components
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'v8', // or 'istanbul'
      exclude: [ // Exclude files/folders from coverage
        'node_modules/',
        'dist/',
        'src/index.ts',
        'src/createApp.ts', // Often setup code, less critical for coverage
        'src/config/',
        'src/types/',
        'src/e2e/',
        '**/*.d.ts',
        '**/*.mock.ts',
      ],
    },
  },
});
```

## 7. Linting and Formatting

  * Biome: Use Biome as an all-in-one tool for linting, formatting, and code analysis
    * Use Biome.json for config
<!-- *   **Husky & lint-staged:** Use Husky and lint-staged to automatically lint and format code on pre-commit. -->

## 8. API Design

*   **RESTful Principles:** Strive for RESTful API design where appropriate.
*   **Versioning:** Consider API versioning (e.g., `/api/v1/users`).
*   **Consistent Responses:** Use a consistent structure for API responses (e.g., `src/utils/api-response.ts`).
    ```typescript
    // src/utils/api-response.ts
    export class ApiResponse<T> {
      constructor(
        public success: boolean,
        public message: string,
        public data: T | null,
        public statusCode: number
      ) {}

      static success<T>(data: T, message = 'Success', statusCode = 200) {
        return new ApiResponse(true, message, data, statusCode);
      }

      static error(message = 'Error', statusCode = 500, data: any = null) {
        return new ApiResponse(false, message, data, statusCode);
      }
    }
    // Handler usage
    // return res.status(200).json(ApiResponse.success(users, 'Users retrieved'));
    ```

## 9. Logging

*   Log important events, errors, and incoming requests (via middleware).
*   Avoid logging sensitive information.

## 10. Comments and Documentation

*   **README.md:** Maintain a comprehensive `README.md` with setup instructions, project overview, and API documentation links (if any).
*   **API Documentation:** For larger APIs, consider generating API documentation using tools like Swagger/OpenAPI with `swagger-jsdoc` and `swagger-ui-express`.

## 10. Use pnpm for installation
