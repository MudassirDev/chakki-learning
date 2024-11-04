const date = getCurrentDate();

function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    
    return `${day}-${month}-${year}`;
}

function addToCart() {
    const outcome = document.getElementById('outcome');
    const addToDbForm = document.getElementById('add-to-db-form').querySelector('form');
    const addToDbLoader = document.getElementById('add-to-db-form').querySelector('.loader');

    const order = {
        date: date,
        items: {},
        paidAmount: 0,
        remainingAmount: 0,
    };

    const allForms = document.getElementById('add-to-cart-forms').querySelectorAll('form');

    allForms.forEach(form => {
        form.addEventListener('submit', e => {
            order.orderAmount = 0;
            e.preventDefault();
            const formData = new FormData(form);
            const quantity = formData.get("quantity");
            const amount = `${formData.get("amount")}${formData.get("unit")}`;
            const price = formData.get("price");

            const item = `${form.getAttribute('id')}-${amount}`;

            order.items[item] = {
                quantity,
                amount,
                price
            };

            for (const key in order.items) {
                order.orderAmount += (order.items[key].price * 1);
            }
            addToDbForm.querySelector('.order_value').innerText = `Total price of order: ${order.orderAmount}`;
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

    addToDbForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        addToDbForm.style.display = "none";
        addToDbLoader.style.display = "block";
        if ((order.orderAmount * 1) == 0) {
            addToDbForm.style.display = "block";
            addToDbLoader.style.display = "none";
            setTimeout(()=>{
                alert("please add an item");
            })
            return;
        }
        const formData = new FormData(addToDbForm);
        const paidAmount = formData.get('paid_amount');
        order.paidAmount = (paidAmount * 1);
        order.remainingAmount = order.orderAmount - order.paidAmount;

        try {
            const docRef = await firebase.addDoc(firebase.collection(firebase.db, "Orders"), {
                order: order
            });
            console.log(docRef.id);
        } catch (err) {
            console.log(err)
        }

        addToDbForm.style.display = "block";
        addToDbLoader.style.display = "none";
    })
}

addToCart();