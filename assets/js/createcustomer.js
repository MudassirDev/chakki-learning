const createCustomerForm = document.getElementById('create-customer');
const getCustomers = document.getElementById('getCustomers');

createCustomerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(createCustomerForm);
    const name = formData.get("customer-name");
    try {
        const exists = await customerExists(name);
        if (exists) {
            console.log("This customer already exists");
        } else {
            console.log("This customer doesn't exists")
        }
        // await firebase.setDoc(firebase.doc(firebase.db, "Customers", name), {
        //     orders: JSON.stringify([{name: "something"}])
        // });
        // console.log("Customer Added");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
})


async function customerExists(nameToCheck) {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    let customerExists = false;
    querySnapshot.forEach((doc) => {
        if (doc.id.toLowerCase() == nameToCheck.toLowerCase()) {
            customerExists = true;
        }
    });
    return customerExists
}