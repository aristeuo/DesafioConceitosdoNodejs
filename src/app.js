const express = require("express");
const cors = require("cors");
//const { uuid } = require("uuid");
const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

//app.listen(5000);

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id == id);

  if (index < 0) {
    response.status(400).json({ error: "Repository not found" });
  } else {
    const likes = repositories[index].likes;

    const repository = { id, title, url, techs, likes };

    repositories[index] = repository;

    return response.json(repository);
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id == id);

  if (index < 0) {
    response.status(400).json({ error: "Repository not found" });
  } else {
    repositories.splice(index, 1);
    response.status(204).send();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id == id);

  if (index >= 0) {
    repositories[index].likes += 1;
    response.json(repositories[index]);
  } else {
    response.status(400).send({ error: "Repository not found" });
  }
});

module.exports = app;
