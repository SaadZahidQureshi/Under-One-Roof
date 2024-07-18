

async function changePasswordForm(event){
    event.preventDefault();
    let form = document.querySelector("#changePasswordForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data)

    if (data.old_password.length < 8) {
        errorMsg.innerText = 'Password must be atleast 8 characters';
        errorMsg.classList.add('active');
        return false;
    }
    if (data.new_password1.length < 8) {
        errorMsg.innerText = 'Password must be atleast 8 characters';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.new_password2.length < 8) {
        errorMsg.innerText = 'Confirm Password must be atleast 8 characters';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.new_password1 != data.new_password2) {
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
        let response = await requestAPI(`/change-password/`, JSON.stringify(data), headers, 'POST');
        response.json().then(function(res) {
            console.log(res)
            if (res.success) {
                afterLoad(button, 'Saved');
                button.disabled = true;
                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
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