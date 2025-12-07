DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags JSONB DEFAULT '[]',
  state VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'published')),
  reading_time VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO posts (slug, title, content, excerpt, tags, state, reading_time, created_at) VALUES
('boost-your-developer-productivity', 'Boost Your Developer Productivity with Practical TypeScript Tips', '# Boost Your Developer Productivity

TypeScript is a powerful tool that can significantly enhance your development workflow. Here are six practical tips to get the most out of it:

1. **Enable Strict Mode**: Always set `"strict": true` in your `tsconfig.json`. This forces you to handle `null` and `undefined` explicitly, preventing a whole class of runtime errors.
2. **Use Type Inference**: You don''t need to annotate everything. Let TypeScript infer types where possible to keep your code clean and readable.
3. **Leverage Utility Types**: Learn to use `Partial<T>`, `Pick<T, K>`, and `Omit<T, K>` to transform existing types instead of creating new ones from scratch.
4. **Avoid `any`**: Using `any` defeats the purpose of TypeScript. Use `unknown` if you really don''t know the type, as it forces you to check before using it.
5. **Use Discriminated Unions**: They are perfect for modeling state in applications (e.g., `loading`, `success`, `error`).
6. **Automate Formatting**: Use Prettier combined with ESLint to ensure your code style is consistent without manual effort.

By following these tips, you''ll write safer code faster.', 'Six practical tips to enhance your coding workflow and efficiency.', '["Web Development", "React", "TypeScript"]', 'published', '2 min read', '2024-01-15'),
('building-scalable-apis', 'Building Scalable APIs with Node.js', '# Building Scalable APIs with Node.js

Node.js is a popular choice for building backend services due to its non-blocking I/O model. However, scaling requires careful planning.

## Key Strategies

### 1. Clustering
Node.js runs on a single thread. To utilize multi-core systems, use the `cluster` module or a process manager like PM2 to spawn multiple instances.

### 2. Caching
Database queries can be slow. Implement caching strategies using **Redis** or **Memcached** to store frequently accessed data.

### 3. Database Optimization
- Use **indexes** on columns you query frequently.
- Normalize your data, but don''t be afraid to denormalize for read-heavy workloads.

### 4. Asynchronous Patterns
Avoid blocking the event loop. Use `async/await` properly and handle errors gracefully to ensure your server remains responsive.', 'Best practices for designing and implementing robust backend services that scale.', '["Backend", "Node.js", "APIs"]', 'published', '2 min read', '2024-01-10'),
('state-management-patterns', 'State Management Patterns in Modern React', '# State Management Patterns in Modern React

Managing state is one of the most challenging aspects of frontend development. React offers several ways to handle it.

## 1. Local State
For simple components, `useState` is often enough. Don''t overcomplicate things by reaching for a global store too early.

## 2. Context API
Great for avoiding prop drilling for global data like themes or user authentication. 

```jsx
const ThemeContext = createContext(''light'');
```

## 3. Server State
Tools like **React Query** or **SWR** are game-changers. They handle caching, synchronization, and background updates for data fetched from an API, removing the need to put this data in a global client-side store.

## 4. Global State Libraries
For complex client-side state, libraries like **Zustand**, **Redux Toolkit**, or **Jotai** provide robust solutions with different trade-offs.', 'A deep dive into various approaches to managing application state effectively.', '["React", "State Management", "Hooks"]', 'published', '2 min read', '2024-01-05'),
('typescript-tips', 'TypeScript Tips for Better Code Quality', '# TypeScript Tips for Better Code Quality

Writing maintainable code is an art. TypeScript provides the tools to make your canvas clean and durable.

## Generics
Generics allow you to write reusable code components that work with a variety of types rather than a single one.

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

## Type Guards
User-defined type guards are functions that perform a runtime check that guarantees the type in some scope.

```typescript
function isString(test: any): test is string {
  return typeof test === "string";
}
```

## Readonly Types
Immutability can prevent bugs. Use `Readonly<T>` or the `readonly` modifier to prevent accidental mutation of objects and arrays.', 'Advanced TypeScript techniques to write more maintainable and type-safe code.', '["TypeScript", "Best Practices"]', 'published', '1 min read', '2023-12-28');
