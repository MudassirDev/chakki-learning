const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get("email");
    const password = formData.get("password");

    firebase.signInFn(firebase.auth, email, password).then(data => {
        console.log(data)
    }).catch(err => {
        console.log(err)
    })
})