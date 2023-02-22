import 'dotenv/config';
import crypto from 'node:crypto';
import http from 'node:http';
import {v4 as uuidv4} from "uuid";
import express, {Request, Response} from 'express';
import proxy from 'express-http-proxy';
import {Server} from 'socket.io';
import {getDataSource, initializeDataSource} from './config/Database';
import ClientToServerEvents from './types/ClientToServerEvents';
import ServerToClientEvents from './types/ServerToClientEvents';
import InterServerEvents from './types/InterServerEvents';
import SocketData from './types/SocketData';
import InGameCard from './types/InGameCard';
import Card from './entities/Card';
import Game from './types/Game';
import Board from './types/Board';

const app = express();
app.use(express.json());
app.use(express.raw());

let playerDeck: Array<InGameCard> = [];
let playerHand: Array<InGameCard> = [];
let playerHealth: number = 20;

const users: Map<string, { username: string, room: string }> = new Map();

const games: Map<string, Game> = new Map();

const gameBoardPlayer1: Board = {
    id: "player1",
    hand: null,
    deck: null,
    graveyard: null,
    battlefield: null,
    mana: null,
    health: 20
}
const gameBoardPlayer2: Board = {
    id: "player2",
    hand: null,
    deck: null,
    graveyard: null,
    battlefield: null,
    mana: null,
    health: 20
}

games.set("laSuperGame", new Game([gameBoardPlayer1, gameBoardPlayer2]));

app.get('/init-game', async (req: Request, res: Response) => {

    let data = await getDataSource().createQueryBuilder(Card, "card")
        .select(["card.name", "card.description", "card.image_url", "card.base_mana_cost", "card.type", "card.base_strength", "card.base_health"])
        .orderBy("RANDOM()")
        .getMany()

    playerDeck = data.map(card => new InGameCard(uuidv4(), card.name, card.description, card.image_url, card.base_mana_cost, card.type, card.base_strength, card.base_health))

    playerHand = playerDeck.slice(0, 5).splice(0, 5);

    res.send({
        playerHand: playerHand,
        playerDeck: playerDeck
    })
});


app.post('/cast', async (req: Request, res: Response) => {
    if (playerHand.find(inGameCard => inGameCard.id === req.body.cardId)) {
        const game = games.get(req.body.roomId);
        if (!game) return;

        const board = game.boards.find(board => board.id === req.body.userId);
        if (!board) return;

        const playedCard = board.hand!.find(inGameCard => inGameCard.id === req.body.cardId);
        if (!playedCard) return;

        const index = board.hand!.indexOf(playedCard);
        if (index === -1) return;

        if (board.hand!.splice(index, 1).length !== 0) board.battlefield!.push(playedCard);

    } else {
        return "CHEATER";
    }
})

app.post('/pioche', async (req: Request, res: Response) => {
    //raw body player hand and player deck

    playerHand.push(playerDeck[0]);
    playerDeck.splice(0, 1);
    res.send({
        playerHand: playerHand,
        playerDeck: playerDeck
    })
})

app.post('/attack', async (req: Request, res: Response) => {

    // Need :
    // - attackerId
    // - attackingCardId
    // - roomName

    const attackerId: string = req.body.attackerId;
    const attackingCardId: string = req.body.attackingCardId;
    const attackingCard: Card = (await getDataSource().manager.findOneBy(Card, {id: attackingCardId}))!;

    const boards = games.get(req.body.roomName)!.boards;
    const opponentBoard = boards.find(board => board.id !== attackerId);

    opponentBoard!.health! -= attackingCard.base_strength;

    if (opponentBoard!.health! <= 0) {
        res.send({
            opponentBoardHealth: opponentBoard!.health,
            winner: attackerId
        })
    } else {
        res.send({
            opponentBoardHealth: opponentBoard!.health
        })
    }
})


app.use(proxy('http://localhost:5173'));
const server = http.createServer(app);
const host = 'localhost';
const port = 8080;


(async () => {
    await initializeDataSource();
    // const test = getDataSource();
    // console.log(await test.manager.find(Card))


    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();
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

        socket.on('joinRoom', async (params: { roomName: string }) => {

            socket.join(params.roomName);
            const boards: Array<Board> = [];
            boards.push({
                id: socket.id,
                hand: null,
                deck: null,
                graveyard: null,
                battlefield: null,
                mana: null,
                health: null
            })
            games.set(params.roomName, new Game(boards));
        });
    });

    server.listen(8080, () => {
        console.log(`listening on http://localhost:${port}`);
    });
})();
