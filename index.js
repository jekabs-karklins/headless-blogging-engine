const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const API_KEY = process.env.ADMIN_API_KEY;
if (!API_KEY) {
  console.error('⚠️  set ADMIN_API_KEY');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ensure table exists
(async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());

// simple API‐key auth
app.use((req, res, next) => {
  if (req.header('X-API-KEY') !== API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

// GET /posts and GET /posts/:id
app.get('/posts/:id?', async (req, res) => {
  try {
    if (req.params.id) {
      const r = await pool.query('SELECT * FROM posts WHERE id=$1', [req.params.id]);
      return r.rows[0]
        ? res.json(r.rows[0])
        : res.status(404).json({ error: 'not found' });
    }
    const r = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /posts
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title+content required' });
  }
  try {
    const r = await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1,$2) RETURNING *',
      [title, content]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Listening on :${PORT}`));
