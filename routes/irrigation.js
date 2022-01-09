const express = require("express");
const router = express.Router();
const Overview = require("../modules/overview");



router.get('/', async (req, res) => {
    const overview = await Overview.findOne()
    res.render("irrigation", { overview });
});


router.post('/irrigation_mode', async (req, res) => {
    const overview = await Overview.findOne();

    overview.irrigation.automatic_mode = (req.body.manual) ? false : true;
    await overview.save();
    res.redirect("/irrigation");
});

router.post('/status', async (req, res) => {
    const overview = await Overview.findOne();

    overview.irrigation.manual_status = !overview.irrigation.manual_status;
    await overview.save();
    res.redirect("/irrigation");
});


module.exports = router;