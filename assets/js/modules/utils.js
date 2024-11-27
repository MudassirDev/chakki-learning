import { auth } from "./firebase.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

export const checkUser = () => {
    onAuthStateChanged(auth, (user) => {
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
}

export const initLogout = () => {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function() {
        signOut(auth).then(() => {
            window.location.href = '/chakki-learning/';
        }).catch((error) => {
            console.log(error)
        });
    })
}