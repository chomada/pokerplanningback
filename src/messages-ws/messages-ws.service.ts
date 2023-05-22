import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id: string]: Socket
}
interface Estimation {
    name: string;
    point: string;
}
@Injectable()
export class MessagesWsService {
    private connectedClients: ConnectedClients = {};
    private estimation: Estimation[] = [];

    registerClient(client: Socket) {
        this.connectedClients[client.handshake.headers.user as string] = client;
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }
    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);

    }
    registerEstimation(est: Estimation) {
        let filtrado = this.estimation.find(fil => est.name === fil.name)
        if (!filtrado) {
            this.estimation.push(est);
        }
    }
    getEstimations(): Estimation[] {
        return this.estimation
    }
    cleanEstimations() {
        this.estimation = [];

    }
}
