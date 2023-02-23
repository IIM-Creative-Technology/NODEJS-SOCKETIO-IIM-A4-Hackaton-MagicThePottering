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
import {Steps} from './types/Steps.enum';

const app = express();
app.use(express.json());
app.use(express.raw());

let playerDeck: Array<InGameCard> = [];
let playerHand: Array<InGameCard> = [];
let playerHealth: number = 20;

const users: Map<string, { username: string, room: string }> = new Map();

const games: Map<string, Game> = new Map();

const gameBoardPlayer1: Board = new Board("player1",);



const gameBoardPlayer2: Board = new Board("player2",);

games.set("laSuperGame", new Game(null, [gameBoardPlayer1, gameBoardPlayer2]));

app.get('/init-game', async (req: Request, res: Response) => {

    let data = await getDataSource().createQueryBuilder(Card, "card")
        .select()
        .orderBy("RANDOM()")
        .getMany();

    playerDeck = data.map(card => new InGameCard(uuidv4(), card.id, card.name, card.description, card.image_url, card.base_mana_cost, card.type, card.base_strength, card.base_health));

    playerHand = playerDeck.slice(0, 5).splice(0, 5);

    const game = games.get(req.body.roomId);
    if (!game) return;

    game.step = Steps.BEGIN;

    res.send({
        playerHand: playerHand,
        playerDeck: playerDeck
    });
});


app.post('/cast', async (req: Request, res: Response) => {
    if (playerHand.find(inGameCard => inGameCard.id === req.body.cardId)) {
        const game = games.get(req.body.roomId);
        if (!game) return;
        if (game.step !== Steps.MAIN) return "wrong phase";

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
    const game = games.get(req.body.roomId);
    if (!game) return;
    if (game.step !== Steps.BEGIN) return "CHEATER";

    playerHand.push(playerDeck[0]);
    playerDeck.splice(0, 1);
    res.send({
        playerHand: playerHand,
        playerDeck: playerDeck
    })
    game.step = Steps.MAIN
})

app.post('/attack', async (req: Request, res: Response) => {

    // Need :
    // - attackerId
    // - attackingCardId
    // - roomName


    // const attackerId: string = req.body.attackerId;
    // const attackingCardId: string = req.body.attackingCardId;
    // const attackingCard: Card = (await getDataSource().manager.findOneBy(Card, {id: attackingCardId}))!;

    const game = games.get(req.body.roomId)
    if (!game) return;
    if (game.step !== Steps.ATTACK) return "wrong phase";

    const boards = game.boards;

    const attackerId = req.body.attackerId;
    const attackerBoard = boards.find(board => board.id === attackerId);
    if (!attackerBoard) return;

    const attackingCardsIds: string[] = req.body.attackingCardsIds;
    let cardExistsOnBoard = true;
    attackingCardsIds.forEach(attackingCardId => {
        if (!attackerBoard.battlefield) return;
        const foundCard = attackerBoard.battlefield.find(inGameCard => inGameCard.id === attackingCardId);
        if (!foundCard) cardExistsOnBoard = false;
    })
    if (!cardExistsOnBoard) return;

    game.step = Steps.DEFEND;
    // const opponentBoard = boards.find(board => board.id !== attackerId);

    // opponentBoard!.health! -= attackingCard.base_strength;
    //
    // if (opponentBoard!.health! <= 0) {
    //     res.send({
    //         opponentBoardHealth: opponentBoard!.health,
    //         winner: attackerId
    //     })
    // } else {
    //     res.send({
    //         opponentBoardHealth: opponentBoard!.health
    //     })
    // }
})

app.post('/defend', async (req: Request, res: Response) => {
    // Need :
    // AttackingCard
    // DefendingCard can be null

    const game = games.get(req.body.roomId)
    if (!game) return;
    if (game.step !== Steps.DEFEND) return "wrong phase";

    const boards = game.boards;
    const defenderBoard = boards.find(board => board.id === req.body.defenderId);
    if (!defenderBoard) return;
    const defenderBattlefield = defenderBoard.battlefield;
    if (!defenderBattlefield) return;

    const attackerBoard = boards.find(board => board.id !== req.body.attackerId);
    if (!attackerBoard) return;
    const attackerBattlefield = attackerBoard.battlefield;
    if (!attackerBattlefield) return;

    const battlingCardIds: Array<{ attackingCardId: string, defendingCardIds: Array<string> }> = req.body.battlingCardIds;

    battlingCardIds.forEach(battlingCard => {
        const attackingCard = attackerBattlefield.find(inGameCard => inGameCard.id === battlingCard.attackingCardId);
        if (!attackingCard) return;
        battlingCard.defendingCardIds.forEach(defendingCardId => {
            const defendingCard = defenderBattlefield.find(inGameCard => inGameCard.id === defendingCardId);
            if (!defendingCard) return;
            defenderBoard!.defendingCards!.push(defendingCard);
        });
    });

    game.step = Steps.RESOLVE;

    const fightingCardsStats: Array<{
                                        attackerCardStats: {id: string, attack: number, health: number},
                                        defenderCardsStats: Array<{id: string, attack: number, health: number}>
                                    }> = [];

    req.body.battlingCardIds.forEach((battlingCardIds: {attackingCardId: string, defendingCardIds: Array<string>}) => {
        const attackingCard = defenderBattlefield.find(card => card.id === battlingCardIds.attackingCardId);
        if (!attackingCard) return;
        const attackingCardStats: {id: string, attack: number, health: number} = {
            id: battlingCardIds.attackingCardId,
            attack: attackingCard.base_strength,
            health: attackingCard.base_health
        };
        const defendingCardsStats: Array<{id: string, attack: number, health: number}> = []
        battlingCardIds.defendingCardIds.forEach(defendingCardId => {
            const defendingCard = defenderBattlefield.find(card => card.id === defendingCardId);
            if (!defendingCard) return;
            defendingCardsStats.push({
                id: defendingCardId,
                attack: defendingCard.base_strength,
                health: defendingCard.base_health
            });
        });
        fightingCardsStats.push({
            attackerCardStats: attackingCardStats,
            defenderCardsStats: defendingCardsStats
        });
    })

    const attackerSurvivingCards: Array<{id: string, current_health: number}> = [];
    const attackerDeadCards: Array<{id: string, current_health: number}> = [];
    const defenderSurvivingCards: Array<{id: string, current_health: number}> = [];
    const defenderDeadCards: Array<{id: string, current_health: number}> = [];
    let defenderDamageDealt: number = 0;

    fightingCardsStats.forEach(fightingCardStats => {
        const survivingDefenders: Array<{id: string, current_health: number}> = [];
        const deadDefenders: Array<{id: string, current_health: number}> = [];

        if (fightingCardStats.defenderCardsStats.length > 0){
            fightingCardStats.defenderCardsStats.forEach(defenderCardStats => {
                const current_health: number = defenderCardStats.health - fightingCardStats.attackerCardStats.attack;
                if (current_health <= 0) deadDefenders.push({id: defenderCardStats.id, current_health: current_health});
                else survivingDefenders.push({id: defenderCardStats.id, current_health: current_health});
            })
            const damageDealtToAttacker: number = [
                ...fightingCardStats.defenderCardsStats.map(defenderCardStats => defenderCardStats.health)
            ].reduce((a, b) => a + b, 0);

            const current_health: number = fightingCardStats.attackerCardStats.health - damageDealtToAttacker;
            if (current_health <= 0) attackerDeadCards.push({id: fightingCardStats.attackerCardStats.id, current_health: current_health});
            else attackerSurvivingCards.push({id: fightingCardStats.attackerCardStats.id, current_health: current_health});
        } else {
            defenderDamageDealt += fightingCardStats.attackerCardStats.attack
        }

        defenderSurvivingCards.push(...survivingDefenders);
        defenderDeadCards.push(...deadDefenders);
    })

    attackerBoard.updateBattlefield(attackerSurvivingCards);
    attackerBoard.updateGraveyard(attackerDeadCards);

    defenderBoard.updateBattlefield(defenderSurvivingCards);
    defenderBoard.updateGraveyard(defenderDeadCards);

    defenderBoard.updateHealth(defenderDamageDealt);

    game.step = Steps.BEGIN;

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
            boards.push(new Board("player1",));
            games.set(params.roomName, new Game(null, boards));
        });
    });

    server.listen(8080, () => {
        console.log(`listening on http://localhost:${port}`);
    });
})();
