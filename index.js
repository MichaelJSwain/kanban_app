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
app.post("/kanban/user/login", async (req, res) => {
    console.log("user login endpoint");

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
        console.log(username);
        const foundUser = await User.findOne({username});
        
        if (!foundUser) {
            return res.status(500).json({success: false, message: "Incorrect username or password"});
        } else {
            bcrypt.compare(password, foundUser.password).then(function(result) {
                if (result) {
                   return res.status(200).json({success: true, data: {user: foundUser}});
                } else {
                   return res.status(500).json({success: false, message: "Incorrect username or password"});
                }
            });
        }
    } catch(e) {
        console.log("error trying to find user = ", e);
    }


});

// Register
app.post("/kanban/user/register", (req, res) => {
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
        return res.status(500).json({success: false, message: errorObj});
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
                return res.status(200).json({success: true, data: {user}});
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
           
        return res.status(200).json({success: true, data: {"todos": user.todos}});
    } catch(e) {
        return res.status(500).json({success: false, message: "no user found"});
    }
  
 
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