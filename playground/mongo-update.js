
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

    //    todos.findOneAndUpdate({
    //        _id:new ObjectID("5c04d415fa16c952ee01ba61")
    //    },{
    //         $set:{
    //             completed:true
    //         }
    //     },
    //     {
    //         returnOriginal:false
    //     }).then(result=>console.log(result));

        users.findOneAndUpdate({
            _id:new ObjectID("5c04b09b2070151af0434066")
        },{
             $set:{
                 name:"Frank"
             },
             $inc:{
                 age:8
             }
         },
         {
             returnOriginal:false
         }).then(result=>console.log(result));

        //client.close();
    }
    );