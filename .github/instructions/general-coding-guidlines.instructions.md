---
applyTo: '**/*.ts'
---

Coding standards, and preferences that AI should follow.

- Use TypeScript for all new code
- Use consistent naming conventions (e.g., camelCase for variables and functions, PascalCase for classes and interfaces, capital kebab case for constants).
- Write clear and concise comments to explain complex logic, but avoid obvious comments.
- Use JSDoc comments for public functions and classes to provide type information and usage examples.
- Prefer functional programming paradigms (e.g., map, filter, reduce) over imperative loops when working with arrays.
- Use functional programming techniques like immutability and pure functions where possible.
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators
- Use TypeScript's type system effectively to catch errors at compile time.
- Keep functions small and focused on a single task.
- Write unit tests for all new features and bug fixes.
- Follow the DRY (Don't Repeat Yourself) principle to reduce code duplication.
- Use async/await for asynchronous code instead of callbacks or promises.
- Keep dependencies up to date and remove unused ones.
- Use environment variables for configuration values (e.g., API keys, database URLs).
- Use consistent error handling patterns (e.g., try/catch blocks, custom error classes).
- Use descriptive variable and function names that convey their purpose.
- Use template literals for string interpolation.
- Use destructuring assignment for objects and arrays where appropriate.
- Use `const` for variables that are not reassigned, and `let` for those that are.
- Use `===` and `!==` for comparisons to avoid type coercion issues.
- Use `null` for intentional absence of value and `undefined` for uninitialized variables.
- Do not use (ie do not reference) any symbol that has been marked as deprecated in the codebase
