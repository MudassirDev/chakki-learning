const createCustomerForm = document.getElementById('create-customer');

createCustomerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(createCustomerForm);
    const name = formData.get("customer-name");
    console.log(name)
    try {
        const response = await firebase.setDoc(firebase.doc(firebase.db, "Customers", name), {
            orders: []
        });
        console.log(response)
        console.log("Customer Added");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
})