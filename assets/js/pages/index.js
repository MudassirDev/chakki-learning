import { auth, db } from '../modules/firebase';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDocs, getDoc, collection, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const app = document.getElementById('application');

// Render Menu Based on Login State
onAuthStateChanged(auth, (user) => {
    if (user) {
        renderLoggedInMenu(user);
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

function renderLoggedInMenu(user) {
    app.innerHTML = "";
    if (user?.displayName?.toLowerCase() === "admin") {
        document.getElementById('home-item')?.insertAdjacentHTML('afterend', "somehtml");
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
            <p><span class="label">NO.</span> ${index}</p>
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
function initializeFilters() {
    const allFilters = document.querySelectorAll('.filter');
    const allOrders = document.querySelectorAll('.row:not(:first-child)');
    const customerOrderFilter = document.getElementById('customer-orders');
    const otherOrderFilter = document.getElementById('other-orders');

    allFilters.forEach(filter => {
        filter.querySelector('input')?.addEventListener('change', () => {
            applyFilters(allOrders);
        });
    });

    const applyFilters = (orders) => {
        orders.forEach((row) => {
            row.classList.add('hide');
            const customerName = row.querySelector('[name="customer"]').textContent.toLowerCase();

            if (customerOrderFilter.checked && customerName !== "-") {
                row.classList.remove('hide');
            } else if (otherOrderFilter.checked && customerName === "-") {
                row.classList.remove('hide');
            }
        });
    };
}

// Get Order Details
async function getOrderDetails(orderId, customerId = null) {
    try {
        let orderData;
        if (customerId) {
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
        if (orderData) showReceipt(orderData, customerId);
    } catch (error) {
        console.error(error);
    }
}

// Show Invoice Receipt
function showReceipt(order, customer) {
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
                        <table>
                            <tr><th>Remaining</th><td>${order.remainingAmount}</td></tr>
                            <tr><th>Paid</th><td>${order.paidAmount}</td></tr>
                            <tr><th>Total</th><td>${order.orderAmount}</td></tr>
                        </table>
                    </div>
                    <div class="inv-actions">
                        <button onclick="closeInvoice()">Close</button>
                        <button class="download-invoice" onclick="downloadInvoice(this)">Download Invoice</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', invoiceHTML);
}

function closeInvoice() {
    document.querySelector('.invoice-popup-main-parent').remove();
}

function downloadInvoice(button) {
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
