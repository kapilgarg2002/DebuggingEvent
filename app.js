//requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const moongoose = require("mongoose");


//Setting things up
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");



//Server Initialisation
app.listen(process.env.PORT||3000, (req, res) => {
  console.log("Server Up and running at port 3000");
});