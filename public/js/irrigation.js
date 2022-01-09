const moisture_status = document.getElementById("moisture-status");
const forms = document.querySelectorAll("form");



forms.forEach((form) => {
    form.addEventListener('click', e => {
        form.submit();
    })
})




function update_moisture(data){
    if(data.irrigation.moisture){
        moisture_status.innerHTML = 
        `<i class="bi bi-moisture display-5 d-inline-block">
            <p class="footer-ele-stat mt-2">Plants are well irrigated</p>
        </i>`
    }
    else{
        moisture_status.innerHTML = 
        `<i class="bi bi-brightness-alt-high display-5 d-inline-block">
            <p class="footer-ele-stat mt-2">Plants need to be irrigated</p>
        </i>`
    }
}


setInterval(() => {
    fetch("/overview_api")
        .then(data => data.json())
        .then(data => update_moisture(data));
}, 1000);