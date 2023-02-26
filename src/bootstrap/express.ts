import express, { Express } from 'express';
import httpProxy from 'express-http-proxy';
import do_loginPost from '../routes/do_login.post';

export default function configureExpress (): Express {
  const app = express();

  app.use(express.json());
  app.post('/do_login', do_loginPost);
  app.use(httpProxy('http://localhost:5173'));

  return app;
}
