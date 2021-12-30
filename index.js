const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const homeRouter = require("./routes/home");
const roomsRouter = require("./routes/rooms")
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/smart_home';


// connecting to mongo on yelp-camp2
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', err => console.log("Error", err));
mongoose.connection.once('open', () => console.log("Connected to Mongo successfully"));

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log("Listening on port", port));


app.get('/', (req, res) => {
    res.redirect("/home");
})

app.use('/home', homeRouter);
app.use("/rooms", roomsRouter);

app.get('*', (req, res)=>{
    res.send("Error 404\nPage is not found :(");
})