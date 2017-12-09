
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer(requestListener);

server.listen((process.env.PORT || 5000), () => {
  console.log("server start...");
});

function requestListener(request, response) {

  const url = request.url;
  const ext = path.extname(url);

  switch(ext) {
    case ".html":
      readFile(url, "text/html", false, response);
    break;
    case ".css":
      readFile(url, "text/css", false, response);
    break;
    case ".js":
      readFile(url, "text/javascript", false, response);
    break;
    case ".json":
      readFile(url, "application/json", false, response);
    break;
    case ".jpg":
      readFile(url, "image/jpeg", true, response);
    break;
    case ".gif":
      readFile(url, "image/gif", true, response);
    break;
    case ".png":
      readFile(url, "image/png", true, response);
    break;
    default:
      readFile("/index.html", "text/html", false, response);
    break;
  }

}

function readFile(file_name, content_type, is_binary, response) {

  const encoding = !is_binary ? "utf8" : "binary";
  const file_path = __dirname + file_name;

  fs.exists(file_path, (exits) => {
    if (exits) {
      fs.readFile(file_path, { encoding: encoding }, (err, data) => {
        if (err) {
          response.statusCode = 500;
          response.end("Internal Server Error");
        } else {
          response.statusCode = 200;
          response.setHeader("Content-Type", content_type);
          if (!is_binary) {
            response.end(data);
          } else {
            response.end(data, "binary");
          }
        }
      });
    } else {
      response.statusCode = 400;
      response.end("400 Error");
    }
  });

}
