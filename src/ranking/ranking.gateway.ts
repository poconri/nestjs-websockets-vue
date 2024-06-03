import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { faker } from '@faker-js/faker';

type Ranking = {
  name: string;
  points: number;
  avatarURL: string
  id: number;
};

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class RankingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  initialList(): Ranking[] {
    return Array.from({ length: 10 }, (_,index) => ({
      name: faker.person.fullName(),
	  avatarURL: faker.image.avatar(),
      points: Math.floor(Math.random() * 101),
	  id: index +1
    }));
  }

  afterInit(_: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    client.emit('initialList', this.initialList());
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  sendNewScore() {
    setInterval(() => {
      const newScore:Ranking = {
		name: faker.person.fullName(),
		avatarURL: faker.image.avatar(),
		points: Math.floor(Math.random() * 101),
		id: Math.floor(Math.random() * 20) +1,
	  }
      
	  this.server.emit('newScore', newScore)
    }, 5000);
  }
}
