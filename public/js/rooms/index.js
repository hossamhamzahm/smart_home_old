const room_counters = document.querySelectorAll(".room-counter");

let data = {};


function update_ppl_counter(data){
    // room_counter.innerHTML = `counter ${data.ppl_counter}`;
    data.forEach(room => {
        for(let room_el of room_counters){
            if(room_el.getAttribute('data-id') == room.id){
                room_el.innerHTML = `counter ${room.ppl_counter}`;
                break;
            }
        };
    });
}


setInterval(() => {
    fetch(`/rooms/ppl_counter/all`)
    .then(data => data.json())
    .then(data => update_ppl_counter(data));
}, 1000);