
function checkAuth() {
    if (sessionStorage.hasOwnProperty('hasLoggedIn')) {
    } else {
        window.location.href = "auth-login.html"
    }
}
window.onpaint = checkAuth();

function logout() {
    sessionStorage.clear();
    window.location.href = "auth-login.html"
}