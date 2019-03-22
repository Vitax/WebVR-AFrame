"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const app = new app_1.App();
const server = app.getApp();
const port = app.getPort();
server.listen(port, error => {
    if (error) {
        return console.error("Something wrong happened: ", error);
    }
    console.log("app is listening on: ", port);
});
//# sourceMappingURL=server.js.map