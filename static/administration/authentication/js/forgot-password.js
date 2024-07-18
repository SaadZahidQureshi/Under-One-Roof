

async function sendOTPForm(event){
    event.preventDefault();

    let form = document.querySelector("#sendOTPForm");
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
                    location.pathname = `administration/code-verify/`;
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