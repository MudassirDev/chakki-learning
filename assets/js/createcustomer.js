const createCustomerForm = document.getElementById('create-customer');

createCustomerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(createCustomerForm);
    const name = formData.get("customer-name");
    console.log(name)
    try {
        const docRef = await firebase.addDoc(firebase.collection(firebase.db, "users"), {
          name: name,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
})