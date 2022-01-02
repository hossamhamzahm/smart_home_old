const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const pinSchema = new Schema({
    pin_num: Number,
    availability: Boolean,
    state: Boolean,
    device_type: String,
    reserved_to_room: mongoose.Types.ObjectId,
});

module.exports = new mongoose.model("Pin", pinSchema);