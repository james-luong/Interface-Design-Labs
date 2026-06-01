// Lab 10 — Express API backend for Travel Destinations CRUD
// Run: node server.js
// Requires a .env file with DB credentials (copy .env.example)

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// ── Serve the built Vue frontend (run `npm run build` first) ──────────────
const distDir = path.join(__dirname, 'dist')
app.use(express.static(distDir))

// ── MySQL connection pool ─────────────────────────────────────────────────
const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'lab10_travel',
  port:             process.env.DB_PORT     || 3306,
  waitForConnections: true,
  connectionLimit:  10
})

pool.getConnection()
  .then(c => { console.log('✅ Connected to MySQL'); c.release() })
  .catch(e => console.error('❌ DB connection failed:', e.message))

// ── GET /api/destinations  (paginated, filterable) ───────────────────────
app.get('/api/destinations', async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1)
    const limit    = Math.max(1, parseInt(req.query.limit) || 5)
    const search   = req.query.search   || ''
    const category = req.query.category || ''
    const offset   = (page - 1) * limit

    const where  = []
    const params = []

    if (search) {
      where.push('(name LIKE ? OR country LIKE ? OR description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    if (category) {
      where.push('category = ?')
      params.push(category)
    }

    const w = where.length ? 'WHERE ' + where.join(' AND ') : ''

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM destinations ${w}`, params)
    const [rows]        = await pool.query(
      `SELECT * FROM destinations ${w} ORDER BY id LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    res.json({
      data: rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch destinations' })
  }
})

// ── GET /api/destinations/:id ─────────────────────────────────────────────
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: 'Failed to fetch' }) }
})

// ── POST /api/destinations ────────────────────────────────────────────────
app.post('/api/destinations', async (req, res) => {
  try {
    const { name, country, category, description, rating } = req.body
    if (!name || !country || !category || rating == null)
      return res.status(400).json({ error: 'name, country, category and rating are required' })
    if (rating < 0 || rating > 5)
      return res.status(400).json({ error: 'Rating must be 0–5' })

    const [result] = await pool.query(
      'INSERT INTO destinations (name, country, category, description, rating) VALUES (?, ?, ?, ?, ?)',
      [name, country, category, description || '', parseFloat(rating)]
    )
    const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create' })
  }
})

// ── PUT /api/destinations/:id ─────────────────────────────────────────────
app.put('/api/destinations/:id', async (req, res) => {
  try {
    const { name, country, category, description, rating } = req.body
    if (!name || !country || !category || rating == null)
      return res.status(400).json({ error: 'name, country, category and rating are required' })
    if (rating < 0 || rating > 5)
      return res.status(400).json({ error: 'Rating must be 0–5' })

    const [result] = await pool.query(
      'UPDATE destinations SET name=?, country=?, category=?, description=?, rating=? WHERE id=?',
      [name, country, category, description || '', parseFloat(rating), req.params.id]
    )
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' })
    const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update' })
  }
})

// ── DELETE /api/destinations/:id ──────────────────────────────────────────
app.delete('/api/destinations/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM destinations WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete' })
  }
})

// ── GET /api/categories ───────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT category FROM destinations ORDER BY category')
    res.json(rows.map(r => r.category))
  } catch (e) { res.status(500).json({ error: 'Failed to fetch categories' }) }
})

// ── SPA fallback: send index.html for any non-API route ───────────────────
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`))
