const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/kanban-app");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connect error:"));
db.once("open", () => {
    console.log("Database connected!!");
});

const PORT = 4040;

// ---- User endpoints ---- //

// Login
app.post("/kanban/user/login", (req, res) => {
    res.send("user login endpoint");
});

// Register
app.post("/kanban/user/register", (req, res) => {
    res.send("user register endpoint");
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