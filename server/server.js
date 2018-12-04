const express=require("express");
const bodyParser=require("body-parser");

var {mongoose}=require("./db/mongoose.js");
const {Todo}=require("./models/todo.js");
const {User}=require("./models/user.js");


var app=express();

app.use(bodyParser.json());

app.post("/todos",(req,res)=>{
    var todo=new Todo({
        text:req.body.text
    });
    todo.save().then(doc=>{
        res.send(doc);
    },err=>{
        res.status(400).send(err);
    });
   
});

app.listen(3000,()=>{
    console.log("Server is up on port 3000");
});



