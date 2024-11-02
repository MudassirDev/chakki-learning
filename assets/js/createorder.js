const customerSelect = document.getElementById('selectCustomer');
const createOrderForm = document.getElementById('create-order').querySelector('form');
const createOrderLoader = document.getElementById('create-order').querySelector('.loader');
const allItems = createOrderForm.querySelectorAll('.itemDiv');
const date = getCurrentDate();

function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    return `${day}-${month}-${year}`;
}

allItems.forEach(item => {
    item.querySelector('.itemDivAmount input').addEventListener("input", function() {
        if (this.value.trim() != "") {
            item.querySelector('.itemDivPrice').style.display = "block";
        } else {
            item.querySelector('.itemDivPrice').style.display = "none";
        }
    })
})

createOrderForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    createOrderForm.style.display = "none";
    createOrderLoader.style.display = "block";

    const order = createOrder();

    if (!order) {
        return;
    }

    try {
        const docRef = await firebase.addDoc(firebase.collection(firebase.db, "Orders"), {
            order: order
          });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
        console.log(error)        
    }

    console.log(order)
    createOrderForm.style.display = "block";
    createOrderLoader.style.display = "none";
})

function validateValues() {
    const [sadaAtaAmount, sadaAtaPrice, chokarAmount, chokarPrice, specialAtaAmount, specialAtaPrice, daraAmount, daraPrice] = getAllValues();

    if (sadaAtaAmount.trim() == "" && chokarAmount.trim() == "" && specialAtaAmount.trim() == "" && daraAmount.trim() == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("one item is required for the order")
        return false;
    }

    if (sadaAtaAmount.trim() != "" && sadaAtaPrice == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("If item amount is not empty then item price cannot be empty");
        return false;
    }

    if (chokarAmount.trim() != "" && chokarPrice == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("If item amount is not empty then item price cannot be empty");
        return false;
    }

    if (specialAtaAmount.trim() != "" && specialAtaPrice == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("If item amount is not empty then item price cannot be empty");
        return false;
    }

    if (daraAmount.trim() != "" && daraPrice == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("If item amount is not empty then item price cannot be empty");
        return false;
    }

    return true;
}

function getAllValues() {
    const formData = new FormData(createOrderForm);
 
    const sadaAtaAmount = formData.get("items[sada_ata][amount]");
    const sadaAtaPrice = formData.get("items[sada_ata][price]");
    const chokarAmount = formData.get("items[chokar][amount]");
    const chokarPrice = formData.get("items[chokar][price]")
    const specialAtaAmount = formData.get("items[special_ata][amount]");
    const specialAtaPrice = formData.get("items[special_ata][price]");
    const daraAmount = formData.get("items[dara][amount]");
    const daraPrice = formData.get("items[dara][price]");
    const paidAmount = formData.get("paid_amount");

    return [sadaAtaAmount, sadaAtaPrice, chokarAmount, chokarPrice, specialAtaAmount, specialAtaPrice, daraAmount, daraPrice, paidAmount];
}

function createOrder() {
    const [sadaAtaAmount, sadaAtaPrice, chokarAmount, chokarPrice, specialAtaAmount, specialAtaPrice, daraAmount, daraPrice, paidAmount] = getAllValues();

    if (!validateValues()) {
        return false;
    }

    const order = {
        date: date,
        items: {},
        orderAmount: 0,
        paidAmount: Number(paidAmount),
        remainingAmount: 0,
    }

    if (sadaAtaAmount.trim() != "") {
        order.items.sadaAta = {};
        order.items.sadaAta.amount = sadaAtaAmount;
        order.items.sadaAta.price = Number(sadaAtaPrice);
    }

    if (chokarAmount.trim() != "") {
        order.items.chokar = {};
        order.items.chokar.amount = chokarAmount;
        order.items.chokar.price = Number(chokarPrice);
    }

    if (specialAtaAmount.trim() != "") {
        order.items.specialAta = {};
        order.items.specialAta.amount = specialAtaAmount;
        order.items.specialAta.price = Number(specialAtaPrice);
    }

    if (daraAmount.trim() != "") {
        order.items.dara = {};
        order.items.dara.amount = daraAmount;
        order.items.dara.price = Number(daraPrice);
    }

    for (const key in order.items) {
        order.orderAmount = order.orderAmount + order.items[key].price;
    }

    order.remainingAmount = order.orderAmount - order.paidAmount;

    return order;
}


function addToCart() {
    const outcome = document.getElementById('outcome');
    const addToDbForm = document.getElementById('add-to-db-form').querySelector('form');
    const addToDbLoader = document.getElementById('add-to-db-form').querySelector('.loader');

    const order = {
        date: date,
        items: {},
        orderAmount: 0,
        paidAmount: 0,
        remainingAmount: 0,
    };

    const allForms = document.getElementById('add-to-cart-forms').querySelectorAll('form');

    allForms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            const quantity = formData.get("quantity");
            const amount = formData.get("amount");
            const price = formData.get("price");

            const item = `${form.getAttribute('id')}-${amount}`;

            order.items[item] = {
                quantity,
                amount,
                price
            };

            order.orderAmount = (order.orderAmount * 1) + (order.items[item].price * 1)
            addToDbForm.querySelector('.order_value').innerText = order.orderAmount;
            displayAllItems();
        })
    })

    function displayAllItems() {
        const outcomeDiv = document.createElement('div');
        for (const [k, v] of Object.entries(order.items)) {
            const div = document.createElement('div');
            const itemName = document.createElement('p');
            itemName.innerText = k;
            div.append(itemName);
            div.setAttribute('class', "item");
            for (const [key, value] of Object.entries(order.items[k])) {
                const p = document.createElement('p');
                p.innerText = `${key}-${value}`;
                div.append(p);
            }
            const deleteBtn = document.createElement('button');
            deleteBtn.setAttribute('onclick', `deleteItem("${k}")`)
            deleteBtn.innerText = "Delete"
            div.append(deleteBtn);
            outcomeDiv.append(div);
        }
        outcome.innerHTML = outcomeDiv.innerHTML;
    }

    window.deleteItem = (item) => {
        delete order.items[item];
        displayAllItems();
    }

    addToDbForm.addEventListener('submit', e => {
        e.preventDefault();
        addToDbForm.style.display = "none";
        addToDbLoader.style.display = "block";
        const formData = new FormData(addToDbForm);
        const paidAmount = formData.get('paid_amount');
        order.paidAmount = (paidAmount * 1);
        order.remainingAmount = order.orderAmount - order.paidAmount;
        console.log(order)
    })
}

addToCart();