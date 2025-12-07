const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const API_KEY = process.env.ADMIN_API_KEY;
if (!API_KEY) {
  console.error('⚠️  set ADMIN_API_KEY');
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
app.use(bodyParser.json());

// simple API‐key auth
app.use((req, res, next) => {
  if (req.header('X-API-KEY') !== API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

// GET /posts/latest/:count
app.get('/posts/latest/:count', async (req, res) => {
  const count = parseInt(req.params.count, 10);
  if (isNaN(count) || count < 1) {
    return res.status(400).json({ error: 'count must be a positive number' });
  }
  try {
    const r = await pool.query('SELECT id, title, excerpt, state, created_at FROM posts ORDER BY created_at DESC LIMIT $1', [count]);
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
  const { title, content, state, excerpt } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title+content required' });
  }
  if (state && !['draft', 'published'].includes(state)) {
    return res.status(400).json({ error: 'state must be draft or published' });
  }
  try {
    const r = await pool.query(
      'INSERT INTO posts (title, content, state, excerpt) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, content, state || 'draft', excerpt || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /posts/:id
app.delete('/posts/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM posts WHERE id=$1 RETURNING *', [req.params.id]);
    if (r.rowCount === 0) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ message: 'deleted', post: r.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Listening on :${PORT}`));
