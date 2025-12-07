DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  state VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
