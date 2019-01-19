import { App } from "./app";

const app = new App();
const server = app.getApp();
const port = app.getPort();

server.listen(port, error => {
  if (error) {
    return console.error("Something wrong happened: ", error);
  }

  console.log("app is listening on: ", port);
});
