require("./config/config.js");

const express=require("express");
const bodyParser=require("body-parser");
const _=require("lodash");

var {mongoose}=require("./db/mongoose.js");
const {Todo}=require("./models/todo.js");
const {User}=require("./models/user.js");
const {ObjectID}=require("mongodb");
const {authenticate}=require("./middleware/authenticate");

var PORT=process.env.PORT;

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

app.get("/todos",(req,res)=>{
    Todo.find().then(todos=>{
        res.send({
            todos
        });
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get("/todos/:id",(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then(todo=>{
        if(todo){
            res.send({todo});
        }
        else{
            res.status(404).send();
        }
    }).catch(err=>{
        res.status(400).send();
    });
});

app.delete("/todos/:id",(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then(todo=>{
        if(!todo) {
            return status(404).send();
        }
        res.send({todo});
    }).catch(err=>{
        res.status(400).send();
    });
});

app.patch("/todos/:id",(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,["text","completed"]);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime();
    }
    else{
        body.completed=false;
        body.completedAt=null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true})
        .then(todo=>{
            if(!todo){
                return res.status(404).send();
            }
            res.send({todo});
        }).catch(err=>res.status(400).send());
});

app.post("/users",(req,res)=>{
    var body=_.pick(req.body,["email","password"]);
    var user=new User(body);
    //console.log("Newly created user,before saved: ",user);

    user.save().then(()=>{
        //res.send(user);
        return user.generateAuthToken();
    }).then(token=>{
        res.header("x-auth",token).send(user);
    }).catch(err=>{
        res.status(400).send(err);
    });
});



app.get("/users/me",authenticate,(req,res)=>{
    res.send(req.user);

});

app.listen(PORT,()=>{
    console.log(`Server is up on port ${PORT}`);
});

module.exports={app};


