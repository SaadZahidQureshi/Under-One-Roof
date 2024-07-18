function previewImage(event, inputElement) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
}

async function updateUserForm(event){
    event.preventDefault();
    let form = document.querySelector("#updateUserForm");
    let user_id = form.querySelector(".user_id").textContent;
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
    else if (data.full_name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid name';
        errorMsg.classList.add('active');
        return false;
    }
    if (data.business_name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid business name';
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
        let response = await requestAPI(`/personal-information/`, JSON.stringify(data), headers, 'POST');
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
                errorMsg.innerText = res.message;
                errorMsg.classList.add('active');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}