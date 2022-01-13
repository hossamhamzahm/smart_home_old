const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override")
const path = require("path");
const homeRouter = require("./routes/home");
const roomsRouter = require("./routes/rooms")
const boardRouter = require("./routes/board");
const Overview = require("./modules/overview")
const garageRouter = require("./routes/garage")
const irrigationRouter = require("./routes/irrigation")
const Pin = require("./modules/pin")
const Room = require("./modules/room")

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/smart_home';
//"mongodb+srv://our-first-user:OnUU7y6t6jgOHdyt@cluster0.8dfkx.mongodb.net/smart_home?retryWrites=true&w=majority" //


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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log("Listening on port", port));


app.get('/', (req, res) => {
    res.redirect("/home");
})

app.get('/overview_api', async (req, res) => {
    const overview = await Overview.findOne()
    res.send(overview);
})



app.use('/home', homeRouter);
app.use("/rooms", roomsRouter);
app.use("/board", boardRouter);
app.use("/garage", garageRouter)
app.use("/irrigation", irrigationRouter)


app.get('/pins/:pinId', async(req, res)=>{
    const pin = await Pin.findById(req.params.pinId).populate("reserved_to_room");
    res.render("pin", {pin});
});


app.put('/pins/:pinId', async (req, res) => {
    const pin = await Pin.findById(req.params.pinId);
    const room = await Room.findById(pin.reserved_to_room);

    if(req.body.name && req.body.name !== ""){
        pin.name = req.body.name;
    }
    
    console.log(pin.device_type)
    if (pin.device_type !== req.body.device_type){
        console.log(pin.device_type)
        if(pin.device_type === "light"){
            await room.updateOne({ $pull: { light_pins: pin._id}});
        }
        else if(pin.device_type === "outlet"){
            await room.updateOne({ $pull: { outlet_pins: pin._id}});
        }

        if(req.body.device_type === "outlet"){
            await room.updateOne({ $push: { outlet_pins: pin._id}});
        }
        else if (req.body.device_type === "light") {
            await room.updateOne({ $push: { light_pins: pin._id } });
        }
    }
    pin.device_type = req.body.device_type;
    pin.configuration = req.body.configuration;
    console.log(req.body, room.light_pins);
    console.log(room.outlet_pins, room.light_pins);
    await pin.save()
    res.redirect(`/rooms/${room.id}`);
});


app.delete('/pins/:pinId', async (req, res) => {
    const pin = await Pin.findById(req.params.pinId);
    const roomId = pin.reserved_to_room;
    console.log(pin.reserved_to_room)
    // await pin.delete()
    res.redirect(`/rooms/${roomId}`);
});



app.get('*', (req, res)=>{
    res.send("Error 404\nPage is not found :(");
});