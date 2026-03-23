import { Router } from 'express';
import { getDb } from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/events — público, retorna eventos ativos ordenados por data
router.get('/', (_req, res) => {
  const db = getDb();
  const events = db.prepare(
    `SELECT id, name, date, time, location, city, is_free FROM events WHERE active = 1 ORDER BY date ASC`
  ).all();
  res.json(events);
});

// GET /api/events/all — admin, retorna todos (incluindo inativos)
router.get('/all', verifyToken as any, (_req, res) => {
  const db = getDb();
  const events = db.prepare(
    `SELECT id, name, date, time, location, city, is_free, active FROM events ORDER BY date ASC`
  ).all();
  res.json(events);
});

// POST /api/events — auth
router.post('/', verifyToken as any, (req, res) => {
  const { name, date, time = '', location = '', city = '', is_free = 1 } = req.body;
  if (!name || !date) {
    res.status(400).json({ error: 'name e date são obrigatórios' });
    return;
  }
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO events (name, date, time, location, city, is_free) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(name, date, time, location, city, is_free ? 1 : 0);
  res.json({ id: result.lastInsertRowid, name, date, time, location, city, is_free: is_free ? 1 : 0, active: 1 });
});

// PUT /api/events/:id — auth
router.put('/:id', verifyToken as any, (req, res) => {
  const { name, date, time = '', location = '', city = '', is_free = 1, active = 1 } = req.body;
  if (!name || !date) {
    res.status(400).json({ error: 'name e date são obrigatórios' });
    return;
  }
  const db = getDb();
  db.prepare(
    `UPDATE events SET name=?, date=?, time=?, location=?, city=?, is_free=?, active=? WHERE id=?`
  ).run(name, date, time, location, city, is_free ? 1 : 0, active ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

// DELETE /api/events/:id — auth
router.delete('/:id', verifyToken as any, (req, res) => {
  const db = getDb();
  db.prepare(`DELETE FROM events WHERE id=?`).run(req.params.id);
  res.json({ ok: true });
});

export default router;
