import http from "http";

const port = 8080;
const server = http
  .createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/plain" });
    if (req.url) {
      res.end("Hej'");
    }
  });

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
