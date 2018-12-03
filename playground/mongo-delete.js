
const {MongoClient,ObjectID}=require("mongodb");


MongoClient.connect("mongodb://mead:mead123456@ds023435.mlab.com:23435/todoapp-mead", 
    { useNewUrlParser: true },
    (err,client)=>{
        if(err){
            return console.log("Unnable connect to MongoDB server");
        }
        console.log("Connected to MongoDB server ");
       
        var db=client.db("todoapp-mead");
        var todos=db.collection("Todos");
        var users=db.collection("Users");

        // todos.deleteMany({text:/something/i}).then(result=>{
        //     console.log(result);
        // });

        //todos.deleteOne({text:/Walk/i}).then(result=>console.log(result));

        todos.findOneAndDelete({text:/Walk/i}).then(result=>console.log(result));

        //client.close();
    }
    );