import http from "http";
import fs from "fs";
import path from "path";

const db = require("../db");

const port = 3000;
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        return;
      }
      res.writeHead(200);
      res.end(content);
    });
  } else if (req.url === "/add-todo" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
      console.log(body);
    });

    const updatedDbContent = `
const books = ${JSON.stringify(db.books, null, 2)};

module.exports = { books };
  `;
    req.on("end", () => {
      const parsedBody = new URLSearchParams(body);
      const newTodo = parsedBody.get("Todo");

      if (newTodo) {
        db.books.push(newTodo);
        fs.writeFile(
          path.join(__dirname, "../db.js"),
          updatedDbContent,
          (err) => {
            if (err) {
              res.writeHead(500);
              return;
            }
            res.writeHead(200);
            res.end("Todo added");
          }
        );
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
