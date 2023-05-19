const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");

const saltRounds = 10;

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Shh! Some Secret String"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

// app.get("/todos", (req, res) => {
//   res.send("Hello, World!");
//   console.log("Todo List", req.body);
// });

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "my-super-secret-key-493879462862489689013865",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.messages = req.flash();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch(() => {
          return done(null, false, { message: "Invalid User" });
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(null, error);
    });
});

app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todo",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedInUser = request.user.id;
    const overdueTodos = await Todo.overdue(loggedInUser);
    const dueTodayTodos = await Todo.dueToday(loggedInUser);
    const dueLaterTodos = await Todo.dueLater(loggedInUser);
    const completedItemsTodos = await Todo.completedItems(loggedInUser);
    if (request.accepts("html")) {
      response.render("todo", {
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
  }
);

app.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup", csrfToken: req.csrfToken() });
});

app.post("/users", async (req, res) => {
  if (req.body.email.length == 0) {
    req.flash("error", "Email can not be empty");
    return res.redirect("/signup");
  }
  if (req.body.firstName.length == 0) {
    req.flash("error", "First name can not be empty");
    return res.redirect("/signup");
  }
  if (req.body.password.length == 0) {
    req.flash("error", "Password can not be empty");
    return res.redirect("/signup");
  }

  const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPwd,
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
        res.redirect("/todo");
      } else {
        req.flash("success", "Sign up successful");
        res.redirect("/todo");
      }
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "User Already Exist with this mail");
    return res.redirect("/signup");
  }
});

app.get("/login", function (req, res) {
  res.render("login", { title: "login", csrfToken: req.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/todo");
  }
);

app.get("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
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

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (req, res) {
    if (req.body.dueDate.length == 0) {
      req.flash("error", "Date can not be empty");
      return res.redirect("/todo");
    }
    if (req.body.title.length == 0) {
      req.flash("error", "Title can not be empty");
      return res.redirect("/todo");
    } else if (req.body.title.length < 5) {
      req.flash("error", "Title should be atleat 5 character in length");
      return res.redirect("/todo");
    }

    try {
      const todo = await Todo.addTodo({
        title: req.body.title,
        dueDate: req.body.dueDate,
        userId: req.user.id,
      });
      return res.redirect("/todo");
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (req, res) {
    const todo = await Todo.findByPk(req.params.id);
    try {
      const updatedTodo = await todo.setCompletionStatus(req.body.completed);
      return res.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (req, res) {
    console.log("We have to delete a Todo with ID: ", req.params.id);
    // FILL IN YOUR CODE HERE

    // First, we have to query our database to delete a Todo by ID.
    // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
    // res.send(true)
    try {
      await Todo.remove(req.params.id, req.user.id);
      return res.json({ success: true });
    } catch (err) {
      return res.status(422).json(err);
    }
  }
);

module.exports = app;
