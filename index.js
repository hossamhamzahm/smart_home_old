const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");


const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log("Listening on port", port));


app.get('/', (req, res) => {
    res.render("home/home");
})

app.get('/home', (req, res) => {
    res.render("home/home");
})

app.get('*', (req, res)=>{
    res.send("Error 404\nPage is not found :(");
})