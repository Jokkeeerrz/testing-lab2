import express, { Express } from "express";
import routes from '../routes';

function createServer() {
  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }))

  routes(app);

  return app;
}

export default createServer;