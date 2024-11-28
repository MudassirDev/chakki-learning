import { auth, db } from '../modules/firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDocs, getDoc, collection, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
            <li class="navbar-item flexbox-left" id="home-item">
                <a href="/chakki-learning" class="navbar-item-inner flexbox-left">
                    <div class="navbar-item-inner-icon-wrapper flexbox">
                        <img src="/chakki-learning/assets/images/home.png" style="max-width: 35px;" alt="home icon" />
                    </div>
                    <span class="link-text">Home</span>
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
            <div class="head">
                <p>Filters</p>
                <p>Remove all filters</p>
            </div>
            <div class="body">
                <div class="category">
                    <p class="label">Orders</p>
                    <div class="filters">
                        <div class="filter">
                            <input type="checkbox" name="customer-orders" id="customer-orders">
                            <label for="customer-orders">Customer Orders</label>
                        </div>
                        <div class="filter">
                            <input type="checkbox" name="other-orders" id="other-orders">
                            <label for="other-orders">Other Orders</label>
                        </div>
                    </div>
                </div>
                <div class="category">
                    <p class="label">Date</p>
                    <div class="filters">
                        <div class="filter timeline">
                            <input type="date">to<input type="date">
                        </div>
                    </div>
                </div>
                <div class="category">
                    <p class="label">Customers</p>
                    <div class="filters" id="customerFilters">
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

// Render Menu Based on Login State
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.user = user;
        renderLoggedInMenu();
    } else {
        renderLoggedOutMenu();
    }
});

function renderLoggedOutMenu() {
    app.innerHTML = `
        <ul>
            <li><a class="active" href="/chakki-learning/">Home</a></li>
            <li><a href="/chakki-learning/pages/login.html">Login</a></li>
        </ul>
    `;
}

const checkUsersPerm = () => user?.displayName?.toLowerCase() === "admin";

function renderLoggedInMenu() {
    app.innerHTML = html;
    if (checkUsersPerm()) {
        document.getElementById('home-item')?.insertAdjacentHTML('afterend', `
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
                    `);
    }
    init();
    getData();
}

// Initialize Event Listeners
function init() {
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('filter-button')?.addEventListener('click', () => {
        document.querySelector('.filter-sidebar').style.transform = "translate(0px)";
    });
    document.getElementById('main')?.addEventListener('click', (e) => {
        hideFilter(e.target);
    });

    function handleLogout() {
        signOut(auth).then(() => {
            window.location.href = '/chakki-learning/';
        }).catch(console.error);
    }

    function hideFilter(target) {
        const filterSidebar = document.querySelector('.filter-sidebar');
        if (target.id !== "filter-button" && !filterSidebar.contains(target)) {
            filterSidebar.style.transform = "translate(-400px)";
        }
    }
}

// Fetch Data for Customers and Orders
async function getData() {
    const dataTable = document.querySelector('.complete-data .data-table');
    const customerFilters = document.getElementById('customerFilters');
    let totalCustomer = 0, totalOrder = 0;

    try {
        const customers = await getDocs(collection(db, "Customers"));
        const orders = await getDocs(collection(db, "Orders"));

        customers.forEach((doc) => {
            totalCustomer++;
            const data = doc.data();
            const customerId = doc.id;

            data.orders.forEach((order, i) => {
                totalOrder++;
                appendOrderRow(dataTable, customerId, i + 1, order);
            });

            appendFilter(customerFilters, customerId);
        });

        orders.forEach((doc, index) => {
            totalOrder++;
            const order = doc.data().order;
            appendOrderRow(dataTable, "-", index + 1, order, doc.id);
        });

        updateSummary(totalCustomer, totalOrder);
        initializeFilters();
    } catch (error) {
        console.error(error);
    }
}

function appendOrderRow(dataTable, customerId, index, order, orderId = order.id) {
    const rowHTML = `
        <div class="row">
            <p><span class="label">Order ID</span> ${orderId.slice(0, 3)}...${orderId.slice(-3)}</p>
            <p><span class="label">Customer</span> <span name="customer">${customerId}</span></p>
            <p><span class="label">Order Amount</span> ${order.orderAmount.toLocaleString()}</p>
            <p><span class="label">Paid Amount</span> ${order.paidAmount.toLocaleString()}</p>
            <p><span class="label">Remaining Amount</span> ${order.remainingAmount.toLocaleString()}</p>
            <p><span class="label">Action</span> <button onclick="getOrderDetails('${orderId}', '${customerId}')">View More</button></p>
        </div>
    `;
    dataTable.insertAdjacentHTML("beforeend", rowHTML);
}

function appendFilter(customerFilters, customerId) {
    const filterHTML = `
        <div class="filter customerFilter">
            <input type="checkbox" name="${customerId}" id="${customerId}">
            <label for="${customerId}">${customerId}</label>
        </div>
    `;
    customerFilters.insertAdjacentHTML('beforeend', filterHTML);
}

function updateSummary(totalCustomer, totalOrder) {
    document.getElementById('total-customers').textContent = totalCustomer;
    document.getElementById('total-orders').textContent = totalOrder;
}

// Initialize Filters
// function initializeFilters() {
//     const allFilters = document.querySelectorAll('.filter');
//     const allOrders = document.querySelectorAll('.row:not(:first-child)');
//     const customerOrderFilter = document.getElementById('customer-orders');
//     const otherOrderFilter = document.getElementById('other-orders');

//     allFilters.forEach(filter => {
//         filter.querySelector('input')?.addEventListener('change', () => {
//             applyFilters(allOrders);
//         });
//     });

//     const applyFilters = (orders) => {
//         orders.forEach((row) => {
//             row.classList.add('hide');
//             const customerName = row.querySelector('[name="customer"]').textContent.toLowerCase();

//             if (customerOrderFilter.checked && customerName !== "-") {
//                 row.classList.remove('hide');
//             } else if (otherOrderFilter.checked && customerName === "-") {
//                 row.classList.remove('hide');
//             }
//         });
//     };
// }
function initializeFilters() {
    const allFilters = document.querySelectorAll('.filter');
    const allOrders = document.querySelectorAll('.row:not(:first-child)');
    const customerOrderFilter = document.getElementById('customer-orders');
    const otherOrderFilter = document.getElementById('other-orders');
    const allCustomerFilters = [...document.querySelectorAll('.customerFilter')];
    const isShowCustomerOrder = () => { return customerOrderFilter.checked };
    const isShowOtherOrder = () => { return otherOrderFilter.checked };
    document.querySelectorAll('.filter-sidebar .body .category').forEach(category => {
        category.querySelector('.label').addEventListener('click', function () {
            const filters = category.querySelector('.filters');
            const style = window.getComputedStyle(filters);
            if (style.height == "0px") {
                filters.style.height = "auto";
                filters.style.transform = "translate(0px, 0px)";
            } else {
                filters.style.height = "0px";
                filters.style.transform = "translate(-100vw, 0px)";
            }
        })
    })
    allFilters.forEach(filter => {
        const input = filter.querySelector('input');
        if (input.getAttribute('type') == "checkbox") {
            input.addEventListener('change', () => {
                applyFilters();
            })
        }
    })
    function applyFilters() {
        allOrders.forEach(row => {
            row.classList.add('hide');
            const customerName = row.querySelector('[name="customer"]').innerHTML.toLowerCase();
            if (isShowCustomerOrder() && customerName != "-") {
                if (allCustomerFilters.every(filter => filter.querySelector('input').checked == false)) {
                    row.classList.remove('hide');
                } else {
                    allCustomerFilters.forEach(filter => {
                        if (filter.querySelector('input').checked) {
                            if (filter.querySelector('label').innerText.trim().toLowerCase() == customerName) {
                                row.classList.remove('hide')
                            }
                        }
                    })
                }
            };
            if (isShowOtherOrder() && customerName == "-") row.classList.remove('hide');
            if (!isShowCustomerOrder() && !isShowOtherOrder()) row.classList.remove('hide');
        })
    }
}

// Get Order Details
window.getOrderDetails = async (orderId, customerId) => {
    try {
        let orderData;
        if (customerId != "-") {
            const customerDoc = await getDoc(doc(db, "Customers", customerId));
            if (customerDoc.exists()) {
                const orders = customerDoc.data().orders;
                orderData = orders.find(order => order.id === orderId);
            }
        } else {
            const orderDoc = await getDoc(doc(db, "Orders", orderId));
            if (orderDoc.exists()) {
                orderData = orderDoc.data().order;
            }
        }
        if (orderData) showReceipt(orderData, customerId, orderId);
    } catch (error) {
        console.error(error);
    }
}

// Show Invoice Receipt
function showReceipt(order, customer, orderId) {
    const invoiceHTML = `
        <div class="invoice-popup-main-parent">
            <div class="overlay"></div>
            <div class="invoice-popup-main">
                <div class="invoice-container">
                    <div class="inv-title"><h1>Invoice</h1></div>
                    <div class="inv-header">
                        <div><h2>${customer || '-'}</h2></div>
                        <div><table><tr><th>Date</th><td>${order.date}</td></tr></table></div>
                    </div>
                    <div class="inv-body">
                        <table>
                            <thead><tr><th>Product</th><th>Quantity</th><th>Price</th></tr></thead>
                            <tbody>
                                ${Object.entries(order.items).map(([key, value]) => `
                                    <tr>
                                        <td>
                                            <h4>${key.split("-")[0].replace("_", " ")}</h4>
                                            <p>${value.amount}</p>
                                        </td>
                                        <td>${value.quantity}</td>
                                        <td>${value.price}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="inv-footer">
                    <div></div>
                        <table>
                            <tr><th>Remaining</th><td>${order.remainingAmount}</td></tr>
                            <tr><th>Paid</th><td>${order.paidAmount}</td></tr>
                            <tr><th>Total</th><td>${order.orderAmount}</td></tr>
                        </table>
                    </div>
                    </div>
                    <div class="inv-actions">
                        <button onclick="closeInvoice()">Close</button>
                        <button class="download-invoice" onclick="downloadInvoice(this)">Download Invoice</button>
                        ${checkUsersPerm() ? 
                            `<button class="save-invoice" onclick="saveOrder(${customer}, ${orderId})">Save</button>
                             <button class="delete-invoice" onclick="deleteOrder(${customer}, ${orderId})">Delete</button>` 
                            : ""}
                    </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', invoiceHTML);
}

window.closeInvoice = () => {
    document.querySelector('.invoice-popup-main-parent').remove();
}

window.downloadInvoice = (button) => {
    const invoiceContainer = button.closest('.invoice-popup-main').querySelector('.invoice-container');
    invoiceContainer.style.maxWidth = "unset";
    html2canvas(invoiceContainer).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = "invoice.png";
        link.click();
    });
    invoiceContainer.style.maxWidth = "90%";
}

window.saveOrder = (customer, orderId)=> {};

window.deleteOrder = (customer, orderId) => {}
