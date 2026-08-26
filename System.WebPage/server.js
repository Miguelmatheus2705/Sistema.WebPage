import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'Sistema.WebPage', 'System.WebPage')));

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'Sistema.WebPage', 'System.WebPage', 'Cadastro Whatsapp.html'));
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'Sistema.WebPage', 'System.WebPage', 'Cadastro Whatsapp.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
