require("dotenv").config();
const Person = require("./models/person");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("build"));

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-532353"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-15654"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-2345345"
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello Woasrld!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON());
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (
    body.name === "" ||
    body.name == null ||
    body.number === "" ||
    body.number == null
  ) {
    res.json({ error: "name or number missing" });
    return;
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON());
  });
});

app.get("/info", (req, res) => {
  let count = persons.length;
  let date = new Date();

  let responseHtml =
    "<p>Phonebook has info for " +
    count +
    " people.</p>" +
    "<p>" +
    date +
    "</p>";
  res.send(responseHtml);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
