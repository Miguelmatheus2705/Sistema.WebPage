/* ── Módulo do Banco de Dados Falso (LocalStorage) ────────────────── */
const db = {
    get() {
        return JSON.parse(localStorage.getItem('clientes_db')) || [];
    },
    insert(cliente) {
        const dados = this.get();
        dados.push(cliente);
        localStorage.setItem('clientes_db', JSON.stringify(dados));
    },
    clear() {
        localStorage.removeItem('clientes_db');
    }
};

/* ── Funções de Auxílio e Validação ───────────────────────────────── */
function maskPhone(v) {
    v = v.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    return v;
}

function maskCPF(v) {
    v = v.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

function setFieldError(fieldId, hasError) {
    const container = document.getElementById(fieldId);
    if (container) {
        if (hasError) container.classList.add('has-error');
        else container.classList.remove('has-error');
    }
}

function showToast(message, duration = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Fluxo Principal de Redirecionamento Direto para o WhatsApp ──── */
function openWhatsApp(nome, telefone) {
    const limpo = telefone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá! Meus dados de cadastro:\nNome: ${nome}\nTelefone: ${telefone}`);
    const url = `https://api.whatsapp.com/send?phone=55${limpo}&text=${msg}`;
    
    // Execução síncrona imediata para o navegador não considerar um pop-up bloqueável
    window.open(url, '_blank');
}

/* ── Renderização da Tabela de Registros ────────────────────────── */
export function renderTable() {
    const tbody = document.getElementById('db-tbody');
    const regCount = document.getElementById('regCount');
    if (!tbody) return;

    const lista = db.get();
    if (regCount) regCount.textContent = lista.length;

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 2rem;">Nenhum cliente registrado localmente.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(c => `
        <tr>
            <td style="font-weight: 500;">${c.nome}</td>
            <td>${c.telefone}</td>
            <td>${c.cidade} - ${c.estado}</td>
            <td>
                <button type="button" class="tag-wa" data-nome="${c.nome}" data-tel="${c.telefone}">
                    Chamar WA
                </button>
            </td>
        </tr>
    `).join('');

    // Adiciona evento de clique direto nos botões da tabela gerada
    tbody.querySelectorAll('.tag-wa').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nome = e.currentTarget.getAttribute('data-nome');
            const tel = e.currentTarget.getAttribute('data-tel');
            openWhatsApp(nome, tel);
        });
    });
}

export function clearDB() {
    if (confirm('Deseja realmente limpar todos os registros do banco de dados local?')) {
        db.clear();
        renderTable();
        showToast('🗑 Banco de dados limpo com sucesso.');
    }
}

/* ── Processamento e Interceptação do Envio ─────────────────────── */
export function handleSubmit(event) {
    // Intercepta e impede qualquer recarregamento acidental de página
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const estado = document.getElementById('estado').value.trim().toUpperCase();

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

    const emailInvalido = !email || !email.includes('@') || !email.includes('.');
    setFieldError('f-email', emailInvalido);
    if (emailInvalido) valido = false;

    const cidadeInvalida = !cidade;
    setFieldError('f-cidade', cidadeInvalida);
    if (cidadeInvalida) valido = false;

    const estadoInvalido = !estado || estado.length !== 2;
    setFieldError('f-estado', estadoInvalido);
    if (estadoInvalido) valido = false;

    if (!valido) {
        showToast('⚠ Validação falhou. Verifique os campos em vermelho.');
        return;
    }

    const cliente = {
        id: Date.now(),
        nome,
        telefone,
        cpf,
        email,
        cidade,
        estado
    };

    db.insert(cliente);
    renderTable();
    showToast(`✅ ${nome} registrado! Abrindo WhatsApp corporativo...`);

    // Reseta o formulário limpando os campos
    document.getElementById('cadastroForm').reset();

    // Dispara a nova janela imediatamente ligada à ação de clique do usuário
    openWhatsApp(nome, telefone);
}

/* ── Inicialização do App ────────────────────────────────────────── */
export function init() {
    window.handleSubmit = handleSubmit;

    document.getElementById('telefone')?.addEventListener('input', function () { this.value = maskPhone(this.value); });
    document.getElementById('cpf')?.addEventListener('input', function () { this.value = maskCPF(this.value); });
    
    // Captura o clique direto garantindo vinculamento síncrono limpo
    document.getElementById('submitBtn')?.addEventListener('click', handleSubmit);
    document.getElementById('clearBtn')?.addEventListener('click', clearDB);

    renderTable();
}