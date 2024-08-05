const mongoose = require("mongoose");
const {Schema} = mongoose;

const todoSchema = new Schema({
    title: String,
    description: String,
    stage: String,
    deadline: Date
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = {
    schema: todoSchema,
    model: Todo
};