const http = require("http");
const fz = require("fs");
const args = require("minimist")(process.argv.slice(2));

let homeC = "";
let projectC = "";

fz.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeC = home;
});

fz.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectC = project;
});

fz.readFile("registration.html", (err, registration) => {
  if (err) {
    throw err;
  }
  registrationC = registration;
});

http
  .createServer((request, response) => {
    let path = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (path) {
      case "/project":
        response.write(projectC);
        response.end();
        break;
      case "/registration":
        response.write(registrationC);
        response.end();
        break;
      default:
        response.write(homeC);
        response.end();
        break;
    }
  })
  .listen(args.port);
