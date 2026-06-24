
const CONFIG = {
    WHATSAPP: {
        PHONE_NUMBER: '5517997114146',
        BASE_URL: 'https://wa.me/'
    }
};

const buildWhatsAppMessage = (userData) => {
    return `Olá! Acabei de me cadastrar no site e gostaria de falar com vocês. 😊\n\n` +
           `*Nome:* ${userData.nome}\n` +
           `*Telefone:* +55 ${userData.telefone}\n` +
           `*CPF:* ${userData.cpf}\n` +
           `*E-mail:* ${userData.email}\n` +
           `*Cidade/UF:* ${userData.cidade} - ${userData.estado}`;
};

export const openWhatsApp = (userData) => {
    const rawMessage = buildWhatsAppMessage(userData);
    const encodedMessage = encodeURIComponent(rawMessage);
    const targetUrl = `${CONFIG.WHATSAPP.BASE_URL}${CONFIG.WHATSAPP.PHONE_NUMBER}?text=${encodedMessage}`;
    
    // Boa prática de segurança (noopener, noreferrer) ao abrir novas abas
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

const handleFormSubmit = (event) => {
    event.preventDefault();

    // O FormData captura automaticamente todos os campos que possuem o atributo 'name'
    const formElement = event.target;
    const formData = new FormData(formElement);
    const userData = Object.fromEntries(formData.entries());

    openWhatsApp(userData);
};

export const init = () => {
    const form = document.querySelector('#form-cadastro');

    // Early return: Se o formulário não existir, avisa e encerra a função.
    if (!form) {
        console.warn('[App Init] Formulário "#form-cadastro" não encontrado no DOM.');
        return;
    }

    form.addEventListener('submit', handleFormSubmit);
};