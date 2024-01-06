const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { check } = require("express-validator");
const mongodbURI =
  "mongodb+srv://MAYANK:mayankMS8952@cluster0.lr7dlna.mongodb.net/fashion-hub?retryWrites=true&w=majority&authMechanism=DEFAULT";
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();

app.use(cors());

app.use(
  check({
    errorFormatter: (param, msg, value) => {
      const namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// View engine setup (optional if you're not using views)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static directory (optional if you're not serving static files)
app.use(express.static(path.join(__dirname, "public")));

// Routers
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
