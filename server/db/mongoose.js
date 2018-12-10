const mongoose=require("mongoose");

mongoose.Promise=global.Promise;
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp");
mongoose.connect("mongodb://mead:mead123456@ds023435.mlab.com:23435/todoapp-mead",{ useNewUrlParser: true });



// var newTodo=new Todo({
//     text:"                  This text has been trimmed  2          "
// });


// newTodo.save().then(doc=>{
//     console.log("Saved todo ",doc);
// },err=>{
//     console.log("Unable to save todo ",err);
// });

// var newUser=new User({
//     email:"ali@gmail.com"
// });

// newUser.save().then(doc=>{
//     console.log("Saved user ",doc);
// },err=>{
//     console.log("Unable to save user ",err);
// });





module.exports={
    mongoose
};
