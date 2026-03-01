import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as
    | { id: number; email: string; password_hash: string }
    | undefined;

  if (!user) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '8h' });

  res.json({ token, expiresIn: 8 * 60 * 60 });
});

export default router;
