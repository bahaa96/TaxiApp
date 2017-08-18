const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const mongoJS = require("mongojs")
const qs = require("qs")


const db = mongoJS("mongodb://geekbahaa:Ahmedbahaa2636046@ds053380.mlab.com:53380/taxiapp", ["bookings", "drivers", "driversLocation"])
let app = express()

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', function(){
    console.log("connected properly")
});

app.set('view engine', 'hbs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/assets", express.static("assets"))
app.get("/", (req, res) => {
    res.render("index")
})
app.get("/bookings", (req, res) => {
    db.bookings.find((err, bookings) => {
        if(err) {
            res.send(err)
        }
        res.json(bookings)
    })
})

app.post("/bookings", (req, res) => {
    console.log(req.body)
    const { body } = req
    const booking = {
        username: body.username,
        pickUpLocation: body.pickUpLocation,
        dropOffLocation: body.dropOffLocation
    }
    if( !booking.username ) {
        res.status(400).send("Bad data")
    }
    db.bookings.save( booking, (err, savedBooking) => {
        if(err) {
            res.send(err)
        }
        res.json(savedBooking)
    })
})

app.put("/driversLocation/:id", (req, res) => {
    console.log(req.params.id)
    console.log(req.body)
    if(req.body){
        db.driversLocation.update({
            _id: mongoJS.ObjectId(req.params.id)
        }, {
            "$set": { socketID: req.body.socketID}
        }, (err, updatedDetails) => {
            if(err){
                res.end(err)
            }
            res.send(updatedDetails)
        })
    }else {
        res.status(400).end("Bad data")
    }
})


server.listen(3000, ()=> {
    console.log("Listening")
})