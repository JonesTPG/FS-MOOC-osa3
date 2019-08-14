const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(bodyParser.json());
// app.use(morgan("tiny"));

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
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const newId = Math.ceil(Math.random() * 1000);
  const person = req.body;

  if (
    person.name === "" ||
    person.name == null ||
    person.number === "" ||
    person.number == null
  ) {
    res.json({ error: "name or number missing" });
    return;
  }

  let found = persons.find(p => p.name === person.name);
  if (found) {
    res.json({ error: "name already in list" });
    return;
  }

  person.id = newId;
  persons = persons.concat(person);
  res.json(person);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
