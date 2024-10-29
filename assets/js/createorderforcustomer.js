const customerSelect = document.getElementById('selectCustomer');

async function getCustomers() {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    querySnapshot.forEach(doc => {
        const option = document.createElement("option");
        option.setAttribute("value", doc.id)
        option.innerHTML = doc.id;
        customerSelect.append(option);
    });
}

getCustomers();