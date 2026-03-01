import { Router } from 'express';
import { getDb } from '../db.js';
import { verifyToken } from '../auth.js';
import type { AuthRequest } from '../auth.js';

const router = Router();

// GET /api/settings — público
router.get('/', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  res.json(result);
});

// PUT /api/settings — requer auth
router.put('/', verifyToken as any, (req: AuthRequest, res) => {
  const updates = req.body as Record<string, string>;

  if (!updates || typeof updates !== 'object') {
    res.status(400).json({ error: 'Body deve ser um objeto { key: value }' });
    return;
  }

  const db = getDb();
  const upsert = db.prepare(
    "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')"
  );
  const updateMany = db.transaction((entries: [string, string][]) => {
    for (const [key, value] of entries) {
      upsert.run(key, String(value));
    }
  });

  updateMany(Object.entries(updates));
  res.json({ updated: Object.keys(updates).length });
});

export default router;
