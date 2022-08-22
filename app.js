var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
require("dotenv").config();
var cors = require('cors');

const app = express();
// var corsOptions = {
//   origin: 'http://localhost:8080',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(cors());

const port = 3000;
const api = require("./api");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log('Running on env ', process.env.ENVIRONMENT);
});

app.use("/", api);
app.use("/images", express.static('images'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.ENVIRONMENT === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ Error: "Missing API" });
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

module.exports = app;
