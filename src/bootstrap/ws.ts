import { randomInt, randomUUID } from 'crypto';
import type { Server as HttpServer } from 'node:http';
import { Server as WSServer, Socket } from 'socket.io';
import Card from '../entities/Card';
import { hasProperty } from '../utils';
import { getDataSource } from './database';

export default function configureWS (httpServer: HttpServer): WSServer {
  const io = new WSServer(httpServer);

  const lobbies = new Set<string>();
  const clients = new Map<string, Socket>();

  io.on('connection', (socket) => {
    if (!hasProperty(socket.handshake.auth, 'username')) {
      socket.disconnect(true);
    }
    const { username } = socket.handshake.auth as { username: string };
    lobbies.add(username);
    clients.set(username, socket);

    const refreshLobbies = setInterval(() => {
      socket.emit('refresh_lobbies', [...lobbies]);
    }, 200);

    socket.once('duel_request', async ({ to }: { to: string }) => {
      clearInterval(refreshLobbies);
      const opponent = clients.get(to)!;
      const roomName = 'room-' + randomUUID();
      opponent.join(roomName);
      socket.join(roomName);
      const cardPool = await getDataSource().createQueryBuilder(Card, 'card')
        .select()
        .orderBy('RANDOM()')
        .limit(60)
        .getMany();
      const decks = {
        [to]      : cardPool.splice(0, 30),
        [username]: cardPool.splice(0, 30),
      };
      const hands = {
        [to]      : decks[to].splice(0, 5),
        [username]: decks[username].splice(0, 5),
      };

      const onCastFrom = (from: string) => (cardId: string) => {
        io.to(roomName).emit('cast', { cardId, from });
      };

      const onNextGamePhase = (nextGamePhase: any) => {
        io.to(roomName).emit('next_game_phase', nextGamePhase);
      };

      opponent.on('cast', onCastFrom(to));
      socket.on('cast', onCastFrom(username));

      opponent.on('next_game_phase', onNextGamePhase);
      socket.on('next_game_phase', onNextGamePhase);

      await io.to(roomName)
        .timeout(1000)
        .emitWithAck('prepare_duel', {
          startingPlayer: randomInt(100) % 2 ? to : username,
          hands,
          decks,
        });
    });

    socket.on('disconnect', () => {
      lobbies.delete(username);
    });
  });

  return io;
}

