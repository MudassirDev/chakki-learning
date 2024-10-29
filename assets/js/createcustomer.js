const createCustomerForm = document.getElementById('create-customer');

createCustomerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(createCustomerForm);
    const name = formData.get("customer-name");
    console.log(name)
    console.log(firebase.db)
})