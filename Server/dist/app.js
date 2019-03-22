"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyPaser = require("body-parser");
class App {
    constructor() {
        this.port = 6080;
        this.app = express();
        this.config();
    }
    getApp() {
        return this.app;
    }
    getPort() {
        return this.port;
    }
    config() {
        this.app.use(express.static(path.join(__dirname, "../../Client/dist")));
        this.app.use(bodyPaser.json());
        this.app.get("/*", (request, response) => {
            response.sendFile(path.join(__dirname, "../../Client/dist/index.html"));
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map