const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get("email");
    const password = formData.get("password");

    firebase.setPersistence(firebase.auth, firebase.browserSessionPersistence)
    .then(() => {
        return firebase.signInFn(firebase.auth, email, password);
    })
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
    });
})