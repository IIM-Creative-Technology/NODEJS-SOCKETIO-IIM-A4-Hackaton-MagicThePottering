import 'dotenv/config';
import crypto from 'node:crypto';
import http from 'node:http';
import express, {Request, Response} from 'express';
import proxy from 'express-http-proxy';
import {Server} from 'socket.io';
import {getDataSource, initializeDataSource} from './config/Database';
import ClientToServerEvents from './types/ClientToServerEvents';
import ServerToClientEvents from './types/ServerToClientEvents';
import InterServerEvents from './types/InterServerEvents';
import SocketData from './types/SocketData';
import Card from "./entities/Card";

import Game from "./types/Game";
import Board from "./types/Board";

const app = express();
app.use(express.json());
app.use(express.raw());

const playerDeck: Array<Card> = [];
const playerHand: Array<Card> = [];

app.get('/pioche', async (req: Request, res: Response) => {

    const playerDeck = await getDataSource().createQueryBuilder(Card, "card")
        .select()
        .orderBy("RANDOM()")
        .getMany()

    const playerHand = playerDeck.slice(0, 5);
    playerDeck.splice(0, 5);

    res.send({
        playerHand: playerHand,
        playerDeck: playerDeck
    })
});

app.post('/pioche', async (req: Request, res: Response) => {
    //raw body player hand and player deck
    const playerHand = req.body.playerHand;
    const playerDeck = req.body.playerDeck;

    playerHand.push(playerDeck[0]);
    playerDeck.splice(0, 1);
    res.send({
        playerHand: playerHand,
        playerDeck: playerDeck
    })
})


app.use(proxy('http://localhost:5173'));
const server = http.createServer(app);
const host = 'localhost';
const port = 8080;

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

const users: Map<string, { username: string, room: string }> = new Map();

const games: Map<string, Game> = new Map();


(async () => {
  await initializeDataSource();
  // const test = getDataSource();
  //
  // console.log(await test.manager.find(Card));

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
  });

    server.listen(8080, () => {
        console.log(`listening on http://localhost:${port}`);
    });
})();
