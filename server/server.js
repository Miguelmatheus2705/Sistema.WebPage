const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const SITE_DIR = path.join(__dirname, '..', 'System.WebPage');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.static(SITE_DIR, {
  maxAge: '1h',
  etag: true
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(SITE_DIR, 'Cadastro Whatsapp.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║   SERVIDOR RODANDO COM SUCESSO!      ║`);
  console.log(`  ╠══════════════════════════════════════╣`);
  console.log(`  ║  Local:  http://localhost:${PORT}       ║`);
  console.log(`  ║  Rede:   http://0.0.0.0:${PORT}        ║`);
  console.log(`  ║  Pasta:  ${SITE_DIR.substring(0, 28).padEnd(28)}║`);
  console.log(`  ╚══════════════════════════════════════╝\n`);
});
