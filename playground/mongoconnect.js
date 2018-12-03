//const MongoClient=require("mongodb").MongoClient;
const {MongoClient,ObjectID}=require("mongodb");

//var objId=new ObjectID();

MongoClient.connect("mongodb://mead:mead123456@ds023435.mlab.com:23435/todoapp-mead", 
    { useNewUrlParser: true },
    (err,client)=>{
        if(err){
            return console.log("Unnable connect to MongoDB server");
        }
        console.log("Connected to MongoDB server ");
        //var todos=client.db("todoapp-mead1000").collection("Todos");
        var db=client.db("todoapp-mead");
        var todos=db.collection("Todos");
        var users=db.collection("Users");

        /*
        todos.insertOne({
            text:"something to do 18",
            completed:false
            },
            {},
            (err,result)=>{
                if(err){
                    console.log("Unable to insert todo");
                    //client.close();
                    return;
                }
                //console.log("Error: ",err);
                //console.log("Result: ",result);
                console.log(JSON.stringify(result.ops,undefined,2));
                //client.close();
            });
            */
        users.insertOne({
            _id:124,
            name:"Andrew",
            age:24,
            location:"Philadelphia"
        },
            (err,result)=>{
                if(err){
                    console.log("Unable to insert user");                    
                    return;
                }
                
                console.log(JSON.stringify(result.ops,undefined,2));
            });    


        client.close();
    }
    );