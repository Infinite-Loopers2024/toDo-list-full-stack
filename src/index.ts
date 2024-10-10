import fs from "fs";

const db = [];

const requestListener = (req, res) => {
  fs.readFile(__dirname + "/index.html", "utf-8")
  .then((content) => {
    res.setHeader("content-type", "text/html");
    res.writeHead(200);
    res.end(content);
  });
};
