const expect=require("expect");
const request=require("supertest");
const {ObjectID}=require("mongodb");
const {Todo}=require("./../models/todo.js");
const {app}=require("./../server");

const todos=[{    
    _id:new ObjectID(),
    text:"First test todo"
},{   
    _id:new ObjectID(),
    text:"Second test todo",
    completed:true,
    completedAt:333
}
];

//https://mochajs.org/#working-with-promises
beforeEach(async ()=>{
    await Todo.deleteMany({});
    await Todo.insertMany(todos);
    
});

describe("POST /todos",()=>{
    it("should create new todo",(done)=>{
        var text="Test todo text";
        request(app)
            .post("/todos")
            .send({text})
            .expect(200)
            .expect(res=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text:text}).then(todos=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err=>done(err));
                
            });
    });

    it("should not create todo with invalid body data",done=>{
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err)return done(err);
                Todo.find().then(todos=>{
                    expect(todos.length).toBe(2); 
                    done();
                }).catch(err=>done(err));
            });
    });
});


describe("GET /todos",()=>{
    it("it should get all todos",done=>{
        request(app)
            .get("/todos")
            .expect(res=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});


describe("GET /todos/:id",()=>{
    it("should get todo doc",done=>{
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end(done);
    });

    it("should return 404 for object not found",done=>{
        var hexId=new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 for non-object id",done=>{
        request(app)
            .get(`/todos/123`)
            .expect(404)            
            .end(done);
    });
});


describe("DETETE /todos/:id",()=>{
    it("should remove todo doc",done=>{
        var hexId=todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect(res=>{
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err,res)=>{
                if(err){
                    return done(err); 
                }
                Todo.findById(res.body.todo._id)
                    .then(todo=>{
                        expect(todo).toBeFalsy();
                        done();
                    })
                    .catch(err=>done(err));
            });
    });

    it("should return 404 for object not found",done=>{
        var hexId=new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 for INVALID object id",done=>{
        request(app)
            .delete(`/todos/123`)
            .expect(404)            
            .end(done);
    });
});

describe("PATCH /todos/:id",()=>{
    it("should update the todo",done=>{
        var hexId=todos[0]._id.toHexString();
        var text="This should be the text";

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed:true,
                text
            })
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true)
                expect(typeof res.body.todo.completedAt).toBe("number");
            })
            .end(done);
    });

    it("should update the todo to not completed",done=>{
        var hexId=todos[1]._id.toHexString();
        var text="This should be the text!!";

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed:false,
                text
            })
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});