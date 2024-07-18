function previewImage(event, inputElement) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
    // inputElement.value = imageTag.src;
}

async function profileSettingForm(event){
    event.preventDefault();
    let form = document.querySelector("#profileSettingForm");
    let errorMsg = form.querySelector('.input-error-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.querySelector(".btn-text").textContent;

    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data)

    if (data.full_name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid name';
        errorMsg.classList.add('active');
        return false;
    } else if (emailRegex.test(data.email) == false) {
        errorMsg.innerText = 'Enter valid email';
        errorMsg.classList.add('active');
        return false;
    } else if (data.new_password1 != data.new_password2) {
        errorMsg.innerText = 'Password and Confirm Password do not match';
        errorMsg.classList.add('active');
        return false;
    }

    try {
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');

        // Convert FormData to URL-encoded string
        // let urlEncodedData = new URLSearchParams(formData).toString();
        
        // let headers = {
        //     "Content-Type": "application/x-www-form-urlencoded",
        //     "X-CSRFToken": data.csrfmiddlewaretoken,
        // };
        // urlEncodedData
        let headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": data.csrfmiddlewaretoken,
        };

        beforeLoad(button);
        let response = await requestAPI(`/administration/profile-settings/`, JSON.stringify(data), headers, 'POST');
        
        response.json().then(function(res) {
            console.log(res);
            if (res.success) {
                afterLoad(button, 'Saved');
                button.disabled = true;
                setTimeout(() => {
                    button.disabled = false;
                    afterLoad(button, buttonText);
                }, 1500);
            } else {
                afterLoad(button, buttonText);
                errorMsg.innerText = res.message;
                errorMsg.classList.add('active');
            }
        });
    } catch (err) {
        console.log(err);
    }
}
