import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) { }

  handleConnection(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    if (!sessionId) {
      client.disconnect();
      return;
    }
    client.join(sessionId);
    this.messagesWsService.registerClient(client, sessionId);
    this.wss.to(sessionId).emit('clients-updated', this.messagesWsService.getConnectedClients(sessionId));
    this.wss.to(sessionId).emit('message-from-server', this.messagesWsService.getEstimations(sessionId));
    const mode = this.messagesWsService.getCurrentMode(sessionId);
    client.emit('message-from-server3', mode);
  }

  handleDisconnect(client: Socket) {
    const sessionId = client.handshake.query.sessionId as string;
    if (sessionId) {
      this.messagesWsService.removeClient(client.handshake.headers.user as string, sessionId);
      this.wss.to(sessionId).emit('clients-updated', this.messagesWsService.getConnectedClients(sessionId));
    }
  }
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    const sessionId = client.handshake.query.sessionId as string;
    this.messagesWsService.registerEstimation({ name: client.handshake.headers.user as string, point: payload.message }, sessionId);
    this.wss.to(sessionId).emit('message-from-server', this.messagesWsService.getEstimations(sessionId));
  }

  @SubscribeMessage('message-from-client2')
  onMessageFromClient2(client: Socket, payload: any) {
    const sessionId = client.handshake.query.sessionId as string;
    if (payload.mostrar === true) {
      this.wss.to(sessionId).emit('message-from-server2', { mostrar: true, promedio: payload.promedio });
    } else {
      this.messagesWsService.cleanEstimations(sessionId);
      this.wss.to(sessionId).emit('message-from-server2', { mostrar: false, promedio: payload.promedio });
    }
  }

  @SubscribeMessage('message-from-client3')
  onMessageFromClient3(client: Socket, payload: any) {
    const sessionId = client.handshake.query.sessionId as string;
    this.messagesWsService.setCurrentMode(sessionId, payload);
    this.wss.to(sessionId).emit('message-from-server3', payload);
  }

  @SubscribeMessage('message-from-client4')
  onMessageFromClient4(client: Socket, payload: any) {
    const sessionId = client.handshake.query.sessionId as string;
    if (payload.disabledCount == true) {
      this.wss.to(sessionId).emit('message-from-server4', true);
    } else {
      this.wss.to(sessionId).emit('message-from-server4', false);
    }
  }
}
