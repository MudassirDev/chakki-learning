import { deleteDocument, DataCache, saveDoc, globalInit, showReceipt } from '../modules/utils.js';
import { attachFilterEvents, appendFilter, initializeFilters } from '../modules/filter.js';

globalInit();

window.completeData = new DataCache();
getData();

attachFilterEvents();

// Fetch Data for Customers and Orders
async function getData() {
    const dataTable = document.querySelector('.complete-data .data-table');
    const customerFilters = document.getElementById('customerFilters');

    const summary = {
        totalCustomer: 0,
        totalOrder: 0,
        totalAmount: 0,
        totalPaidAmount: 0,
        totalRemainingAmount: 0,
    };

    try {
        const [customers, orders] = await Promise.all([
            completeData.getCustomers(),
            completeData.getOrders()
        ]);

        // Process customers and their orders
        customers.forEach(customer => {
            const customerId = customer.id;
            appendFilter(customerFilters, customerId);

            processOrders(dataTable, customer.orders, customerId, summary);
            summary.totalCustomer++;
        });

        processOrders(dataTable, orders.map(doc => doc.order), "-", summary, orders.map(doc => doc.id));

        updateSummary(summary);

        initializeFilters();
    } catch (error) {
        console.error(error);
    }
}

function processOrders(dataTable, orders, customerId, summary, orderIds = []) {
    orders.forEach((order, index) => {
        const orderId = orderIds[index] || order.id;
        appendOrderRow(dataTable, customerId, index + 1, order, orderId);

        // Update summary data
        summary.totalOrder++;
        summary.totalAmount += order.orderAmount;
        summary.totalPaidAmount += order.paidAmount;
        summary.totalRemainingAmount += order.remainingAmount;
    });
}

function appendOrderRow(dataTable, customerId, index, order, orderId) {
    const rowHTML = `
        <div class="row" id="${orderId}">
            <p><span class="label">Order ID</span> ${formatOrderId(orderId)}</p>
            <p><span class="label">Customer</span> <span name="customer">${customerId}</span></p>
            <p><span class="label">Order Amount</span> ${order.orderAmount.toLocaleString()}</p>
            <p><span class="label">Paid Amount</span> ${order.paidAmount.toLocaleString()}</p>
            <p><span class="label">Remaining Amount</span> ${order.remainingAmount.toLocaleString()}</p>
            <p><span class="label">Action</span> <button onclick="getOrderDetails('${orderId}', '${customerId}')">View More</button></p>
        </div>
    `;
    dataTable.insertAdjacentHTML("beforeend", rowHTML);
}

function formatOrderId(orderId) {
    return `${orderId.slice(0, 3)}...${orderId.slice(-3)}`;
}


function updateSummary(summary) {
    const summaryData = {
        'total-customers': summary.totalCustomer,
        'total-orders': summary.totalOrder,
        'total-amount-in': summary.totalPaidAmount,
        'total-amount-out': summary.totalAmount,
        'total-amount-remaining': summary.totalRemainingAmount,
    };

    Object.entries(summaryData).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    });
}


// Get Order Details
// Fetch Order Details
window.getOrderDetails = async (orderId, customerId) => {
    try {
        const customers = completeData.customers || [];
        const orders = completeData.orders || [];

        let orderData = null;
        if (customerId !== "-") {
            const customerDoc = customers.find(customer => customer.id == customerId);
            if (customerDoc) {
                orderData = customerDoc.orders.find(order => order.id == orderId);
            }
        } else {
            const orderDoc = orders.find(order => order.id == orderId);
            if (orderDoc) orderData = orderDoc.order;
        }

        if (orderData) {
            showReceipt(orderData, customerId, orderId);
        } else {
            console.warn(`Order ID ${orderId} not found.`);
        }
    } catch (error) {
        console.error("Error fetching order details:", error);
    }
};


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

window.saveOrder = async (customer, orderId) => {
    const paidInput = document.getElementById('paid-input');
    const newAmount = parseFloat(paidInput.value);
    const originalAmount = parseFloat(paidInput.getAttribute('data-value'));

    if (newAmount === originalAmount) {
        throw new Error("Values cannot be the same!");
    }

    const updateOrderAmounts = (order) => {
        order.paidAmount = newAmount;
        order.remainingAmount = order.orderAmount - newAmount;
        return order;
    };

    const refreshUI = () => {
        closeInvoice();
        clearData();
        getData();
    };

    if (customer === "-") {
        const order = completeData.orders.find(o => o.id === orderId).order;
        updateOrderAmounts(order);
        await saveDoc("Orders", orderId, { order });
    } else {
        const customerData = completeData.customers.find(c => c.id === customer);
        const order = customerData.orders.find(o => o.id === orderId);
        updateOrderAmounts(order);
        const updatedData = { orders: customerData.orders };
        saveDoc("Customers", customer, updatedData);
    }

    refreshUI();
    console.log("Order saved!", saveResult);
};


window.deleteOrder = async (customer, orderId) => {
    if (customer == "-") {
        await deleteDocument("Orders", orderId);
    } else {
        // const customers = await completeData.getCustomers();
        // const customerData = customers.find(custom => custom.id == customer);
        // console.log(customerData)
        // const updatedData =customerData.orders.filter(order => order.id !== orderId);
        // customerData.orders = updatedData;
        // await saveDoc("Customers", customer, {orders: customerData.orders});
        // completeData.setCustomers(customers);
    }

    closeInvoice();
    document.getElementById(orderId).remove();
    const totalOrders = document.getElementById('total-orders');
    totalOrders.textContent = totalOrders.textContent * 1 - 1;
}

function clearData () {
    const table = document.querySelector('.complete-data .data-table');
    while (table.children.length > 1) {
        table.lastElementChild.remove();
    }    
}
