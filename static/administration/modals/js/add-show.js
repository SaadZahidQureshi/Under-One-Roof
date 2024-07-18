function openAddShowModal(modalId) {
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `addShowForm(event);`);
    document.querySelector(".back-svg").classList.add('hide');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'Save';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })
    document.querySelector(`.${modalId}`).click();
}

function toggleModal(_old, _new) {
    let old_modal = document.querySelector(`.${_old}`);
    let new_modal = document.querySelector(`.${_new}`);
    let backSvg = document.querySelector(".back-svg");

    if (old_modal.classList.contains('hide')) {
        old_modal.classList.remove('hide');
        new_modal.classList.add('hide');
        backSvg.classList.add('hide');
    } else {
        old_modal.classList.add('hide');
        new_modal.classList.remove('hide');
        backSvg.classList.remove('hide');
    }
}

function closeCurrentModal() {
    let currentModal = document.querySelector('.modal.show'); // Get the currently open modal
    if (currentModal) {
        let bootstrapModal = bootstrap.Modal.getInstance(currentModal); // Get the Bootstrap modal instance
        bootstrapModal.hide(); // Hide the current modal
    }
}

function selectStatusFilter(input, filterType) {
    const row = input.closest('.dropdown');
    const filterText = row.querySelector('.selected-filter-text');
    filterText.value = filterType;
}

async function addShowForm(event){
    event.preventDefault();
    let form = document.querySelector("#addShowForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);

    // Reset error message
    errorMsg.innerText = '';
    errorMsg.classList.remove('active');

    // Validation
    if (data.show_name.trim().length === 0) {
        errorMsg.innerText = 'Enter a valid show name';
        errorMsg.classList.add('active');
        return false;
    }
    if (data.sales_tax_percentage.trim().length === 0 || isNaN(data.sales_tax_percentage) || data.sales_tax_percentage < 0 || data.sales_tax_percentage > 100) {
        errorMsg.innerText = 'Enter a valid sales tax percentage (0-100)';
        errorMsg.classList.add('active');
        return false;
    }
    if (data.start_date.trim().length === 0 || !isValidDate(data.start_date)) {
        errorMsg.innerText = 'Enter a valid start date';
        errorMsg.classList.add('active');
        return false;
    }
    if (data.end_date.trim().length === 0 || !isValidDate(data.end_date) || new Date(data.end_date) < new Date(data.start_date)) {
        errorMsg.innerText = 'Enter a valid end date (after start date)';
        errorMsg.classList.add('active');
        return false;
    }
    if (!['active', 'inactive'].includes(data.status.toLowerCase())) {
        errorMsg.innerText = 'Enter a valid status (true/false)';
        errorMsg.classList.add('active');
        return false;
    }
    if (data.description.trim().length === 0) {
        errorMsg.innerText = 'Enter a valid description';
        errorMsg.classList.add('active');
        return false;
    }
    if (data.location.trim().length === 0) {
        errorMsg.innerText = 'Enter a valid location';
        errorMsg.classList.add('active');
        return false;
    }

    try {

        data.status == "Active" ? data.status = "true" : data.status = "false"; 
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };
        console.log(data);
        beforeLoad(button);
        let response = await requestAPI('/administration/shows/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Added');
                button.disabled = true;

                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    closeCurrentModal();
                    // location.pathname = "administration/shows/"
                }, 1500)
            }
            else {
                afterLoad(button, buttonText);
                errorMsg.innerText = res.message;
                errorMsg.classList.add('active');
            }
        })

    }
    catch (err) {
        console.log(err);
    }
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

function openUpdateShowModal(modalId, show_id, show_name, description, start_date, end_date, location, status, sales_tax_percentage ){
    status == "False" ? status = "Inactive" : status = "Active";
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `addShowForm(event);`);
    form.querySelector("input[name='show_name']").value = show_name;
    form.querySelector("input[name='sales_tax_percentage']").value = sales_tax_percentage;
    form.querySelector("input[name='start_date']").value = formatDateString(start_date);
    form.querySelector("input[name='end_date']").value = formatDateString(end_date);
    form.querySelector("input[name='status']").value = status;
    form.querySelector("textarea[name='description']").value = description;
    form.querySelector("input[name='location']").value = location;

    // Check if the hidden input for show_id already exists; if not, create it
    let showIdInput = form.querySelector("input[name='show_id']");
    if (!showIdInput) {
        showIdInput = document.createElement('input');
        showIdInput.type = 'hidden';
        showIdInput.name = 'show_id';
        form.appendChild(showIdInput);
    }
    showIdInput.value = show_id;
    document.querySelector(".back-svg").classList.add('hide');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'Save';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })
    document.querySelector(`.${modalId}`).click();
}

function formatDateString(dateString) {
    // Create a new Date object from the date string
    const date = new Date(dateString);
    // Get the year, month, and day from the date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    // Return the formatted date string
    return `${year}-${month}-${day}`;
}

function openDeleteModal(modalId, show_id) {
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector("form");
    let button = modal.querySelector("button[type='submit']")

    form.setAttribute("id", `deleteShowForm`);
    form.setAttribute("onsubmit","deleteShowForm(event);");
    console.log(form, button)

    // Check if the hidden input for show_id already exists; if not, create it
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

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'Delete';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })

    modal.querySelector('#headline').innerText = 'Are You Sure?';
    modal.querySelector('#info').innerText = 'Are you certain you want to delete this show? Deleting it will result in the permanent loss of all associated information';

    document.querySelector(`.${modalId}`).click();
}

async function deleteShowForm(event){
    event.preventDefault();
    let form = document.querySelector("#deleteShowForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);

    try {

        data.status == "Active" ? data.status = "true" : data.status = "false"; 
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };
        console.log(data);
        beforeLoad(button);
        let response = await requestAPI('/administration/shows/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Deleted');
                button.disabled = true;

                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    closeCurrentModal();
                    // location.pathname = "administration/shows/"
                }, 1500)
            }
            else {
                afterLoad(button, buttonText);
                errorMsg.innerText = res.message;
                errorMsg.classList.add('active');
            }
        })

    }
    catch (err) {
        console.log(err);
    }
}