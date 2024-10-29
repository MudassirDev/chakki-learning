const customerSelect = document.getElementById('selectCustomer');

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
        console.log("This is a valid customer")
    } else {
        console.log("This is not a valid customer")
    }
})

function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }