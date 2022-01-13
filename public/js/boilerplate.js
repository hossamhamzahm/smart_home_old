let timeout_id = 0;
const toasts1 = document.getElementById("toast1");
const toast_dismiss_btn = document.getElementById("toast-dismiss-button")
const forms = document.querySelectorAll("form");

try{
    disable_form_click_submission;
}
catch(e){
    forms.forEach((form) => {
        form.addEventListener('click', e => {
            form.submit();
        })
    })
}

toast_dismiss_btn.addEventListener('click', hide_toast);

function hide_toast() {
    toasts1.classList.toggle("show");
    toasts1.classList.toggle("hide");
    if (timeout_id) {
        clearTimeout(timeout_id);
    }
}

function check_bell(data) {
    if (data.bell) {
        toasts1.classList.toggle("hide")
        toasts1.classList.toggle("show");

        if (timeout_id) {
            clearTimeout(timeout_id);
        }
        timeout_id = setTimeout(hide_toast, 7000)
    }
}
setInterval(() => {
    fetch("/board/bell")
        .then(data => data.json())
        .then(data => check_bell(data))
}, 5000);