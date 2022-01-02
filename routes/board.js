const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Pin = require("../modules/pin")
const Overview = require("../modules/overview")


router.get('/', async(req, res)=>{
    const pins = await Pin.find({availability: false});
    const overview = await Overview.find();
    const res_pin = [];
    const res_data = {};
    pins.forEach(pin =>{
        const obj = {
            pin_num: pin.pin_num,
            state: pin.state,
        }
        res_pin.push(obj);
    })

    overview[0].weather.home_temp = req.body.home_temp;
    overview[0].weather.home_humidity = req.body.home_humidity;
    overview[0].garage.slot1_availability = req.body.slot1_availability;
    overview[0].irrigation.moisture = req.body.moisture_sensor;

    await overview[0].save();
    res_data.res_pin = res_pin;
    res_data.servo_angle = overview[0].garage.servo_angle;
    console.log(req.body)
    res.send(res_data);
});





module.exports = router;