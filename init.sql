DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags JSONB DEFAULT '[]',
  state VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO posts (title, content, excerpt, tags, state, created_at) VALUES
('Boost Your Developer Productivity with Practical TypeScript Tips', 'Six practical tips to enhance your coding workflow and efficiency.', 'Six practical tips to enhance your coding workflow and efficiency.', '["Web Development", "React", "TypeScript"]', 'published', '2024-01-15'),
('Building Scalable APIs with Node.js', 'Best practices for designing and implementing robust backend services that scale.', 'Best practices for designing and implementing robust backend services that scale.', '["Backend", "Node.js", "APIs"]', 'published', '2024-01-10'),
('State Management Patterns in Modern React', 'A deep dive into various approaches to managing application state effectively.', 'A deep dive into various approaches to managing application state effectively.', '["React", "State Management", "Hooks"]', 'published', '2024-01-05'),
('TypeScript Tips for Better Code Quality', 'Advanced TypeScript techniques to write more maintainable and type-safe code.', 'Advanced TypeScript techniques to write more maintainable and type-safe code.', '["TypeScript", "Best Practices"]', 'published', '2023-12-28');
