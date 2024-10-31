const createCustomerForm = document.getElementById('customer-main').querySelector('form');
const loader = document.getElementById('customer-main').querySelector('.loader');
const getCustomers = document.getElementById('getCustomers');

createCustomerForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    createCustomerForm.style.display = "none";
    loader.style.display = "block";

    const formData = new FormData(createCustomerForm);
    const name = formData.get("customer-name");

    try {
        const exists = await customerExists(name);
        if (exists) {
            alert("This customer already exists");
        } else {
            console.log("This customer doesn't exists")
            await firebase.setDoc(firebase.doc(firebase.db, "Customers", name.toLowerCase()), {
                orders: []
            });
            alert("Customer Added");
        }
    } catch (e) {
        console.error("Error adding customer: ", e);
    }


    createCustomerForm.style.display = "block";
    loader.style.display = "none";
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