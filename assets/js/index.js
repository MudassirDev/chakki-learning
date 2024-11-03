const app = document.getElementById('application');

let intervalId = setInterval(()=>{
    if (window.userLoggedIn != undefined) {
        clearInterval(intervalId);
        intervalId = null;
        
        if (window.userLoggedIn == true) {
            app.innerHTML = `
                <nav id="navbar">
        <ul class="navbar-items flexbox-col">
            <li class="navbar-logo flexbox-left">
                <a class="navbar-item-inner flexbox">
                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1"
                        viewBox="0 0 1438.88 1819.54">
                        <polygon points="925.79 318.48 830.56 0 183.51 1384.12 510.41 1178.46 925.79 318.48" />
                        <polygon
                            points="1438.88 1663.28 1126.35 948.08 111.98 1586.26 0 1819.54 1020.91 1250.57 1123.78 1471.02 783.64 1663.28 1438.88 1663.28" />
                    </svg>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="assets/images/home.png" style="max-width: 35px;" alt="home icon" />
                    </div>
                    <span class="link-text">Home</span>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="assets/images/customer.png" style="max-width: 30px;" alt="customer icon" />
                    </div>
                    <span class="link-text">Create Customer</span>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="assets/images/order.png" style="max-width: 35px;" alt="order icon">
                    </div>
                    <span class="link-text">Create Order</span>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="assets/images/logout.png" style="max-width: 35px;" alt="logout icon">
                    </div>
                    <span class="link-text">Logout</span>
                </a>
            </li>
        </ul>
    </nav>
            `;
            const logoutBtn = document.getElementById('logoutBtn');
  
            logoutBtn.addEventListener('click', function() {
                firebase.signOut(firebase.auth).then(() => {
                    window.location.href = '/chakki-learning/';
                  }).catch((error) => {
                    console.log(error)
                  });
            });

            getData();
        } else {
            app.innerHTML = `
            <ul>
                <li><a class="active" href="/chakki-learning/">Home</a></li>
                <li><a href="/chakki-learning/pages/login.html">Login</a></li>
            </ul>
            `;
        }
    }
}, 100);


async function getData() {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    querySnapshot.forEach(item => {console.log(item.data())})
}