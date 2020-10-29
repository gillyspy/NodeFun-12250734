const { RSA_NO_PADDING } = require("constants");
const fs = require("fs");
const http = require("http");
const { parse } = require("path");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  let body = "";
  if (url === "/") {
    body = `<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>`;
  } else if (url === "/message" && method === "POST") {
    const bodychunk = [];
    req.on("data", (chunk) => {
      //console.log(chunk)
      bodychunk.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(bodychunk).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  } else {
    body = "<body><h1>Hello</h1></body>";
  }

  if (method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write(body);
    res.write("</html");
  }
  res.end(); //process.exit()
});

server.listen(3000);
