const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const path = require("path");

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

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/todos", async function (_req, res) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // res.send(todos)
  try {
    const todo = await Todo.findAll();
    return res.send(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.get("/todos/:id", async function (req, res) {
  try {
    const todo = await Todo.findByPk(req.params.id);
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.post("/todos", async function (req, res) {
  try {
    const todo = await Todo.addTodo(req.body);
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (req, res) {
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (req, res) {
  console.log("We have to delete a Todo with ID: ", req.params.id);
  // FILL IN YOUR CODE HERE

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // res.send(true)

  try {
    await Todo.destroy({
      where: {
        id: req.params.id,
      },
    }).then((er) => {
      if (!er) {
        return res.status(404).send(false);
      } else {
        res.status(404).send(true);
      }
    });
  } catch (error) {
    res.status(422).json(error);
  }
});

module.exports = app;
