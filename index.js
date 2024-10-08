const express = require("express");
const app = express();
const User = require("./models/user");
const Todo = require("./models/todo").model;
const bcrypt = require("bcrypt");
require('dotenv').config()
const cors = require('cors');

const connString = process.env.CONN_STRING;

const mongoose = require("mongoose");
mongoose.connect(connString);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connect error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const PORT = process.env.PORT || 4040;

app.use(cors({origin: `https://66c183d9d0dc7024fdd12c75--remarkable-biscuit-393d21.netlify.app`}))

app.use(express.json());

// ---- User endpoints ---- //

// Login
app.post("/kanban/user/login", async (req, res) => {
    const {username, password} = req.body;

    let errorObj = {};

    if (!username) {
        errorObj.username = "please enter a valid username";
    }
    if (!password) {
        errorObj.password = "please enter a valid password";
    }

    if (Object.keys(errorObj).length) {
        return res.send(errorObj);
    }

    try {
        const foundUser = await User.findOne({username});
        
        if (!foundUser) {
            return res.status(500).json({success: false, message: "Incorrect username or password"});
        } else {
            bcrypt.compare(password, foundUser.password).then(function(result) {
                if (result) {
                   return res.status(200).json({success: true, user: foundUser});
                } else {
                   return res.status(500).json({success: false, message: "Incorrect username or password"});
                }
            });
        }
    } catch(e) {
        return res.status(500).json({success: false, message: "Error trying to login. Please try again later"});
    }


});

// Register
app.post("/kanban/user/register", (req, res) => {
    let errorObj = {};

    if (!req.body.email) {
        errorObj.email = "please enter a valid email";
    }
    if (!req.body.username) {
        errorObj.username = "please enter a valid username";
    }
    if (!req.body.password) {
        errorObj.password = "please enter a valid password";
    }

    if (Object.keys(errorObj).length) {
        return res.status(500).json({success: false, message: errorObj});
    }

    bcrypt.hash(req.body.password, 12)
        .then( async (hash) => {
        // Store hash in your password DB.
            const newUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: hash,
                todos: []
            });

            try {
                const user = await newUser.save();
                return res.status(200).json({success: true, user});
            } catch(e) {
                return res.status(500).json({success: false, message: "error saving user to db"});
            }
            
        })
        .catch(e => {
            return res.status(500).json({success: false, message: "error saving user to db"});
        });
});


// ---- Todo item endpoints ---- //
// index
app.get("/kanban/user/:id/todos", async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(500).json({success: false, message: "no user found"});
    }

    try {
        const user = await User.findById(userId).populate("todos");
        if (!user) {
            return res.status(500).json({success: false, message: "no user found"});
        }
           
        return res.status(200).json({success: true, todos: user.todos});
    } catch(e) {
        return res.status(500).json({success: false, message: "no user found"});
    }
  
 
});

// create
app.post("/kanban/user/:id/todos", async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id);
        if (!foundUser) {
            return res.status(500).json({success: false, message: "unable to save todo"});
        }

        const todo = new Todo(req.body);
        foundUser.todos.push(todo);
        
        const user = await foundUser.save();
        return res.status(200).json({success: true, todo});
    } catch(e) {
        return res.status(500).json({success: false, message: "unable to save todo"});
    }
});

// show
app.get("/kanban/user/:id/todos/:todoId", async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id).populate("todos");
        if (!foundUser) {
            return res.status(500).json({success: false, message: "unable to save todo"});
        }
        foundUser.todos.forEach(todo => {
            if (String(todo._id) === req.params.todoId) {
                return res.status(200).json({success: true, todos: user.todos});
            }
        })
        return res.status(500).json({success: false, message: "unable to find todo"});
    } catch(e) {
        return res.status(500).json({success: false, message: "unable to find todo"});
    }
});

// update
app.put("/kanban/user/:id/todos/:todoId", async (req, res) => {
    const {todoId} = req.params;
    const mongooseId = new mongoose.Types.ObjectId(todoId);
    const {title, description, stage} = req.body;

    try {
        const updatedUser = await User.updateOne({
            "todos._id": mongooseId
        }, {
            "$set": {
                "todos.$.title": title,
                "todos.$.description": description,
                "todos.$.stage": stage
              }
        }, {
           "new": true
        });
        return res.status(200).json({success: true, user: updatedUser});
    } catch(e) {
        return res.status(500).json({success: false, message: "failed to update todo"});
    }
});

// delete
app.delete("/kanban/user/:id/todos/:todoId", async (req, res) => {
    const {id, todoId} = req.params;
    const mongooseId = new mongoose.Types.ObjectId(todoId);

    try {
        await User.findByIdAndUpdate(id, {$pull: {todos: {_id: mongooseId}}});
        
        return res.status(200).json({success: true, message: "successfully deleted todo"});
    } catch(e) {
        return res.status(500).json({success: false, message: "failed to delete todo"});
    }
});

// create - get all todos for a user

app.listen(PORT, () => {
    console.log("app listening on port =>", PORT);
});