const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Shh! Some Secret String"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

const path = require("path");

// app.get("/todos", (req, res) => {
//   res.send("Hello, World!");
//   console.log("Todo List", req.body);
// });

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const overdueTodos = await Todo.overdue();
  const dueTodayTodos = await Todo.dueToday();
  const dueLaterTodos = await Todo.dueLater();
  const completedItemsTodos = await Todo.completedItems();
  if (request.accepts("html")) {
    response.render("index", {
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      completedItemsTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      completedItemsTodos,
    });
  }
});

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
    const todo = await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id", async function (req, res) {
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(req.body.completed);
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
    await Todo.remove(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(422).json(err);
  }
});

module.exports = app;
