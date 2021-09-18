require("dotenv").config();

const debug = require("debug")("app:debug");

const config = require("config");

const morgan = require("morgan");

const logger = require("./middleware/logger");

const courses = require("./routes/courses");
const home = require("./routes/home");

const express = require("express");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

// Recognize the incoming request object as a JSON.
app.use(express.json());

// To serve static assets / content
app.use(express.static("public"));

// Configuration (config/)
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

// Logger middleware (custom)
app.use(logger);

// Home route
app.use("/", home);

// Courses route
app.use("/api/courses", courses);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
