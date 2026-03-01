import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { verifyToken } from '../auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', '..', 'public', 'uploads');

// Garantir que a pasta existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Apenas imagens JPG, PNG, WebP ou GIF são permitidas'));
  },
});

const router = Router();

// POST /api/upload — requer auth
router.post('/', verifyToken as any, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Nenhum arquivo enviado' });
    return;
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
