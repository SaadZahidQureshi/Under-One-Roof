function openAddTypeModal(modalId) {
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


document.addEventListener('DOMContentLoaded', ()=>{

    document.getElementById('add-addon-btn').addEventListener('click', function() {
        const container = document.querySelector(".add-ons-cotnainer");

        const addonHTML = `<div class="addon-item">
                                <div class="header">
                                    <span class="add-on-counter"></span>
                                    <svg class="remove-addon-btn cursor-pointer" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="1.75" y="1.75" width="22.77" height="22.77" rx="5.25" stroke="#FF3B30" stroke-width="1.5"/>
                                        <path d="M17.6619 11.5704C17.6619 11.5704 17.3264 15.7325 17.1317 17.4857C17.039 18.3231 16.5217 18.8138 15.6745 18.8292C14.0622 18.8583 12.448 18.8601 10.8363 18.8261C10.0212 18.8095 9.51255 18.3126 9.4217 17.4901C9.2258 15.7214 8.89209 11.5704 8.89209 11.5704" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M18.5167 9.57523H8.03687" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16.4974 9.57522C16.0123 9.57522 15.5945 9.23224 15.4994 8.75701L15.3492 8.00554C15.2565 7.65885 14.9426 7.41907 14.5848 7.41907H11.9688C11.611 7.41907 11.2971 7.65885 11.2044 8.00554L11.0542 8.75701C10.959 9.23224 10.5413 9.57522 10.0562 9.57522" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>                                        
                                </div>

                                <div class="body w-100">
                                    <div class="input-wrapper name">
                                        <label for="addon-name">Name</label>
                                        <div class="w-100">
                                            <input type="text" name="addon-name" id="addon-name" placeholder="Padding">
                                        </div>
                                    </div>
                                    
                                    <div class="input-wrapper options">
                                        <div class="">
                                            <label for="options">Options</label>
                                            <svg class=" add-option cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_180_1978)">
                                                <path d="M6.41132 0.797959C3.318 0.797959 0.79834 3.31797 0.79834 6.41129V17.5887C0.79834 20.682 3.31764 23.202 6.41132 23.202H17.5887C20.6821 23.202 23.2021 20.682 23.2021 17.5887V6.41094C23.2021 3.31762 20.6821 0.797607 17.5887 0.797607L6.41132 0.797959ZM6.41132 2.67344H17.5887C19.6758 2.67344 21.3269 4.32427 21.3269 6.41129V17.5887C21.3269 19.6757 19.6758 21.3262 17.5887 21.3262H6.41132C4.3243 21.3262 2.67347 19.6757 2.67347 17.5887V6.41094C2.67347 4.32392 4.3243 2.67344 6.41132 2.67344ZM12.2206 5.5322C11.9721 5.53575 11.7351 5.63784 11.5618 5.81604C11.3885 5.99425 11.2931 6.23397 11.2965 6.48252V11.001H6.77876C6.65352 10.9975 6.52885 11.0192 6.41214 11.0648C6.29542 11.1103 6.18901 11.1788 6.09921 11.2662C6.0094 11.3535 5.93802 11.458 5.88928 11.5734C5.84054 11.6889 5.81542 11.8129 5.81542 11.9382C5.81542 12.0635 5.84054 12.1875 5.88928 12.3029C5.93802 12.4183 6.0094 12.5228 6.09921 12.6102C6.18901 12.6976 6.29542 12.766 6.41214 12.8116C6.52885 12.8571 6.65352 12.8788 6.77876 12.8754H11.2965V17.3931C11.2941 17.5178 11.3165 17.6417 11.3626 17.7576C11.4086 17.8735 11.4773 17.9791 11.5646 18.0681C11.6519 18.1571 11.7561 18.2278 11.8711 18.2761C11.9861 18.3244 12.1095 18.3493 12.2342 18.3493C12.3589 18.3493 12.4824 18.3244 12.5974 18.2761C12.7124 18.2278 12.8165 18.1571 12.9039 18.0681C12.9912 17.9791 13.0599 17.8735 13.1059 17.7576C13.1519 17.6417 13.1744 17.5178 13.172 17.3931V12.8754H17.6897C17.815 12.8788 17.9396 12.8571 18.0563 12.8116C18.1731 12.766 18.2795 12.6976 18.3693 12.6102C18.4591 12.5228 18.5305 12.4183 18.5792 12.3029C18.6279 12.1875 18.6531 12.0635 18.6531 11.9382C18.6531 11.8129 18.6279 11.6889 18.5792 11.5734C18.5305 11.458 18.4591 11.3535 18.3693 11.2662C18.2795 11.1788 18.1731 11.1103 18.0563 11.0648C17.9396 11.0192 17.815 10.9975 17.6897 11.001H13.172V6.48252C13.1737 6.35715 13.1503 6.23272 13.103 6.11657C13.0558 6.00043 12.9858 5.89493 12.8971 5.80633C12.8084 5.71772 12.7028 5.64781 12.5866 5.60073C12.4704 5.55364 12.346 5.53034 12.2206 5.5322Z" fill="#8EC549"/>
                                                </g>
                                                <defs>
                                                <clipPath id="clip0_180_1978">
                                                <rect width="24" height="24" fill="white"/>
                                                </clipPath>
                                                </defs>
                                            </svg>                                                
                                        </div>
                                        <div class="options-container">
                                            <div class="input-wrapper">
                                                <input type="text" name="option-1" id="option-1" placeholder="None">
                                                <svg class=" remove-option cursor-pointer" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.75" y="0.75" width="19.5" height="19.5" rx="4.25" stroke="#FF3B30" stroke-width="1.5"/>
                                                    <path d="M14.4169 9.14618C14.4169 9.14618 14.1265 12.7475 13.9581 14.2645C13.8779 14.9891 13.4303 15.4137 12.6972 15.427C11.3021 15.4522 9.9054 15.4538 8.51085 15.4244C7.80555 15.4099 7.36547 14.98 7.28687 14.2683C7.11736 12.7379 6.82861 9.14618 6.82861 9.14618" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M15.1564 7.41983H6.08862" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M13.4091 7.41984C12.9893 7.41984 12.6279 7.12307 12.5455 6.71187L12.4156 6.06165C12.3354 5.76167 12.0637 5.5542 11.7541 5.5542H9.49066C9.18105 5.5542 8.90942 5.76167 8.82921 6.06165L8.69927 6.71187C8.61692 7.12307 8.25545 7.41984 7.83569 7.41984" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>                                                    
                                            </div>
                                            <div class="input-wrapper">
                                                <input type="text" name="option-2" id="option-2" placeholder="1/2">
                                                <svg  class="remove-option cursor-pointer" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.75" y="0.75" width="19.5" height="19.5" rx="4.25" stroke="#FF3B30" stroke-width="1.5"/>
                                                    <path d="M14.4169 9.14618C14.4169 9.14618 14.1265 12.7475 13.9581 14.2645C13.8779 14.9891 13.4303 15.4137 12.6972 15.427C11.3021 15.4522 9.9054 15.4538 8.51085 15.4244C7.80555 15.4099 7.36547 14.98 7.28687 14.2683C7.11736 12.7379 6.82861 9.14618 6.82861 9.14618" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M15.1564 7.41983H6.08862" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M13.4091 7.41984C12.9893 7.41984 12.6279 7.12307 12.5455 6.71187L12.4156 6.06165C12.3354 5.76167 12.0637 5.5542 11.7541 5.5542H9.49066C9.18105 5.5542 8.90942 5.76167 8.82921 6.06165L8.69927 6.71187C8.61692 7.12307 8.25545 7.41984 7.83569 7.41984" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>                                                    
                                            </div>
                                            <div class="input-wrapper">
                                                <input type="text" name="option-2" id="option-2" placeholder="1">
                                                <svg  class=" remove-option cursor-pointer" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.75" y="0.75" width="19.5" height="19.5" rx="4.25" stroke="#FF3B30" stroke-width="1.5"/>
                                                    <path d="M14.4169 9.14618C14.4169 9.14618 14.1265 12.7475 13.9581 14.2645C13.8779 14.9891 13.4303 15.4137 12.6972 15.427C11.3021 15.4522 9.9054 15.4538 8.51085 15.4244C7.80555 15.4099 7.36547 14.98 7.28687 14.2683C7.11736 12.7379 6.82861 9.14618 6.82861 9.14618" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M15.1564 7.41983H6.08862" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M13.4091 7.41984C12.9893 7.41984 12.6279 7.12307 12.5455 6.71187L12.4156 6.06165C12.3354 5.76167 12.0637 5.5542 11.7541 5.5542H9.49066C9.18105 5.5542 8.90942 5.76167 8.82921 6.06165L8.69927 6.71187C8.61692 7.12307 8.25545 7.41984 7.83569 7.41984" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>                                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;


        container.insertAdjacentHTML('beforeend', addonHTML);

        // if (container.innerHTML != ''){

        //     document.querySelector('.add-option').addEventListener('click', () => {

        //         const options_container = document.querySelector(".options-container");
        //         option_element = `<div class="input-wrapper">
        //                         <input type="text" name="option-1" id="option-1" placeholder="None">
        //                         <svg class=" remove-option cursor-pointer" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        //                             <rect x="0.75" y="0.75" width="19.5" height="19.5" rx="4.25" stroke="#FF3B30" stroke-width="1.5"/>
        //                             <path d="M14.4169 9.14618C14.4169 9.14618 14.1265 12.7475 13.9581 14.2645C13.8779 14.9891 13.4303 15.4137 12.6972 15.427C11.3021 15.4522 9.9054 15.4538 8.51085 15.4244C7.80555 15.4099 7.36547 14.98 7.28687 14.2683C7.11736 12.7379 6.82861 9.14618 6.82861 9.14618" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        //                             <path d="M15.1564 7.41983H6.08862" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        //                             <path d="M13.4091 7.41984C12.9893 7.41984 12.6279 7.12307 12.5455 6.71187L12.4156 6.06165C12.3354 5.76167 12.0637 5.5542 11.7541 5.5542H9.49066C9.18105 5.5542 8.90942 5.76167 8.82921 6.06165L8.69927 6.71187C8.61692 7.12307 8.25545 7.41984 7.83569 7.41984" stroke="#FF3B30" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        //                         </svg>                                                    
        //                     </div>`;
            
        //         options_container.insertAdjacentHTML('beforeend', option_element);
        //     })
        // }

        // container.addEventListener('click', function(e) {
        //     if (e.target.querySelector('.remove-option')) {
        //         e.target.closest('.input-wrapper').remove();
        //     }
        // });

        container.addEventListener('click', function(e) {
            if (e.target.closest('.remove-addon-btn')) {
                e.target.closest('.addon-item').remove();
            }
        });
    });
});
