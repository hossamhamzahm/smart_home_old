const express = require("express")
const mongoose = require("mongoose");
const Overview = require('../modules/overview')
const axios = require("axios");
const router = express.Router();


async function getWeather() {
    return await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
            q: "cairo",
            appid: "d46263eca2b10491eb1c3d3170e2f9e4",
        }
    })
}

const date = new Date()


router.get('/', async (req, res) => {
    const overview = await Overview.find();

    if (`${date.getHours()}` !== overview[0].weather.last_modified) {
        weatherData = await getWeather();
        const temp = Math.round(parseInt(weatherData.data.main.temp - 273.15));

        overview[0].weather.last_modified = `${date.getHours()}`;
        overview[0].weather.city_temp = temp;
        await overview[0].save();
    }

    const city_temp = overview[0].weather.city_temp;
    const home_temp = overview[0].weather.home_temp;
    res.render("home", {city_temp, home_temp});
})

module.exports = router;


new Overview({weather: {
        city_temp: 18,
        last_modified: "00",
        home_temp: 23
    },
    control:{
        all_lights: true,
        all_outlets: true,
        all_doors: true
    },}).save() 

