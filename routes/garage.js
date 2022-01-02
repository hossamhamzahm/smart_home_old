const express = require("express");
const Overview = require("../modules/overview");
const router = express.Router();

router.get('/', async (req, res) => {
    const overview = await Overview.find()
    res.render("garage", { overview: overview[0] });
});

router.get('/slots', async (req, res) => {
    const overview = await Overview.find()
    // console.log(overview[0].slot1_availability)
    res.send({ slots: [{slot1: overview[0].garage.slot1_availability}] });
});

router.post('/', async (req, res) => {
    const overview = await Overview.find()
    overview[0].garage.servo_angle = (overview[0].garage.servo_angle !== 0) ? 0 : 140;
    await overview[0].save();
    res.render("garage", { overview: overview[0] });
});

module.exports = router