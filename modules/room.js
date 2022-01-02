const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const roomSchema = new Schema({
    name: String,
    door: Boolean,
    fan: Number,
    curtain: Number,
    light_pins: [{
        type: mongoose.Types.ObjectId,
        ref: 'Pin'
    }],
    lights: Boolean,
    outlet_pins: [{
        type: mongoose.Types.ObjectId,
        ref: "Pin"
    }],
    outlets: Boolean,
    ppl_counter: Number,
});

module.exports = new mongoose.model("Room", roomSchema);