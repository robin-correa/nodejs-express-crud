const config = require("config");
const Joi = require("joi");
const morgan = require("morgan");
const logger = require("./logger");
const express = require("express");
const app = express();

// Recognize the incoming request object as a JSON.
app.use(express.json());

// To serve static assets / content
app.use(express.static("public"));

// Configuration (config/)
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

// Logger middleware (custom)
app.use(logger);

// Records
const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
];

// Main entry point
app.get("/", (req, res) => {
  res.send("Hello World Robin");
});

// Get all records
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// Get one record
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

// Create record
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);

  res.send(course);
});

// Update record
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;

  res.send(course);
});

// Delete record
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
