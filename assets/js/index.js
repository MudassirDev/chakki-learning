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
`

let intervalId = setInterval(() => {
    if (window.userLoggedIn != undefined) {
        clearInterval(intervalId);
        intervalId = null;

        if (window.userLoggedIn == true) {
            app.innerHTML = html;

            if (user?.displayName?.toLowerCase() == "admin") {
                document.getElementById('home-item').insertAdjacentHTML('afterend', `
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
                    `)
            }

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

async function getData() {
    const dataTable = document.querySelector('.complete-data .data-table');
    const customerFilters = document.getElementById('customerFilters');
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
                        <p><span class="label">Customer</span> <span name="customer">${customer}</span></p>
                        <p><span class="label">Order Amount</span> ${order.orderAmount.toLocaleString()}</p>
                        <p><span class="label">Paid Amount</span> ${order.paidAmount.toLocaleString()}</p>
                        <p><span class="label">Remaining Amount</span> ${order.remainingAmount.toLocaleString()}</p>
                        <p><span class="label">Action</span> <button onclick="getOrderDetails('${order.id}', '${customer}')">View More</button></p>
                    </div>
                    `
                dataTable.insertAdjacentHTML("beforeend", row);
            }


            const filterHtml = `<div class="filter customerFilter"><input type="checkbox" name="${customer}" id="${customer}"><label for="${customer}">${customer}</label></div>`
            customerFilters.insertAdjacentHTML('beforeend', filterHtml);
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
                        <p><span class="label">Customer</span> <span name="customer">-</span></p>
                        <p><span class="label">Order Amount</span> ${order.orderAmount.toLocaleString()}</p>
                        <p><span class="label">Paid Amount</span> ${order.paidAmount.toLocaleString()}</p>
                        <p><span class="label">Remaining Amount</span> ${order.remainingAmount.toLocaleString()}</p>
                        <p><span class="label">Action</span> <button onclick="getOrderDetails('${orderId}')">View More</button></p>
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
    initializeFilters();
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}


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

async function getOrderDetails(orderId, customer) {
    if (customer) {
        try {
            const docSnap = await firebase.getDoc(firebase.doc(firebase.db, "Customers", customer));
            if (docSnap.exists()) {
                const allOrders = docSnap.data().orders;
                const order = allOrders.find(order => order.id == orderId);
            } else {
                console.log("Not Found!")
            }
        } catch (error) {
            console.error(error)
        }
    } else {
        try {
            const docSnap = await firebase.getDoc(firebase.doc(firebase.db, "Orders", orderId));
            if (docSnap.exists()) {
                const order = docSnap.data().order;
            } else {
                console.log("Not Found!")
            }
        } catch (error) {
            console.error(error)
        }
    }
}


function showReceipt() {


    // Create the main container
    const invoicePopupMain = document.createElement('div');
    invoicePopupMain.classList.add('invoice-popup-main');

    // Invoice container
    const invoiceContainer = document.createElement('div');
    invoiceContainer.classList.add('invoice-container');

    // Title section
    const invTitle = document.createElement('div');
    invTitle.classList.add('inv-title');
    const titleHeading = document.createElement('h1');
    titleHeading.textContent = 'Invoice';
    invTitle.appendChild(titleHeading);

    // Header section
    const invHeader = document.createElement('div');
    invHeader.classList.add('inv-header');

    const customerDiv = document.createElement('div');
    const customerName = document.createElement('h2');
    customerName.textContent = 'Customer Name';
    customerDiv.appendChild(customerName);

    const dateDiv = document.createElement('div');
    const dateTable = document.createElement('table');
    const dateRow = document.createElement('tr');
    const dateTh = document.createElement('th');
    dateTh.textContent = 'Date';
    const dateTd = document.createElement('td');
    dateTd.textContent = '12-02-2018';

    dateRow.appendChild(dateTh);
    dateRow.appendChild(dateTd);
    dateTable.appendChild(dateRow);
    dateDiv.appendChild(dateTable);

    invHeader.appendChild(customerDiv);
    invHeader.appendChild(dateDiv);

    // Body section
    const invBody = document.createElement('div');
    invBody.classList.add('inv-body');

    const productTable = document.createElement('table');

    // Table header
    const tableHead = document.createElement('thead');
    const headers = ['Product', 'Quantity', 'Price'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        tableHead.appendChild(th);
    });

    // Table body with product row
    const tableBody = document.createElement('tbody');
    const productRow = document.createElement('tr');

    const productCell = document.createElement('td');
    const productName = document.createElement('h4');
    productName.textContent = 'Sada Ata';
    const productWeight = document.createElement('p');
    productWeight.textContent = '10KG';
    productCell.appendChild(productName);
    productCell.appendChild(productWeight);

    const quantityCell = document.createElement('td');
    quantityCell.textContent = '5';

    const priceCell = document.createElement('td');
    priceCell.textContent = '2000';

    productRow.appendChild(productCell);
    productRow.appendChild(quantityCell);
    productRow.appendChild(priceCell);
    tableBody.appendChild(productRow);

    productTable.appendChild(tableHead);
    productTable.appendChild(tableBody);
    invBody.appendChild(productTable);

    // Footer section
    const invFooter = document.createElement('div');
    invFooter.classList.add('inv-footer');

    const footerTableDiv = document.createElement('div');
    const footerTable = document.createElement('table');

    const footerRows = [
        { label: 'Remaining', value: '' },
        { label: 'Paid', value: '' },
        { label: 'Total', value: '' }
    ];

    footerRows.forEach(row => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = row.label;
        const td = document.createElement('td');
        td.textContent = row.value;
        tr.appendChild(th);
        tr.appendChild(td);
        footerTable.appendChild(tr);
    });

    footerTableDiv.appendChild(footerTable);
    invFooter.appendChild(document.createElement('div')); // Empty div
    invFooter.appendChild(footerTableDiv);

    // Actions section
    const invActions = document.createElement('div');
    invActions.classList.add('inv-actions');

    const actionsDiv = document.createElement('div');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Order';
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Order';
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-invoice');
    downloadButton.textContent = 'Download Invoice';

    invActions.appendChild(actionsDiv);
    invActions.appendChild(downloadButton);

    // Append all sections to the container
    invoiceContainer.appendChild(invTitle);
    invoiceContainer.appendChild(invHeader);
    invoiceContainer.appendChild(invBody);
    invoiceContainer.appendChild(invFooter);
    invoicePopupMain.appendChild(invoiceContainer);
    invoicePopupMain.appendChild(invActions);

    // Append the main container to the document body or a specific parent container
    document.body.appendChild(invoicePopupMain);
}