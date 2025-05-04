const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectToDb = require("./db/db");
const app = express();
const userRoutes = require("./routes/user.route");

connectToDb(); // connects to database

app.use(cors()); // accepts for all domain right now
app.use(express.json()); // converts json into js object
app.use(express.urlencoded({extended: true})); // parse nested objects


app.get("/", (req, res) => {
    res.send("Hello world");
})
app.use("/user", userRoutes);


module.exports = app;