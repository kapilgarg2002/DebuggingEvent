//requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const moongoose = require("mongoose");
// const { redirect } = require("express/lib/response");





moongoose.connect("mongodb+srv://kapil:kapil@cluster0.jxchm.mongodb.net/Colloquim"||"mongodb://localhost:27017/Colloquim",{ useNewUrlParser: true, useUnifiedTopology: true });

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
  answer1:"Saturday, March 1, 2022",
  answer2:"5",
  answer3:"2 1 4 3 6 5 7",
};

let data={
  teamName: " ",
  className1:"",
  className2:"",
  className3:"",
  wans1:"",
  wans2:"",
  wans3:""
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
      (result.answer1)?data.className1 = "green":data.className1 = "red";
      (result.answer2)?data.className2 = "green":data.className2 = "red";
      result.answer3?data.className3 = "green":data.className3 = "red";
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

app.post("/checkAnswer1",function(req,res){
  
  debug.findOne({teamName:req.body.teamName},(err,result)=>{
    if(!err)
    {
      data.teamName = req.body.teamName;
      console.log(req.body.answer);
      if(answers.answer1 == req.body.answer)
       {
         console.log("here");
        debug.findOneAndUpdate({teamName:req.body.teamName},{answer1:true},{returnOriginal: false}, function(err,doc){
            if(err){
              console.log(err);
            } else{

              // console.log(doc);
            }
          });
        debug.findOne({teamName:req.body.teamName},(err,response)=>{
          console.log(response);
          (response.answer1)?data.className1 = "green":data.className1 = "red";
          (response.answer2)?data.className2 = "green":data.className2 = "red";
          (response.answer3)?data.className3 = "green":data.className3 = "red";
          res.render("dashboard",data);
        });
        console.log(data);
        
       }
       else {
         data.wans1="wrong answer";
         debug.findOne({teamName:req.body.teamName},(err,response)=>{
            console.log(response);
            (response.answer1)?data.className1 = "green":data.className1 = "red";
            (response.answer2)?data.className2 = "green":data.className2 = "red";
            (response.answer3)?data.className3 = "green":data.className3 = "red";
            res.render("dashboard",data);
          });
       }
        
    }
  });
});

app.post("/checkAnswer2",function(req,res){

  debug.findOne({teamName:req.body.teamName},(err,result)=>{
    if(!err)
    {
      data.teamName = req.body.teamName;
      console.log(req.body.answer);
      if(answers.answer2 == req.body.answer)
       {
         console.log("here");
        debug.findOneAndUpdate({teamName:req.body.teamName},{answer2:true},{returnOriginal: false}, function(err,doc){
            if(err){
              console.log(err);
            } else{
              console.log(doc);
            }
          });
        debug.findOne({teamName:req.body.teamName},(err,response)=>{
          (response.answer1)?data.className1 = "green":data.className1 = "red";
          (response.answer2)?data.className2 = "green":data.className2 = "red";
          (response.answer3)?data.className3 = "green":data.className3 = "red";
          res.render("dashboard",data);
        }); 
        
       }
       else {
         data.wans2="wrong answer";
         debug.findOne({teamName:req.body.teamName},(err,response)=>{
            console.log(response);
            (response.answer1)?data.className1 = "green":data.className1 = "red";
            (response.answer2)?data.className2 = "green":data.className2 = "red";
            (response.answer3)?data.className3 = "green":data.className3 = "red";
            res.render("dashboard",data);
          });
       }
    }
  });
});
app.post("/checkAnswer3",function(req,res){
  
  debug.findOne({teamName:req.body.teamName},(err,result)=>{
    if(!err)
    {
      data.teamName = req.body.teamName;
      console.log(req.body.answer);
      if(answers.answer3 == req.body.answer)
       {
         console.log("here");
        debug.findOneAndUpdate({teamName:req.body.teamName},{answer3:true},{returnOriginal: false}, function(err,doc){
            if(err){
              console.log(err);
            } else{
              console.log(doc);
            }
          });
        debug.findOne({teamName:req.body.teamName},(err,response)=>{
          (response.answer1)?data.className1 = "green":data.className1 = "red";
          (response.answer2)?data.className2 = "green":data.className2 = "red";
          response.answer3?data.className3 = "green":data.className3 = "red";
          res.render("dashboard",data);
        });
        
       }
       else {
         data.wans3="wrong answer";
         debug.findOne({teamName:req.body.teamName},(err,response)=>{
            console.log(response);
            (response.answer1)?data.className1 = "green":data.className1 = "red";
            (response.answer2)?data.className2 = "green":data.className2 = "red";
            (response.answer3)?data.className3 = "green":data.className3 = "red";
            res.render("dashboard",data);
          });
       }
    }
  });
});


//Server Initialisation
app.listen(process.env.PORT||4000, (req, res) => {
  console.log("Server Up and running at port 4000");
});