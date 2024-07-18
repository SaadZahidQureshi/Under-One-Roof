function openSignInModal(modalId) {
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


async function signInForm(event){
    event.preventDefault();
    let form = document.querySelector("#signInForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data)

    if (emailRegex.test(data.email) == false) {
        errorMsg.innerText = 'Enter valid email';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.password.length < 8) {
        errorMsg.innerText = 'Password must be atleast 8 characters';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };

        beforeLoad(button);
        let response = await requestAPI('/login/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Logged In');
                button.disabled = true;

                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    closeCurrentModal()
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


async function forPasswordForm(event){
    event.preventDefault();

    let form = document.querySelector("#forPasswordForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data)

    if (emailRegex.test(data.email) == false) {
        errorMsg.innerText = 'Enter a valid email';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };

        beforeLoad(button);
        let response = await requestAPI('/send-forgot-otp/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'OTP Sent');
                button.disabled = true;
                document.querySelector("#forgot-verification-token").value = res.token;
                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    toggleModal('forget-password-content-container', 'verify-code-content-container-login');
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


async function verifyForgotOTPForm(event){
    event.preventDefault();
    let form = document.querySelector("#verifyForgotOTPForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data)

    let code = parseInt(data.digit1 + data.digit2 + data.digit3 + data.digit4);
    console.log(code)
    data.code = code;

    if (data.digit1.trim().length == 0 || data.digit2.trim().length == 0 || data.digit3.trim().length == 0 || data.digit4.trim().length == 0 ) {
        errorMsg.innerText = 'Enter a valid verification code';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };

        beforeLoad(button);
        let response = await requestAPI('/verify-otp/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Verified');
                button.disabled = true;
                document.querySelector("#reset-verification-token").value = res.token;
                document.querySelector("#reset-email").value = res.email;
                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    toggleModal('verify-code-content-container-login', 'reset-password-content-container')
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


async function resetPasswordForm(event){
    event.preventDefault();
    let form = document.querySelector("#resetPasswordForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data)

    if (data.password.length < 8) {
        errorMsg.innerText = 'Password must be atleast 8 characters';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.confirm_password.length < 8) {
        errorMsg.innerText = 'Confirm Password must be atleast 8 characters';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.password != data.confirm_password) {
        errorMsg.innerText = 'Password and Confirm Password do not match';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };

        beforeLoad(button);
        let response = await requestAPI('/reset-password/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Saved');
                button.disabled = true;

                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    toggleModal('reset-password-content-container', 'login-content-container')
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