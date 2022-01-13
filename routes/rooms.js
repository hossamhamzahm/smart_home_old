const express = require("express");
const { type } = require("express/lib/response");
const Overview = require("../modules/overview");
const pin = require("../modules/pin");
const router = express.Router();
const Pin = require("../modules/pin");
const room = require("../modules/room");
const Room = require("../modules/room")


router.get('/', async(req, res) => {
    const rooms = await Room.find({});
    res.render("rooms/index", {rooms});
});

router.get('/new', async (req, res) => {
    const pins = await Pin.find();
    // console.log(pins);
    res.render("rooms/new", {pins});
});


// turn off all the lights in the home
router.post('/all_lights', async (req, res) => {
    const rooms = await Room.find().populate("light_pins");

    rooms.forEach(room => {
        room.light_pins.forEach(pin => {
            pin.state = false;
            pin.save();
        })
    })
    res.redirect("/home");
});


// switch all the outlets in the home
router.post('/all_outlets', async (req, res) => {
    const rooms = await Room.find().populate("outlet_pins");
    const overview = await Overview.findOne();

    const state = req.body.state ? false : true;
    overview.control.all_outlets = state;
    rooms.forEach(room => {
        room.outlet_pins.forEach(pin => {
            pin.state = state;
            pin.save();
        })
    })
    await overview.save();
    res.redirect("/home");
});

// 
// implement all_doors route
// 


// send teh number of people for all teh rooms 
router.get('/ppl_counter/all', async (req, res) => {
    const rooms = await Room.find();
    const data = [];

    rooms.forEach(room => {
        const room_data = {id: room.id, ppl_counter: room.ppl_counter};
        data.push(room_data);
    });

    res.send( data );
});


// send the number of specific room
router.get('/ppl_counter/:id', async (req, res) => {
    const room = await Room.findById(req.params.id);
    
    res.send({ppl_counter: room.ppl_counter});
});


// switch all the lights in a specific room
router.post('/:id/all_lights', async (req, res) => {
    const room = await Room.findById(req.params.id).populate("light_pins");

    room.lights = (req.body.state == "on") ? true : false;
    room.light_pins.forEach(pin => {
        pin.state = (req.body.state == "on") ? true : false;
        pin.save();
    })
    await room.save();
    res.redirect(`/rooms`);
});


// switch all the outlets in a specific room
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


// reset people counter to zero in each room
router.get('/:id/reset_ppl', async (req, res) => {
    const room = await Room.findById(req.params.id);

    room.ppl_counter = true;
    await room.save();
    res.redirect(`/rooms/${req.params.id}`);
});


// show specific room control page
router.get('/:id', async (req, res) => {
    const room = await Room.findById(req.params.id).populate('light_pins').populate('outlet_pins').populate('sensor_pins');
    res.render("rooms/room", { room });
})


// create a new room
router.post("/", async(req, res) =>{
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
    const sensor_pins = [];

    /*
    pin_3: { device_type: 'outlet', name: 'Outlet1', configuration: 'outlet' },
    pin_5: { device_type: 'light', name: 'Light 1 ', configuration: 'light' },
    pin_7: { name: '', configuration: 'in' },
    pin_8: { device_type: 'sensor', name: 'IR1 ', configuration: 'ir-in' },
    pin_10: { name: '', configuration: 'in' },
    pin_11: { name: '', configuration: 'in' },
    */

    for (let pin in req.body.pins) {
        let pin_type = req.body.pins[pin].device_type;
        if(!pin_type) continue;

        const db_pin = await Pin.findOneAndUpdate({pin_num: parseInt(pin.split('_')[1])}, 
            {
                state: false,
                availability: false,
                device_type: pin_type,
                name: req.body.pins[pin].name,
                configuration: req.body.pins[pin].configuration,
                reserved_to_room: room._id
            });


        if (pin_type === "light") {
            light_pins.push(db_pin._id);
        }
        else if (pin_type === "outlet") {
            outlet_pins.push(db_pin._id);
        }
        else if(pin_type === 'sensor'){
            sensor_pins.push(db_pin._id);
        }
    }

    room.outlet_pins = outlet_pins;
    room.light_pins = light_pins;
    room.sensor_pins = sensor_pins;
    // await Pin.insertMany(db_pins);
    await room.save();
    res.redirect("/rooms");
})


// switch the status of a specific pin
router.post('/:id/pin/:pin_num', async (req, res) => {
    const pin = await Pin.findOne({ pin_num: req.params.pin_num })
    pin.state = !pin.state;
    await pin.save();
    res.redirect(`/rooms/${req.params.id}`);
})



// pins= [3, 5, 7, 8, 10, 11, 12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 29, 31, 32, 33, 35, 36, 37, 38, 40];
// async function create_pins(){
//     for (let p of pins) {
//         const pin = await new Pin({
//             pin_num: p,
//             availability: true,
//             state: false,
//         }).save();
//     }
// }

// create_pins()


module.exports = router