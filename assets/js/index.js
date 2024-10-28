const app = document.getElementById('application');

if (userLoggedIn) {
    app.innerHTML = `<p>This is homepage</p>`;
} else {
    app.innerHTML = `<a href="/chakki-learning/pages/login.html">Login</a>`;
}