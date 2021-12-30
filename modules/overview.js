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
    // home:{
    //     name: "My Home",
    //     add: "NU sheikh zayed, Giza"
    // }
})

module.exports = new mongoose.model('Overview', overviewSchema);