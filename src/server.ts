import http from "http";
import fs from "fs";
import path from "path";
import * as db from "./db";

const port = 8080;
const server = http.createServer((req, res) => {
  console.log("Request recived");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.url === "/add-todo" && req.method === "POST") {
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
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
