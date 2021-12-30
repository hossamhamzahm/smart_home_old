const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const pinSchema = new Schema({
    pin_num: Number,
    availability: Boolean,
    reserved_to: mongoose.Types.ObjectId
});

module.exports = new mongoose.model("Pin", pinSchema);