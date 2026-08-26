const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const SITE_DIR = path.join(__dirname, '..', 'System.WebPage');

app.use(express.static(SITE_DIR));

app.get('*', (req, res) => {
  res.sendFile(path.join(SITE_DIR, 'Cadastro Whatsapp.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Servidor] Rodando em http://localhost:${PORT}`);
  console.log(`[Servidor] Site: ${SITE_DIR}`);
});
