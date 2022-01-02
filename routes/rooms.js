const express = require("express");
const pin = require("../modules/pin");
const router = express.Router();
const Pin = require("../modules/pin");
const room = require("../modules/room");
const Room = require("../modules/room")


router.get('/', async(req, res) => {
    const rooms = await Room.find({});
    res.render("rooms/index", {rooms});
})

router.get('/new', async (req, res) => {
    const pins = await Pin.find();
    // console.log(pins);
    res.render("rooms/new", {pins});
})


router.get('/all_lights', async (req, res) => {
    const rooms = await Room.find().populate("light_pins");

    rooms.forEach(room => {
        room.light_pins.forEach(pin => {
            pin.state = false;
            pin.save();
            console.log(room.light_pins);
        })
    })
    res.redirect("/home");
})


router.get('/all_outlets', async (req, res) => {
    const rooms = await Room.find().populate("outlet_pins");

    rooms.forEach(room => {
        room.outlet_pins.forEach(pin => {
            pin.state = false;
            pin.save();
            console.log(room.light_pins);
        })
    })
    res.redirect("/home");
})


router.post('/:id/all_lights', async (req, res) => {
    const room = await Room.findById(req.params.id).populate("light_pins");

    room.lights = (req.body.state == "on") ? true : false;
    room.light_pins.forEach(pin => {
        pin.state = (req.body.state == "on") ? true : false;
        pin.save();
    })
    await room.save();
    res.redirect(`/rooms`);
})

router.post('/:id/all_outlets', async (req, res) => {
    const room = await Room.findById(req.params.id).populate("outlet_pins");

    room.outlets = (req.body.state == "on") ? true : false;
    room.outlet_pins.forEach(pin => {
        pin.state = (req.body.state == "on") ? true : false;
        pin.save();
    })
    await room.save();
    res.redirect(`/rooms`);
})

router.get('/:id', async (req, res) => {
    const room = await Room.findById(req.params.id).populate('light_pins').populate('outlet_pins');
    // console.log(req.params.id);
    res.render("rooms/room", { room });
})


router.post('/:id/pin/:pin_num', async (req, res) => {
    const pin = await Pin.findOne({pin_num: req.params.pin_num})
    pin.state = !pin.state;
    await pin.save();
    res.redirect(`/rooms/${req.params.id}`);
})


router.post("/", async(req, res) =>{
    // console.log(req.body);
    const room = await new Room({
        name: req.body.room_name,
        ppl_counter: 0,
        outlets: false,
        lights: false,
        light_pins: [],
        outlet_pins: [],
    });

    const light_pins = [];
    const outlet_pins = [];
    // const db_pins = [];
    for (let pin in req.body.pins) {
        const pin_type = req.body.pins[pin]

        const db_pin = await Pin.findOneAndUpdate({pin_num: parseInt(pin.split('_')[1])}, 
            {
                state: false,
                availability: false,
                device_type: pin_type,
                reserved_to_room: room._id
            });

        
        // db_pins.push(db_pin);

        if (pin_type === "light") {
            light_pins.push(db_pin._id);
        }
        else {
            outlet_pins.push(db_pin._id);
        }
    }

    room.outlet_pins = outlet_pins;
    room.light_pins = light_pins;
    // await Pin.insertMany(db_pins);
    await room.save();
    res.redirect("/rooms");
})



pins= [3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 29, 31, 32, 33, 35, 36, 37, 38, 40];
async function create_pins(){
    for (let p of pins) {
        const pin = await new Pin({
            pin_num: p,
            availability: true,
            state: false,
        }).save();
    }
}

create_pins()


module.exports = router