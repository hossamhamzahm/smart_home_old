const express = require("express");
const router = express.Router();
const Pin = require("../modules/pin");
const Room = require("../modules/room")


router.get('/', async(req, res) => {
    const rooms = await Room.find({});
    res.render("rooms/rooms", {rooms});
})

router.get('/new', async (req, res) => {
    const pins = await Pin.find();
    // console.log(pins);
    res.render("rooms/new", {pins});
})

router.post("/", async(req, res) =>{
    // console.log(req.body);
    const room = new Room({
        name: req.body.room_name,
        ppl_counter: 0,
        outlets: false,
        lights: false,
        light_pins: [],
        outlet_pins: [],
    })

    
    const light_pins = [];
    const outlet_pins = [];
    for (let pin in req.body.pins) {
        const req_pin = {
            pin: parseInt(pin.split('_')[1]),
            state: false
        }

        const pin_type = req.body.pins[pin]
        if (pin_type === "light") {
            light_pins.push(req_pin);
        }
        else {
            outlet_pins.push(req_pin);
        }
    }

    room.outlet_pins = outlet_pins;
    room.light_pins = light_pins;
    await room.save();
    res.redirect("/rooms");
})



// pins= [3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 29, 31, 32, 33, 35, 36, 37, 38, 40];
// async function create_pins(){
//     for (let p of pins) {
//         const pin = await new Pin({
//             pin_num: p,
//             availability: true,
//         }).save();
//     }
// }

// create_pins()


module.exports = router