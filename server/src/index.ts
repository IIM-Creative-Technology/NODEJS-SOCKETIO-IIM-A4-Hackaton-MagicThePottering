import 'dotenv/config';
import crypto from 'node:crypto';
import http from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import { getDataSource, initializeDataSource } from './config/Database';
import ClientToServerEvents from './types/ClientToServerEvents';
import ServerToClientEvents from './types/ServerToClientEvents';
import InterServerEvents from './types/InterServerEvents';
import SocketData from './types/SocketData';
import Card from "./entities/Card";
import Game from "./types/Game";
import Board from "./types/Board";

const app = express();
const server = http.createServer(app);
const host = 'localhost';
const port = 8080;

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

const users: Map<string, { username: string, room: string }> = new Map();

const games: Map<string, Game> = new Map();

(async () => {
  await initializeDataSource();
  const test = getDataSource();

  console.log(await test.manager.find(Card));

  io.on('connection', (socket) => {
    console.log('a user connected');

    // socket.on('signIn', async (params) => {
    //   try {
    //       const result = await User.findAll({
    //           where: {
    //               username: params.username
    //           }
    //       })
    //       if (result.length === 0) throw new Error(`This username doesn't exist`)
    //       const user = result[0].dataValues
    //       const password = crypto.pbkdf2Sync(params.password, user.salt, 1000, 64, 'sha256').toString('hex')
    //       if (password !== user.password) throw new Error('Wrong password')
    //       socket.emit('sign-in-response', {status: 'done', user: {}});
    //
    //   } catch (e) {
    //       socket.emit('sign-in-response', {status: 'error', message: e.message});
    //   }
    // });

    socket.on('joinRoom', async (params: {roomName: string}) => {

      socket.join(params.roomName);
      const board: Map<string, Board> = new Map();
      board.set(socket.id, {hand: null, deck: null, graveyard: null, battlefield: null, mana: null})
      games.set(params.roomName, new Game(params.roomName, board));
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  server.listen(2222, () => {
    console.log(`listening on http://localhost:${port}`);
  });
})();



