firebase.onAuthStateChanged(firebase.auth, (user) => {
    if (user) {
        console.log("User is signed in:", user);
        window.userLoggedIn = true;
    } else {
        console.log("No user is signed in.");
        window.userLoggedIn = false;
    }
});
