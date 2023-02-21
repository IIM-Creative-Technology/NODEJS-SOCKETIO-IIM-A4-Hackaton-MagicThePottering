import crypto from "node:crypto";
import http from "node:http";

import { Server } from "socket.io";
import express from 'express';


const app = express();
const server = http.createServer(app);
const host = "localhost";
const port = 8080;

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

const games: Map<string, string> = new Map()

const rooms: Array<{id: string, name: string}> = []

const users: Map<string, {username: string, room: string}> = new Map()

function getRoomUserList(room: string) {
    let roomUserList: Array<string> = []
    users.forEach(user => {
        if (room === user.room) {
            roomUserList.push(user.username)
        }
    })
    return roomUserList
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on("signUp", async (params) => {
        // try {
        //     const result = await User.findAll({
        //         where: {
        //             username: params.username
        //         }
        //     });
        //     if (result.length > 0) throw new Error(`${params.username} is already used`)
        //     const newUserSalt = crypto.randomBytes(16).toString('hex');
        //
        //     User.create({username: params.username, salt: newUserSalt, password: crypto.pbkdf2Sync(params.password, newUserSalt, 1000, 64, 'sha256').toString('hex')})
        //         .then(() => console.log("The user has been saved in the database"));
        //     console.log(`${params.username} successfully added to db`);
        //     socket.emit('sign-up-response', {status: 'done', user: {}});
        // } catch (e) {
        //     console.log(e.message)
        //     socket.emit('sign-up-response', {status: 'error', message: e.message});
        // }
    });

    socket.on('signIn', async (params) => {
        // try {
        //     const result = await User.findAll({
        //         where: {
        //             username: params.username
        //         }
        //     })
        //     if (result.length === 0) throw new Error(`This username doesn't exist`)
        //     const user = result[0].dataValues
        //     const password = crypto.pbkdf2Sync(params.password, user.salt, 1000, 64, 'sha256').toString('hex')
        //     if (password !== user.password) throw new Error('Wrong password')
        //     socket.emit('sign-in-response', {status: 'done', user: {}});
        //
        // } catch (e) {
        //     socket.emit('sign-in-response', {status: 'error', message: e.message});
        // }
    });

    socket.on('joinRoom', async (params) => {
        let roomUserList = getRoomUserList(params.roomName);
        rooms.push({id: socket.id, name: params.roomName});
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(8080, host, () => {
    console.log(`listening on http://${host}:${port}`);
});