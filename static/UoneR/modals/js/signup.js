function openSignupModal(modalId) {
    // document.querySelector('.login-modal').click();
    closeCurrentModal();
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `addNewUserForm(event);`);
    document.querySelector(".back-svg").classList.add('hide');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('.btn-text').innerText = 'Continue';
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

const inputs = ["input1", "input2", "input3", "input4"];
let errorMsg = document.querySelector('.verify-error-msg');
let button = document.querySelector('button[type="submit"]');

inputs.map((id) => {
    const input = document.getElementById(id);
    addListener(input);
});


function addListener(input) {
    input.addEventListener("keyup", function(event) {
        const code = parseInt(input.value);
        if (code >= 0 && code <= 9) {
            const n = input.nextElementSibling;
            if (n) {
                n.focus();
                input.classList.add('filled-input');
            }
            else if (!n && input.getAttribute('data-position') == 'last') {
                input.classList.add('filled-input');
            }
        } else {
            input.value = "";
        }

        const key = event.key;
        if (key === "Backspace" || key === "Delete") {
            const prev = input.previousElementSibling;
            if (prev && input.getAttribute('data-position') == 'last') {
                input.classList.remove('filled-input');
            }
            if (prev) {
                prev.focus();
                prev.classList.remove('filled-input');
            }
        }
    });

    input.addEventListener("blur", () => {
        if (input.value.trim() == '') {
            input.classList.remove('filled-input');
        }
    })
}
