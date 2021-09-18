require("dotenv").config();

const debug = require("debug")("app:debug");

const config = require("config");

const Joi = require("joi");

const morgan = require("morgan");

const logger = require("./logger");

const courses = require("./routes/courses");

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

// Courses route
app.use("/api/courses", courses);

// Main entry point
app.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello World" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
