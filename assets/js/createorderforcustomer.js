const customerSelect = document.getElementById('selectCustomer');

getCustomers().forEach(doc => {
    const option = document.createElement("option");
    option.setAttribute("value", doc.id)
    option.innerHTML = doc.id;
    customerSelect.append(option);
});

async function getCustomers() {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    return querySnapshot;
}