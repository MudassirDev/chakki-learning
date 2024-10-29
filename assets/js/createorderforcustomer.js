const customerSelect = document.getElementById('selectCustomer');
const createOrderForm = document.getElementById('create-order').querySelector('form');
const createOrderLoader = document.getElementById('create-order').querySelector('.loader');
const allItems = createOrderForm.querySelectorAll('.itemDiv');

async function getCustomers() {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    querySnapshot.forEach(doc => {
        const option = document.createElement("option");
        option.setAttribute("value", doc.id)
        option.innerHTML = capitalizeWords(doc.id.toLowerCase());
        customerSelect.append(option);
    });
}

getCustomers();

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