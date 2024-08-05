const express = require("express");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/kanban-app");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connect error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const PORT = 4040;

app.use(express.json());

// ---- User endpoints ---- //

// Login
app.post("/kanban/user/login", (req, res) => {
    res.send("user login endpoint");
});

// Register
app.post("/kanban/user/register", (req, res) => {
    // res.send("user register endpoint");
    // check if valid email, username, password values in middleware
        // if valid, next()
        // else return error message
    // hash password
    // create new instance of User with hashed password
    // save()
    console.log(req.body);

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
        return res.send(errorObj);
    }

    console.log("storing user in db");

    bcrypt.hash(req.body.password, 12)
        .then( async (hash) => {
        // Store hash in your password DB.
            console.log("hashed password = ", hash);

            const newUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: hash,
                todos: []
            });

            try {
                const user = await newUser.save();
                res.status(200).send(user);
            } catch(e) {
                res.status(500).send("error saving user to db");
            }
            
        })
        .catch(e => {
            console.log("error hashing password = ", e);
        });
});


// ---- Todo item endpoints ---- //
// index
app.get("/kanban/user/:id/todos", (req, res) => {
    res.send("todos index endpoint");
});

// create
app.post("/kanban/user/:id/todos", (req, res) => {
    res.send("todos create endpoint");
});

// show
app.get("/kanban/user/:id/todos/:todoId", (req, res) => {
    res.send("todos show endpoint");
});

// update
app.put("/kanban/user/:id/todos/:todoId", (req, res) => {
    res.send("todos update endpoint");
});

// delete
app.delete("/kanban/user/:id/todos/:todoId", (req, res) => {
    res.send("todos delete endpoint");
});

// create - get all todos for a user

app.listen(PORT, () => {
    console.log("app listening on port ", PORT);
});