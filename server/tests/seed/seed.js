
const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const jwt = require('jsonwebtoken');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [
    {
      access: 'auth',
      token: jwt.sign({ id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString(),
    },
  ],
}, {
  _id: userTwoId,
  email: 'jan@example.com',
  password: 'userTwoPass',
  tokens: [
    {
      access: 'auth',
      token: jwt.sign({ id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString(),
    },
  ],
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId,
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId,
},
];

// Todo.find().then(todosList => {
//   console.log(todosList);
// }, (err) => {
//   console.log(err);
// });

const populateTodos = async function () {
  await Todo.deleteMany();
  await Todo.insertMany(todos);
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const user1 = new User(users[0]).save();
    const user2 = new User(users[1]).save();
    return Promise.all([user1, user2]).then(() => done());
  });
};
module.exports = {
  todos, populateTodos, users, populateUsers,
};
