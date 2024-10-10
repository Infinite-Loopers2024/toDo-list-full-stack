import http from "http";
import fs from "fs";
import path from "path";

const port = 8080;
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
  }
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
