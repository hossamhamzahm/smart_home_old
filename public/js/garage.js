const slot_div = document.getElementById("slot-div"); 
const forms = document.querySelectorAll("form");

forms.forEach((form) => {
    form.addEventListener('click', e => {
        form.submit();
    })
})


function update_slot(data) {
    if (data.slots[0].slot1) {
        slot_div.innerHTML = `
            <i class="bi bi-check2-all display-5 d-inline-block">
                <p class="footer-ele-stat mt-2">Available slot</p>
            </i>`
    }
    else {
        slot_div.innerHTML =
            `<i class="bi bi-exclamation-triangle display-5 d-inline-block" action="/rooms/<%= //room._id %>/pin/<%= //light_pin.pin_num %>" method="post">
                <p class="footer-ele-stat mt-2">Busy slot</p>
            </i>`
    }
}
setInterval(() => {
    fetch("/garage/slots")
        .then(data => data.json())
        .then(data => update_slot(data))
}, 500);