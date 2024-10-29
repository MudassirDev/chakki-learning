const customerSelect = document.getElementById('selectCustomer');
const createOrderForm = document.getElementById('create-order').querySelector('form');
const createOrderLoader = document.getElementById('create-order').querySelector('.loader');
const allItems = createOrderForm.querySelectorAll('.itemDiv');

async function fillSelect() {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    querySnapshot.forEach(doc => {
        const option = document.createElement("option");
        option.setAttribute("value", doc.id)
        option.innerHTML = capitalizeWords(doc.id.toLowerCase());
        customerSelect.append(option);
    });
}

fillSelect();

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

    const formData = new FormData(createOrderForm);
    const sadaAtaAmount = formData.get("items[sada_ata][amount]");
    const sadaAtaPrice = formData.get("items[sada_ata][price]");
    const chokarAmount = formData.get("items[chokar][amount]");
    const chokarPrice = formData.get("items[chokar][price]")
    const specialAtaAmount = formData.get("items[special_ata][amount]");
    const specialAtaPrice = formData.get("items[special_ata][price]");

    if (sadaAtaAmount.trim() == "" && chokarAmount.trim() == "" && specialAtaAmount.trim() == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("one item is required for the order")
        return
    }

    if (sadaAtaAmount.trim() != "" && sadaAtaPrice == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("If item amount is not empty then item price cannot be empty");
        return;
    }

    if (chokarAmount.trim() != "" && chokarPrice == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("If item amount is not empty then item price cannot be empty");
        return;
    }

    if (specialAtaAmount.trim() != "" && specialAtaPrice == "") {
        createOrderForm.style.display = "block";
        createOrderLoader.style.display = "none";
        alert("If item amount is not empty then item price cannot be empty");
        return;
    }
})