// Variables globales
let accessToken = '';
let pageId = '';
let pageName = '';

// Inicializar Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: CONFIG.APP_ID,
        cookie: true,
        xfbml: true,
        version: CONFIG.APP_VERSION
    });
    
    console.log('Facebook SDK inicializado');
};

// Cargar SDK Facebook
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/es_LA/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Función de login
function loginToFacebook() {
    FB.login(function(response) {
        if (response.authResponse) {
            accessToken = response.authResponse.accessToken;
            showDashboard();
            getUserPages();
        } else {
            showResult('❌ Usuario canceló el login');
        }
    }, {scope: CONFIG.SCOPE});
}

// Mostrar dashboard después del login
function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// Obtener páginas del usuario
function getUserPages() {
    FB.api('/me/accounts', function(response) {
        if (response.data && response.data.length > 0) {
            pageId = response.data[0].id;
            pageName = response.data[0].name;
            showResult(`✅ Conectado a: <strong>${pageName}</strong><br>ID: ${pageId}`);
        } else {
            showResult('❌ No se encontraron páginas administradas');
        }
    });
}

// Dar like a publicación reciente
function likeRecentPost() {
    if (!pageId) {
        showResult('❌ Primero conecta una página');
        return;
    }
    
    showResult('⏳ Buscando publicación reciente...');
    
    FB.api(`/${pageId}/posts?limit=1&fields=id,message`, function(response) {
        if (response.data && response.data.length > 0) {
            const postId = response.data[0].id;
            const postMessage = response.data[0].message || 'Sin texto';
            
            FB.api(`/${postId}/likes`, 'POST', function(likeResponse) {
                if (likeResponse.error) {
                    showResult(`❌ Error: ${likeResponse.error.message}`);
                } else {
                    showResult(`✅ Like dado correctamente a:<br><em>"${postMessage.substring(0, 50)}..."</em>`);
                }
            });
        } else {
            showResult('❌ No se encontraron publicaciones');
        }
    });
}

// Mostrar resultados en la interfaz
function showResult(message) {
    document.getElementById('result').innerHTML = message;
}

// Ver estadísticas de la página
function getPageInsights() {
    if (!pageId) {
        showResult('❌ Primero conecta una página');
        return;
    }
    
    FB.api(`/${pageId}?fields=fan_count,followers_count,likes`, function(response) {
        if (response.error) {
            showResult(`❌ Error: ${response.error.message}`);
        } else {
            showResult(`
                📊 Estadísticas de <strong>${pageName}</strong>:<br><br>
                👥 Fans: ${response.fan_count || 0}<br>
                📈 Seguidores: ${response.followers_count || 0}<br>
                👍 Likes: ${response.likes || 0}
            `);
        }
    });
          }
