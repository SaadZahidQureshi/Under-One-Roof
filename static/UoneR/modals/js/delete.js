function openDeleteModal(modalId) {
    closeCurrentModal() 
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `addNewUserForm(event);`);
    document.querySelector(".back-svg").classList.add('hide');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'Login';
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
