import { Server } from "http";
import express from "express";

import routers from "./page";
import handleMiddleware from "./service/middlewareHandler";

let connection: Server;

export async function startWebServer() {
  const app = express();
  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //当允许携带cookies此处的白名单不能写’*’
    next();
  });
  handleMiddleware(app, routers);
  const apiAddress = await openConnection(app);
  return apiAddress;
}

export async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

function openConnection(app: express.Application) {
  return new Promise(
    (resolve: (val: ReturnType<typeof connection.address>) => void) => {
      const port = 3333 || 0;
      connection = app.listen(port, () => {
        console.log(connection.address());
        resolve(connection.address());
      });
    }
  );
}
