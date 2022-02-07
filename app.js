//requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const moongoose = require("mongoose");
const { redirect } = require("express/lib/response");

moongoose.connect("mongodb://localhost:27017/Colloquim",{
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//Setting things up
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const individual = {
  name: String,
  phone:String,
  email:String,
};

const user = new moongoose.Schema({
  teamName:String,
  password:String,
  teamMember1 :individual,
  teamMember2:individual,
  teamMember3:individual,
  collegeName: String,
  answer1:Boolean,
  answer2:Boolean,
  answer3:Boolean,
});

const questions={
  question1:"",
  question2:"",
  question3:""
};

const answers={
  answer1:"",
  answer2:"",
  answer3:"",
};

let data={
  teamName: " ",
  className1:"red",
  className2:"red",
  className3:"red"
};

const debug = moongoose.model("debug",user);

app.get("/",function(req,res){
  res.render("login",{eUsername:""});
});

app.post("/", (req, res) => {
  const username = (req.body.username);
  const roll = (req.body.roll);
  console.log(username);
  console.log(roll);
  debug.findOne({ teamName: username, password: roll }, function (err, result) {
    if (result) {
      if(result.answer1) data.className1 = "green";
      if(result.answer2) data.className2 = "green";
      if(result.answer3) data.className3 = "green";
      data.teamName = username;
      res.render("dashboard",data);
    } 
    else {
      debug.findOne({ teamName: username }, function (err, response) {
        if (response)
          res.render("login", { eUsername: "Incorrect Credentials" });
        else
          res.render("register", {
            label: "Let's get going with Registration",
          });
      })
    }
  });
});

app.post("/register",function(req,res){
  const teamMember1 = {
    name:req.body.teamMember1Name,
    phone:req.body.teamMember1Phone,
    email:req.body.teamMember1Email
  };
  const teamMember2 = {
    name:req.body.teamMember2Name,
    phone:req.body.teamMember2Phone,
    email:req.body.teamMember2Email
  };  
  const teamMember3 = {
    name:req.body.teamMember3Name,
    phone:req.body.teamMember3Phone,
    email:req.body.teamMember3Email
  };
  const tempUser=new debug({
    teamName:req.body.teamName,
    password:req.body.password,
    teamMember1:teamMember1,
    teamMember2:teamMember2,
    teamMember3:teamMember3,
    collegeName:req.body.college,
    answer1:false,
    answer2:false,
    answer3:false
  });
  debug.findOne({teamName:req.body.teamName},(err,result)=>
  {
    if(!err)
    {
      if(result)
      {
        res.send("Early Bird Catches the Worm!!<br><h1>Naya Team Name Socho</h1>");
      }
      else
      {
        tempUser.save((err)=>
        {
          if(!err) 
          {
            console.log("Success");
            res.send("Register Success");
          }
          else console.log("Failure");
        });
      }
    }
    else
    {
      res.send("Error-Page");
    }
  })
});

// app.post("/checkAnswer1",function(req,res){
//   if(answers.answer1 == req.body.answer)
//    res.render("dashboard",{all ok part 1});
//   else 
//    res.render("wrongAnswer");
// });

// app.post("/checkAnswer2",function(req,res){
//   if(answers.answer2 == req.body.answer)
//    res.render("dashboard",{all ok part 2});
//   else 
//    res.render("wrongAnswer");
// });

// app.post("/checkAnswer3",function(req,res){
//   if(answers.answer3 == req.body.answer)
//    res.render("dashboard",{all ok part 3});
//   else 
//    res.render("wrongAnswer");
// });

//Server Initialisation
app.listen(process.env.PORT||3000, (req, res) => {
  console.log("Server Up and running at port 3000");
});