const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const pinSchema = new Schema({
    pin_num: Number,
    availability: Boolean,
    state: Boolean,
    device_type: String,
    name: String,
    configuration: String,
    reserved_to_room: {
        type: mongoose.Types.ObjectId,
        ref: "Room",
    }
});

module.exports = new mongoose.model("Pin", pinSchema);