const customerSelect = document.getElementById('selectCustomer');
const createOrderForm = document.getElementById('create-order').querySelector('form');
const createOrderLoader = document.getElementById('create-order').querySelector('.loader');
const allItems = createOrderForm.querySelectorAll('.itemDiv');
const date = getCurrentDate();

async function fillSelect() {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    querySnapshot.forEach(doc => {
        const option = document.createElement("option");
        option.setAttribute("value", doc.id)
        option.innerHTML = capitalizeWords(doc.id.toLowerCase());
        customerSelect.append(option);
    });
}

customerSelect.addEventListener('change', function() {
    if (this.value != "select") {
        createOrderForm.style.display = "block";
    } else {
        createOrderForm.style.display = "none";
    }
})

function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
        console.log(customerSelect.value.toLowerCase());
        const docRef = firebase.doc(firebase.db, "Customers", customerSelect.value.toLowerCase());
        const docSnap = await firebase.getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const orders = JSON.parse(data.orders)
            order.id = orders.length + 1;
            orders.push(order);
            console.log(orders)
        } else {
            console.log("No such document!");
        }
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

function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    return `${day}-${month}-${year}`;
}

fillSelect();