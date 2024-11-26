firebase.onAuthStateChanged(firebase.auth, (user) => {
    if (user) {
        console.log("User is signed in");
        window.userLoggedIn = true;
        window.user = user;
    } else {
        console.log("No user is signed in.");
        window.userLoggedIn = false;
        if (window.location.pathname != "/chakki-learning/" && window.location.pathname != "/chakki-learning/pages/login.html") {
            window.location.href = "/chakki-learning/pages/login.html"
        }
    }
});
