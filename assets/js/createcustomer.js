const createCustomerForm = document.getElementById('create-customer');
const getCustomers = document.getElementById('getCustomers');

createCustomerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(createCustomerForm);
    const name = formData.get("customer-name");
    console.log(name)
    try {
        await firebase.setDoc(firebase.doc(firebase.db, "Customers", name), {
            orders: JSON.stringify([{name: "something"}])
        });
        console.log("Customer Added");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
})

getCustomers.addEventListener('click', async function() {
    const querySnapshot = await firebase.getDocs(firebase.collection(firebase.db, "Customers"));
    console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });
})