import type { Express } from 'express';
import { createServer, Server } from 'node:http';

export default function configureHttpServer (express: Express): Server {
  return createServer(express);
}
