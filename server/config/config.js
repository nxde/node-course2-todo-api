
var env=process.env.NODE_ENV || "development";

process.env.MONGODB_URI="mongodb://mead:mead123456@ds023435.mlab.com:23435/todoapp-mead";
if(env==="development"){
    process.env.PORT=3000;//
    //process.env.MONGODB_URI="mongodb://localhost:27017/TodoApp";
}
else if (env==="test"){
    process.env.PORT=3000;
    //process.env.MONGODB_URI="mongodb://localhost:27017/TodoAppTest"
    //process.env.MONGODB_URI="mongodb://mead:mead123456@ds023435.mlab.com:23435/todoapp-mead-Test";
}