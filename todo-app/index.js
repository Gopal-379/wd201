const { req, res } = require("express");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());

const { Todo } = require("./models");

app.get("/todos", (req, res) => {
  //res.send("Hello, World!");
  console.log("Todo List", req.body);
});

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const allTodos = await Todo.getTodos();
  if (req.accepts("html")) {
    res.render("index", {
      allTodos,
    });
  } else {
    res.json({
      allTodos,
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.post("/todos", async (req, res) => {
  console.log("Creating a Todo", req.body);
  try {
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      completed: false,
    });
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  console.log("We have to update a todo with ID:", req.params.id);
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", (req, res) => {
  console.log("Removing a todo with id", req.params.id);
});

app.listen(3000, () => {
  console.log("Started express server at port 3000");
});
