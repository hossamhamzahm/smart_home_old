const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const overviewSchema = new Schema({
    weather: {
        city_temp: Number,
        last_modified: String,
        home_temp: Number
    },
    control:{
        all_lights: Boolean,
        all_outlets: Boolean,
        all_doors: Boolean
    },
    home:{
        name: String,
        add: String
    },
    garage:{
        slot1_availability: Boolean,
        servo_angle: Number,
    },
    irrigation:{
        moisture: Boolean
    },
    // home:{
    //     name: "My Home",
    //     add: "NU sheikh zayed, Giza"
    // }
    // all_pins:{
    //     lights: Boolean,
    //     outlets: Boolean
    // }
})

module.exports = new mongoose.model('Overview', overviewSchema);