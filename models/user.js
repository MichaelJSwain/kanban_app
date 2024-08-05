const mongoose = require("mongoose");
const {Schema} = mongoose;
const Todo = require("./todo").schema;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    todos: [Todo]
});

const User = mongoose.model("User", userSchema);

module.exports = User;