const pin_forms = document.querySelectorAll("form");

pin_forms.forEach((form)=>{
    form.addEventListener('click', e => {
        form.submit();
    })
})