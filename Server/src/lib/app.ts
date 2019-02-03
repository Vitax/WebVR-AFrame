import * as express from "express";
import { Application, Request, Response } from "express";

import * as path from "path";
import * as bodyPaser from "body-parser";

export class App {
  private readonly app: Application;
  private readonly port: number = 6080;

  constructor() {
    this.app = express();
    this.config();
  }

  public getApp() {
    return this.app;
  }

  public getPort() {
    return this.port;
  }

  private config(): void {
    this.app.use(express.static(path.join(__dirname, "../../Client/dist")));
    this.app.use(bodyPaser.json());

    this.app.get("/*", (request: Request, response: Response) => {
      response.sendFile(path.join(__dirname, "../../Client/dist/index.html"));
    });
  }
}
