import http from "http";
import fs from "fs";
import path from "path";

let todos = ["Do the dishes.", "Clean the bathroom.", "Walk the dog."];

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

    req.on("end", () => {
      const parsedBody = new URLSearchParams(body);
      const newTodo = parsedBody.get("Todo");

      if (newTodo) {
        todos.push(newTodo);
        res.writeHead(302, { Location: "/" });
        res.end();
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
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
