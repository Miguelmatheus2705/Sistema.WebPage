/* ============================================================
   CADASTRO WHATSAPP — Banco de Dados
   Arquivo: database.js

   Persistência local via localStorage.
   Para migrar para backend (MySQL, PostgreSQL, etc.),
   substitua apenas as implementações mantendo a mesma API.
   ============================================================ */

const STORAGE_KEY = 'cw_clientes_v2';

function _read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('[DB] Erro ao ler:', e);
    return [];
  }
}

function _write(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('[DB] Erro ao gravar:', e);
    return false;
  }
}

export const db = {
  /** Retorna todos os registros (mais recente primeiro) */
  getAll() {
    return _read().sort((a, b) => b.id - a.id);
  },

  /** Busca por id */
  getById(id) {
    return _read().find(c => c.id === id);
  },

  /** Insere novo cliente */
  insert(cliente) {
    if (!cliente?.id) return false;
    const data = _read();
    data.push(cliente);
    const ok = _write(data);
    if (ok) console.info(`[DB] Inserido: ${cliente.nome} (id=${cliente.id})`);
    return ok;
  },

  /** Atualiza campos de um cliente */
  update(id, campos) {
    const data = _read();
    const idx = data.findIndex(c => c.id === id);
    if (idx === -1) return false;
    data[idx] = { ...data[idx], ...campos, id };
    return _write(data);
  },

  /** Remove cliente pelo id */
  delete(id) {
    return _write(_read().filter(c => c.id !== id));
  },

  /** Busca por nome ou CPF */
  search(query) {
    const q = query.toLowerCase().trim();
    return _read().filter(c =>
      c.nome.toLowerCase().includes(q) ||
      c.cpf.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    );
  },

  /** Exporta como JSON formatado */
  exportJSON() {
    return JSON.stringify(_read(), null, 2);
  }
};