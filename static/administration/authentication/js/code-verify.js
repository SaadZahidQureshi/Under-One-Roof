
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


async function verifyOTPForm(event){
    event.preventDefault();
    let form = document.querySelector("#verifyOTPForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);


    if (data.digit1.trim().length == 0 || data.digit2.trim().length == 0 || data.digit3.trim().length == 0 || data.digit4.trim().length == 0 ) {
        errorMsg.innerText = 'Enter a valid verification code';
        errorMsg.classList.add('active');
        return false;
    }
    let code = parseInt(data.digit1 + data.digit2 + data.digit3 + data.digit4);
    data.code = code;
    data.token = localStorage.getItem('token');

    console.log(data)

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

                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    localStorage.setItem('email', res.email);
                    localStorage.setItem('token', res.token);
                    location.pathname = "/administration/reset-password/";
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


async function sendOTPForm(event, button){
    event.preventDefault();

    let form = button.closest("form");
    let errorMsg = document.querySelector('.input-error-msg');
    console.log(form)
    var buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    data.email = localStorage.getItem("email");
    console.log(data)


    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        localStorage.setItem('email', data.email);
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };

        beforeLoad(button);
        let response = await requestAPI('/administration/forgot-password/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'OTP Sent');
                button.disabled = true;
                // document.querySelector("#verification-token").value = res.token;
                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    localStorage.setItem('token', res.token);
                    localStorage.getItem('email', res.email);
                    // location.pathname = `administration/code-verify/`;
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