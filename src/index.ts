import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const API_KEY = process.env.ADMIN_API_KEY;
if (!API_KEY) {
  console.error('⚠️  set ADMIN_API_KEY');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// simple API‐key auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.header('X-API-KEY') !== API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
};

const calculateReadingTime = (content: string): string => {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

// normalize incoming content by converting literal "\n" sequences to real newlines
const normalizeContent = (raw: string): string => raw.replace(/\\r?\\n/g, '\n');

// GET /posts/latest/:count
app.get('/posts/latest/:count', async (req: Request, res: Response) => {
  const count = parseInt(req.params.count, 10);
  if (isNaN(count) || count < 1) {
    return res.status(400).json({ error: 'count must be a positive number' });
  }
  try {
    const r = await pool.query('SELECT id, slug, title, excerpt, tags, state, reading_time, created_at FROM posts ORDER BY created_at DESC LIMIT $1', [count]);
    res.json(r.rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /posts and GET /posts/:id
app.get('/posts/:id?', async (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const r = await pool.query('SELECT * FROM posts WHERE id::text=$1 OR slug=$1 LIMIT 1', [req.params.id]);
      return r.rows[0]
        ? res.json(r.rows[0])
        : res.status(404).json({ error: 'not found' });
    }
    const r = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(r.rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /posts
app.post('/posts', requireAuth, async (req: Request, res: Response) => {
  const { slug, title, content, state, excerpt, tags } = req.body;
  if (!slug || !title || !content) {
    return res.status(400).json({ error: 'slug+title+content required' });
  }
  if (state && !['draft', 'published'].includes(state)) {
    return res.status(400).json({ error: 'state must be draft or published' });
  }
  try {
    let normalizedTags: any[] = [];
    if (Array.isArray(tags)) {
      normalizedTags = tags;
    } else if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) normalizedTags = parsed;
      } catch (_err) {
        // ignore parse errors and keep tags empty
      }
    }
    const normalizedContent = normalizeContent(content);
    const readingTime = calculateReadingTime(normalizedContent);
    const r = await pool.query(
      `INSERT INTO posts (slug, title, content, state, excerpt, tags, reading_time)
       VALUES ($1,$2,$3,$4,$5, COALESCE($6::jsonb, '[]'::jsonb), $7)
       RETURNING *`,
      [slug, title, normalizedContent, state || 'draft', excerpt || null, JSON.stringify(normalizedTags), readingTime]
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /posts/:id
app.delete('/posts/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const r = await pool.query('DELETE FROM posts WHERE id=$1 RETURNING *', [req.params.id]);
    if (r.rowCount === 0) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ message: 'deleted', post: r.rows[0] });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Listening on :${PORT}`));
