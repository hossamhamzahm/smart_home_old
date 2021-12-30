const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const roomSchema = new Schema({
    name: String,
    door: Boolean,
    fan: Number,
    curtain: Number,
    light_pins: [{
        pin: String,
        state: Boolean
    }],
    lights: Boolean,
    outlet_pins: [{
        pin: String,
        state: Boolean
    }],
    outlets: Boolean,
    ppl_counter: Number,
});

module.exports = new mongoose.model("Room", roomSchema);