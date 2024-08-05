const mongoose = require("mongoose");
const {Schema} = mongoose;
const Todo = require("./todo").schema;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    todos: [{
        title: String,
        description: String,
        stage: String,
        deadline: Date
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;