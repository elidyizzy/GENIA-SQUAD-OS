import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getDb } from './server/db.js';
import authRoutes from './server/routes/authRoutes.js';
import settingsRoutes from './server/routes/settingsRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import uploadRoutes from './server/routes/uploadRoutes.js';
import eventsRoutes from './server/routes/eventsRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === 'production';

// Pasta de uploads (configurável via env para volume Railway)
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware
app.use(express.json());

// CORS — apenas em desenvolvimento (em produção tudo é mesmo origin)
if (!isProd) {
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (_req.method === 'OPTIONS') { res.sendStatus(204); return; }
    next();
  });
}

// Servir imagens enviadas via upload
app.use('/uploads', express.static(UPLOADS_DIR));

// Inicializar banco
getDb();

// Rotas API
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/events', eventsRoutes);

// Em produção: servir o frontend React (dist/) e fallback para SPA routing
if (isProd) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Cuore ${isProd ? 'produção' : 'dev'} rodando em http://localhost:${PORT}`);
});
