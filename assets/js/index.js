const app = document.getElementById('application');

function render() {
    if (userLoggedIn != undefined) {
        if (userLoggedIn) {
            app.innerHTML = `<p>This is homepage</p>`;
        } else {
            app.innerHTML = `<a href="/chakki-learning/pages/login.html">Login</a>`;
        }
    } else {
        return render();
    }
}

render();