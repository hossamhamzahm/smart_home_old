const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Pin = require("../modules/pin");
const Overview = require("../modules/overview");
const Room = require("../modules/room");


router.get('/', async(req, res)=>{
    const pins = await Pin.find({availability: false});
    const overview = await Overview.find();
    const room = await Room.findById("61d1eadcce6d86e82ce8861a");

    const res_pin = [];
    const res_data = {};

    pins.forEach(pin =>{
        if(req.body.ppl_counter === 0){
            pin.state = false;
        }
        const obj = {
            pin_num: pin.pin_num,
            state: pin.state,
        }
        pin.save();
        res_pin.push(obj);
    })

    overview[0].weather.home_temp = req.body.home_temp;
    overview[0].weather.home_humidity = req.body.home_humidity;
    overview[0].garage.slot1_availability = req.body.slot1_availability;
    overview[0].irrigation.moisture = req.body.moisture_sensor;

    room.ppl_counter = req.body.ppl_counter;


    if (room.reset_ppl) {
        res_data.reset_ppl = true;
        room.reset_ppl = false;
    } 
    else {
        res_data.reset_ppl = false;
    }


    await overview[0].save();
    await room.save();

    res_data.res_pin = res_pin;
    res_data.servo_angle = overview[0].garage.servo_angle;
    console.log(req.body)
    res.send(res_data);
});

router.get('/bell', async (req, res) => {
    const overview = await Overview.findOne();
    const bell_state = overview.home.bell
    overview.home.bell = false;
    overview.save();
    res.send({ bell: bell_state });
});

router.post('/bell', async (req, res) => {
    const overview = await Overview.findOne();
    overview.home.bell = true;
    overview.save();
    res.send("ok");
});


module.exports = router;