const expect=require("expect");
const request=require("supertest");

const {Todo}=require("./../models/todo.js");
const {app}=require("./../server");

const todos=[{
    text:"First test todo"
},{
    text:"Second test todo"
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