const pin_forms = document.querySelectorAll("form");
const room_counter = document.querySelector(".room-counter");



pin_forms.forEach((form)=>{
    form.addEventListener('click', e => {
        form.submit();
    })
})


function update_ppl_counter(data){
    room_counter.innerHTML = `counter ${data.ppl_counter}`;
}


setInterval(() => {
    const id = room_counter.getAttribute("data-id");
    fetch(`/rooms/ppl_counter/${id}`)
    .then(data => data.json())
    .then(data => update_ppl_counter(data));
}, 1000);
