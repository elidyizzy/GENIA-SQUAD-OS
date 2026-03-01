import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { verifyToken } from '../auth.js';
import type { AuthRequest } from '../auth.js';

const router = Router();

// PUT /api/admin/password — altera senha do admin logado
router.put('/password', verifyToken as any, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'currentPassword e newPassword são obrigatórios' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.userId) as
    | { id: number; password_hash: string }
    | undefined;

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Senha atual incorreta' });
    return;
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(newHash, req.userId);
  res.json({ updated: true });
});

export default router;
