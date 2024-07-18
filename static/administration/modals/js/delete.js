function openDeleteModal(modalId, show_id) {
    closeCurrentModal() 
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `addShowForm(event);`);
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'Delete';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })

    let showIdInput = form.querySelector("input[name='show_id']");
    if (!showIdInput) {
        showIdInput = document.createElement('input');
        showIdInput.type = 'hidden';
        showIdInput.name = 'show_id';
        form.appendChild(showIdInput);
    }
    showIdInput.value = show_id;

    // Check if the hidden input for show_id already exists; if not, create it
    let actionInput = form.querySelector("input[name='action']");
    if (!actionInput) {
        actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        form.appendChild(actionInput);
    }
    actionInput.value = "delete";

    modal.querySelector('#headline').innerText = 'Are You Sure?';
    modal.querySelector('#info').innerText = 'Are you certain you want to delete this show? Deleting it will result in the permanent loss of all associated information';
    document.querySelector(`.${modalId}`).click();
}

function closeCurrentModal() {
    let currentModal = document.querySelector('.modal.show'); // Get the currently open modal
    if (currentModal) {
        let bootstrapModal = bootstrap.Modal.getInstance(currentModal); // Get the Bootstrap modal instance
        bootstrapModal.hide(); // Hide the current modal
    }
}
