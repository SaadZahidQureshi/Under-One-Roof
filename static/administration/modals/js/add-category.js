function openAddCategoryModal(modalId) {
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

function previewImage(event, inputElement) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.classList.add("thumbnail");
}

function previewColorImage(event, inputElement) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('color-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.classList.add("thumbnail");

}

const skillsTags = setupTagging('color-container', 'tag-input', 'color-image');


// -----------tags--------------------------
function setupTagging(tagContainerId, tagInputId, imageInputId) {
    const tagContainer = document.getElementById(tagContainerId);
    const tagInput = document.getElementById(tagInputId);
    const imageInput = document.getElementById(imageInputId);
    const init_src = imageInput.src;
    let tags = [];

    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tagText = tagInput.value.trim();
            const imageSrc = imageInput.src; // Get the current image source
            if (tagText !== '' && imageSrc) {
                addTag(tagText, imageSrc);
                tagInput.value = '';
                imageInput.src = init_src;
                imageInput.classList.remove("thumbnail"); // Clear the image input
            }
        }
    });

    tagContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-tag')) {
            const tagValue = e.target.closest('.remove-tag').getAttribute('data-tag');
            removeTag(tagValue);
        }
    });

    function addTag(tagText, imageSrc) {
        if (!tags.some(tag => tag.text === tagText)) {
            tags.push({ text: tagText, image: imageSrc });
            renderTags();
        }
    }

    function removeTag(tagText) {
        tags = tags.filter(tag => tag.text !== tagText);
        renderTags();
    }

    function renderTags() {
        tagContainer.innerHTML = '';
        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.classList.add('tag');
            tagElement.innerHTML = `
                <div class="color" style="width: 20px; height: 20px; background-image: url(${tag.image}); background-position: center; background-size: cover;"></div>
                <div class="info">
                    <span>${tag.text}</span>
                    <span class="remove-tag" data-tag="${tag.text}">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.7585 9.7848C11.0324 10.0587 11.0324 10.4848 10.7585 10.7587C10.6215 10.8957 10.4541 10.9565 10.2715 10.9565C10.0889 10.9565 9.92151 10.8957 9.78456 10.7587L6.99977 7.97393L4.21499 10.7587C4.07804 10.8957 3.91064 10.9565 3.72804 10.9565C3.54543 10.9565 3.37804 10.8957 3.24108 10.7587C2.96717 10.4848 2.96717 10.0587 3.24108 9.7848L6.02586 7.00002L3.24108 4.21524C2.96717 3.94132 2.96717 3.51524 3.24108 3.24132C3.51499 2.96741 3.94108 2.96741 4.21499 3.24132L6.99977 6.02611L9.78456 3.24132C10.0585 2.96741 10.4846 2.96741 10.7585 3.24132C11.0324 3.51524 11.0324 3.94132 10.7585 4.21524L7.97369 7.00002L10.7585 9.7848Z" fill="#FF3B30"/>
                        </svg>
                    </span>
                </div>`;
            tagContainer.appendChild(tagElement);
        });
    }

    return {
        getTags: () => tags
    };
}


// -----------tags--------------------------
