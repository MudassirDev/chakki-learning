const app = document.getElementById('application');


let intervalId = setInterval(()=>{
    if (window.userLoggedIn != undefined) {
        clearInterval(intervalId);
        intervalId = null;
        
        if (window.userLoggedIn == true) {
            app.innerHTML = `<p>This is homepage</p>`;
        } else {
            app.innerHTML = `<a href="/chakki-learning/pages/login.html">Login</a>`;
        }
    }
}, 100);