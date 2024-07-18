
async function adminLoginForm(event){
    event.preventDefault();
    let form = document.querySelector("#adminLoginForm");
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
        let response = await requestAPI('/administration/login/', JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Logged In');
                button.disabled = true;

                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                    location.pathname = "administration/shows/"
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