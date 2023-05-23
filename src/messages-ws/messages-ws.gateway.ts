import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) { }

  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    this.wss.emit('message-from-server', this.messagesWsService.getEstimations());
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.handshake.headers.user as string);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    this.messagesWsService.registerEstimation({ name: client.handshake.headers.user as string, point: payload.message })

    this.wss.emit('message-from-server', this.messagesWsService.getEstimations());

  }
  @SubscribeMessage('message-from-client2')
  onMessageFromClient2(client: Socket, payload: any) {

    if (payload.mostrar == true) {
      this.wss.emit('message-from-server2', true);
    } else {
      this.messagesWsService.cleanEstimations();
      this.wss.emit('message-from-server2', false);


    }

  }
}
