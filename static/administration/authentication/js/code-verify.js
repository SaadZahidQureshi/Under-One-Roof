
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
