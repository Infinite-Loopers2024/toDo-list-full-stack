import http from "http";
import fs from "fs";
import path from "path";

const db = require("../db");

const port = 3000;
const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    const filePath = path.join(__dirname, "../index.html");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
  } else if (req.url === "../src/index.js" && req.method === "GET") {
    const filePath = path.join(__dirname, "index.js");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(content);
    });
  } else if (req.url === "/add-todo" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedBody = new URLSearchParams(body);
      const newTodo = parsedBody.get("Todo");

      if (newTodo) {
        const todoObject = { id: db.toDo.length + 1, name: newTodo };
        db.toDo.push(todoObject);

        const updatedDbContent = `
          const toDo = ${JSON.stringify(db.toDo, null, 2)};

          module.exports = { toDo };
        `;

        fs.writeFile(
          path.join(__dirname, "../db.js"),
          updatedDbContent,
          (err) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Failed to update database");
              return;
            }

            res.writeHead(302, { Location: "/" });
            res.end();
          }
        );
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid");
      }
    });
  } else if (req.url === "/task" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db.toDo));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
