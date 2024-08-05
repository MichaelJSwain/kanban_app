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

app.get("/", (req, res) => {
    res.send("Welcome!")
});

app.listen(PORT, () => {
    console.log("app listening on port ", PORT);
});