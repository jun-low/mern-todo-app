const express    = require("express");
const bodyParser = require("body-parser");
const cors       = require("cors");
const mongoose   = require("mongoose");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const keys       = require("./config/keys");
const passport   = require("passport");
const todoRoutes = express.Router();
// const userRoutes = express.Router();
// const PORT       = process.env.PORT || 4000;
const http       = require('http');

const validateRegisterInput = require("./validation/register");
const validateLoginInput    = require("./validation/login");

const User = require("./models/User");
const Todo = require("./models/Todo");

const app = express();

todoRoutes.options('*', cors());
// userRoutes.options('*', cors());

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(passport.initialize());
require("./config/passport")(passport);

mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database connection established successfully");
})

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:1bkg6p8mTxep0bSd@cluster-mern-todo-dkr6n.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//Router

todoRoutes.route("/").get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route("/:id").get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route("/update/:id").post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json("Todo updated!");
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route("/add").post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({"todo": "todo added successfully"});
        })
        .catch(err => {
            res.status(400).send("adding new todo failed");
        });
});

todoRoutes.route("/delete/:id").delete(function(request, response) {
    Todo.findByIdAndDelete(request.params.id, function(error, todo) {
        if (!todo)
            response.status(404).send("Data is not found");
        else
            todo.todo_description = request.body.todo_description;
            todo.todo_responsible = request.body.todo_responsible;
            todo.todo_priority    = request.body.todo_priority;
            todo.todo_completed   = request.body.todo_completed;

            todo.save().then(todo => {
                response.json("Todo deleted!");
            })
            .catch(error => {
                response.status(400).send("delete is not possible");
            });
    });
});

todoRoutes.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

todoRoutes.post("/login", (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email    = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});


app.use('/todos', todoRoutes);
// app.use('/users', userRoutes);
app.use(cors());

app.set('port', process.env.PORT || 4000);
app.set('host', process.env.HOST || '0.0.0.0');

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// app.listen(PORT, function() {
//     console.log("Server is running on Port: " + PORT);
// });
