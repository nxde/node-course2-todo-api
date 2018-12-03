
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

        // todos.find({
        //     _id:new ObjectID("5c04b9cffa16c952ee01379c")
        // }).toArray().then(docs=>{
        //     console.log("Todos");
        //     console.log(JSON.stringify(docs,undefined,2));
        // },err=>{
        //     console.log("Unable to connect to server ",err);
        // });

        todos.find().count().then(count=>{
            console.log(`Todos count: ${count}` );
            
        },err=>{
            console.log("Unable to count ",err);
        });


        //client.close();
    }
    );