const { RSA_NO_PADDING } = require("constants");
const fs = require("fs");
const http = require("http");
const { parse } = require("path");
const routes = require("./routes.js");

const server = http.createServer(routes);
server.listen(3001);
