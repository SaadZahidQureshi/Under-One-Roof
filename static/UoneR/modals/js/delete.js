function openDeleteModal(modalId, user_id) {
    closeCurrentModal() 
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `DeleteAccountForm(event);`);
    form.setAttribute('id', "DeleteAccountForm");
    form.querySelector("#user_id").value = user_id;
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'Delete';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })
    document.querySelector(`.${modalId}`).click();
}

function closeCurrentModal() {
    let currentModal = document.querySelector('.modal.show'); // Get the currently open modal
    if (currentModal) {
        let bootstrapModal = bootstrap.Modal.getInstance(currentModal); // Get the Bootstrap modal instance
        bootstrapModal.hide(); // Hide the current modal
    }
}

async function DeleteAccountForm(event){
    event.preventDefault();
    let form = document.querySelector("#DeleteAccountForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;
    let user_id = form.querySelector("#user_id").value;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data)

    
    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };

        beforeLoad(button);
        let response = await requestAPI(`/delete-account/${user_id}`, formData, headers, 'DELETE');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Deleted');
                button.disabled = true;
                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    closeCurrentModal();
                }, 1500)
            }
            else {
                afterLoad(button, buttonText);
                errorMsg.innerText = res.errors;
                errorMsg.classList.add('active');
            }
        })

    }
    catch (err) {
        console.log(err);
    }

}