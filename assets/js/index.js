const app = document.getElementById('application');
const html = `
    <nav id="navbar">
        <ul class="navbar-items flexbox-col">
            <li class="navbar-logo flexbox-left">
                <a href="/chakki-learning" class="navbar-item-inner flexbox">
                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1"
                        viewBox="0 0 1438.88 1819.54">
                        <polygon points="925.79 318.48 830.56 0 183.51 1384.12 510.41 1178.46 925.79 318.48" />
                        <polygon
                            points="1438.88 1663.28 1126.35 948.08 111.98 1586.26 0 1819.54 1020.91 1250.57 1123.78 1471.02 783.64 1663.28 1438.88 1663.28" />
                    </svg>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a href="/chakki-learning" class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="/chakki-learning/assets/images/home.png" style="max-width: 35px;" alt="home icon" />
                    </div>
                    <span class="link-text">Home</span>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a href="/chakki-learning/pages/createcustomer.html" class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="/chakki-learning/assets/images/customer.png" style="max-width: 30px;" alt="customer icon" />
                    </div>
                    <span class="link-text">Create Customer</span>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a href="/chakki-learning/pages/createorder.html" class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="/chakki-learning/assets/images/order.png" style="max-width: 35px;" alt="order icon">
                    </div>
                    <span class="link-text">Create Order</span>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a href="/chakki-learning/pages/createorderforcustomer.html" class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="/chakki-learning/assets/images/order.png" style="max-width: 35px;" alt="order icon">
                    </div>
                    <span class="link-text">Create Order (For Customer)</span>
                </a>
            </li>
            <li class="navbar-item flexbox-left">
                <a class="navbar-item-inner flexbox-left" id="logoutBtn">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="/chakki-learning/assets/images/logout.png" style="max-width: 35px;" alt="logout icon">
                    </div>
                    <span class="link-text">Logout</span>
                </a>
            </li>
        </ul>
    </nav>
    <div id="main">
        <div class="total-details">
            <div class="container">
                <div class="header">
                    <h6>Total Orders</h6>
                </div>
                <div class="body"><p id="total-orders"></p></div>
            </div>
            <div class="container">
                <div class="header">
                    <h6>Total Customers</h6>
                </div>
                <div class="body"><p id="total-customers"></p></div>
            </div>
        </div>

        <div class="complete-data">
            
            <div class="data-controls">
                <button id="filter-button" class="filter-button">Filter</button>
            </div>
            <div class="data-table">
                <div class="row head">
                    <p>NO.</p>
                    <p>Order ID</p>
                    <p>Customer</p>
                    <p>Order Amount</p>
                    <p>Paid Amount</p>
                    <p>Remaining Amount</p>
                    <p>Action</p>
                </div>
            </div>

        </div>
        <div class="filter-sidebar">
        </div>
    </div>
`

let intervalId = setInterval(() => {
    if (window.userLoggedIn != undefined) {
        clearInterval(intervalId);
        intervalId = null;

        if (window.userLoggedIn == true) {
            app.innerHTML = html;

            console.log(user.displayName)

            init();
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


function init() {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function () {
        firebase.signOut(firebase.auth).then(() => {
            window.location.href = '/chakki-learning/';
        }).catch((error) => {
            console.log(error)
        });
    });

    const filterBtn = document.getElementById('filter-button');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const mainDiv = document.getElementById('main');

    filterBtn.addEventListener('click', () => {
        filterSidebar.style.transform = "translate(0px)";
    })
    mainDiv.addEventListener('click', (e) => { hideFilter(e.target) })

    function hideFilter(e) {
        if (e.id != "filter-button" && !filterSidebar.contains(e)) {
            filterSidebar.style.transform = "translate(-400px)";
        }
    }
}

async function getData () {
    const dataTable = document.querySelector('.complete-data .data-table');
    let totalCustomer = 0;
    let totalOrder = 0;
    try {
        const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
        querySnapshot.forEach(item => {
            totalCustomer += 1;
            const data = item.data();
            const customer = item.id;
                for (let i = 0; i < data.orders.length; i++) {
                    totalOrder += 1;
                    const order = data.orders[i];
                    const row = `
                    <div class="row">
                        <p><span class="label">NO.</span> ${i + 1}</p>
                        <p><span class="label">Order ID</span> ${order.id.slice(0, 3)}...${order.id.slice(-3)}</p>
                        <p><span class="label">Customer</span> ${capitalizeWords(customer)}</p>
                        <p><span class="label">Order Amount</span> ${order.orderAmount.toLocaleString()}</p>
                        <p><span class="label">Paid Amount</span> ${order.paidAmount.toLocaleString()}</p>
                        <p><span class="label">Remaining Amount</span> ${order.remainingAmount.toLocaleString()}</p>
                        <p><span class="label">Action</span> <button>View More</button></p>
                    </div>
                    `
                    dataTable.insertAdjacentHTML("beforeend", row);
                }
        })
    } catch (error) {
        console.log(error)
    }

    try {
        const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Orders"));
        let index = 0;
        querySnapshot.forEach(item => {
            totalOrder += 1;
            index += 1;
            const order = item.data().order;
            const orderId = item.id;
            const row = `
                    <div class="row">
                        <p><span class="label">NO.</span> ${index}</p>
                        <p><span class="label">Order ID</span> ${orderId.slice(0, 3)}...${orderId.slice(-3)}</p>
                        <p><span class="label">Customer</span> -</p>
                        <p><span class="label">Order Amount</span> ${order.orderAmount.toLocaleString()}</p>
                        <p><span class="label">Paid Amount</span> ${order.paidAmount.toLocaleString()}</p>
                        <p><span class="label">Remaining Amount</span> ${order.remainingAmount.toLocaleString()}</p>
                        <p><span class="label">Action</span> <button>View More</button></p>
                    </div>
                    `
            dataTable.insertAdjacentHTML("beforeend", row);
        })
    } catch (error) {
        console.log(error)
    }

    const copyTable = [...document.querySelector('.complete-data .data-table').querySelectorAll('.row')];
    copyTable.shift();
    copyTable.forEach((item, index) => {
        item.querySelector('p').innerHTML = `<p><span class="label">NO.</span> ${index + 1}</p>`
    })

    document.getElementById('total-customers').innerHTML = totalCustomer;
    document.getElementById('total-orders').innerHTML = totalOrder;
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}