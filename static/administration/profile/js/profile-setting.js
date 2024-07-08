function previewImage(event, inputElement) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
}
