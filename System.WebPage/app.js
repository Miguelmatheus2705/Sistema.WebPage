/* ============================================================
   CADASTRO WHATSAPP — Script Principal
   Arquivo: app.js
   ============================================================ */

import { db } from './database.js';

const CONFIG = {
  WHATSAPP: {
    PHONE_NUMBER: '5517997114146',
  }
};

/* ── Abrir WhatsApp ─────────────────────────────────────────── */
export function openWhatsApp(nome, telefone, cpf, email, cidade, estado) {
  const msg = encodeURIComponent(
    `Olá! Acabei de me cadastrar e gostaria de falar com vocês. 😊\n\n` +
    `*Nome:* ${nome}\n` +
    `*Telefone:* +55 ${telefone}\n` +
    `*CPF:* ${cpf}\n` +
    `*E-mail:* ${email}\n` +
    `*Cidade:* ${cidade} - ${estado}`
  );
  const url = `https://wa.me/${CONFIG.WHATSAPP.PHONE_NUMBER}?text=${msg}`;

  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}



/* ── Máscaras ───────────────────────────────────────────────── */
export function maskPhone(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10)     v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
  else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length > 0) v = `(${v}`;
  return v;
}

export function maskCPF(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9)      v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
  else if (v.length > 6) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
  else if (v.length > 3) v = `${v.slice(0,3)}.${v.slice(3)}`;
  return v;
}

/* ── Validação de CPF ───────────────────────────────────────── */
export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += +cpf[i] * (10 - i);
  let r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
  if (r !== +cpf[9]) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += +cpf[i] * (11 - i);
  r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
  return r === +cpf[10];
}

/* ── Escape HTML ────────────────────────────────────────────── */
export function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ── Toast ──────────────────────────────────────────────────── */
let toastTimer = null;
export function showToast(msg, duration = 3500) {
  const el = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!el || !msgEl) return;
  msgEl.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ── Erros de campo ─────────────────────────────────────────── */
export function setFieldError(fieldId, hasError) {
  document.getElementById(fieldId)?.classList.toggle('has-error', hasError);
}

/* ── Renderizar tabela ──────────────────────────────────────── */
export function renderTable() {
  const data = db.getAll();
  const body = document.getElementById('dbBody');
  const badge = document.getElementById('countBadge');
  if (!body) return;
  if (badge) badge.textContent = data.length;

  if (!data.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="6">Nenhum cliente cadastrado ainda.</td></tr>`;
    return;
  }

  body.innerHTML = data.map((c, i) => `
    <tr>
      <td style="color:var(--muted);font-size:.78rem">${i + 1}</td>
      <td style="font-weight:500">${esc(c.nome)}</td>
      <td style="color:var(--muted);font-family:monospace">${esc(c.telefone)}</td>
      <td style="font-family:monospace;letter-spacing:.03em">${esc(c.cpf)}</td>
      <td>${esc(c.email)}</td>
      <td>
        <span class="tag-wa" onclick="window.__openWA('${esc(c.nome)}','${esc(c.telefone)}','${esc(c.cpf)}','${esc(c.email)}','${esc(c.cidade)}','${esc(c.estado)}')">
          <svg viewBox="0 0 32 32">
            <path d="M16 2C8.28 2 2 8.28 2 16c0 2.44.65 4.74 1.79 6.72L2 30l7.5-1.75A13.92 13.92 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.3 19.56c-.3.84-1.76 1.6-2.42 1.67-.65.07-1.27.32-4.27-.9C13 21.04 10.4 17.3 10.2 17.05c-.2-.26-1.6-2.13-1.6-4.07 0-1.93 1.02-2.88 1.38-3.27.37-.4.8-.5 1.07-.5h.77c.25 0 .58-.1.9.68.32.8 1.1 2.73 1.2 2.93.1.2.16.43.03.68-.13.27-.2.43-.4.67-.2.23-.42.52-.6.7-.2.2-.4.4-.17.78.23.38 1.02 1.68 2.2 2.73 1.5 1.34 2.78 1.75 3.16 1.95.38.2.6.17.82-.1.23-.27.97-1.13 1.23-1.52.26-.4.52-.33.87-.2.36.13 2.28 1.08 2.67 1.28.38.2.64.3.73.46.1.17.1.97-.2 1.8z"/>
          </svg>
          Abrir chat
        </span>
      </td>
    </tr>
  `).join('');
}

/* ── Submit ─────────────────────────────────────────────────── */
export function handleSubmit() {
  const nome     = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const cpf      = document.getElementById('cpf').value.trim();
  const email    = document.getElementById('email').value.trim();
  const cidade   = document.getElementById('cidade').value.trim();
  const estado   = document.getElementById('estado').value.trim().toUpperCase();

  let valido = true;

  const nomeInvalido = !nome || nome.split(' ').filter(Boolean).length < 2;
  setFieldError('f-nome', nomeInvalido);
  if (nomeInvalido) valido = false;

  const telInvalido = telefone.replace(/\D/g, '').length < 10;
  setFieldError('f-tel', telInvalido);
  if (telInvalido) valido = false;

  const cpfInvalido = !validarCPF(cpf);
  setFieldError('f-cpf', cpfInvalido);
  if (cpfInvalido) valido = false;

  const emailInvalido = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setFieldError('f-email', emailInvalido);
  if (emailInvalido) valido = false;

  const cidadeInvalida = !cidade;
  setFieldError('f-cidade', cidadeInvalida);
  if (cidadeInvalida) valido = false;

  const estadoInvalido = estado.length !== 2;
  setFieldError('f-estado', estadoInvalido);
  if (estadoInvalido) valido = false;

  if (!valido) {
    showToast('⚠ Corrija os campos destacados em vermelho.', 4000);
    return;
  }

  const cliente = {
    id: Date.now(),
    nome, telefone, cpf, email, cidade, estado,
    data: new Date().toLocaleString('pt-BR')
  };

  db.insert(cliente);
  renderTable();
  showToast(`✅ ${nome} cadastrado! Abrindo WhatsApp…`);

  ['nome', 'telefone', 'cpf', 'email', 'cidade', 'estado']
    .forEach(id => document.getElementById(id).value = '');
  ['f-nome', 'f-tel', 'f-cpf', 'f-email', 'f-cidade', 'f-estado']
    .forEach(id => setFieldError(id, false));

  openWhatsApp(nome, telefone, cpf, email, cidade, estado);
}

/* ── Limpar banco ───────────────────────────────────────────── */
export function clearDB() {
  if (!confirm('Deseja apagar TODOS os registros?')) return;
  db.clear();
  renderTable();
  showToast('🗑 Banco de dados limpo com sucesso.');
}

/* ── Bootstrap ──────────────────────────────────────────────── */
export function init() {
  window.__openWA = openWhatsApp;

  document.getElementById('telefone')
    ?.addEventListener('input', function () { this.value = maskPhone(this.value); });

  document.getElementById('cpf')
    ?.addEventListener('input', function () { this.value = maskCPF(this.value); });

  document.getElementById('submitBtn')
    ?.addEventListener('click', handleSubmit);

  document.getElementById('clearBtn')
    ?.addEventListener('click', clearDB);

  renderTable();
}