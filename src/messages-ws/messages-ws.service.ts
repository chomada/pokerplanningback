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
    private connectedClients: { [sessionId: string]: ConnectedClients } = {};
    private estimations: { [sessionId: string]: Estimation[] } = {};
    private currentModes: { [sessionId: string]: { showAll: boolean, numbers: string[] } } = {};

    registerClient(client: Socket, sessionId: string) {
        if (!this.connectedClients[sessionId]) {
            this.connectedClients[sessionId] = {};
        }
        this.connectedClients[sessionId][client.handshake.headers.user as string] = client;
    }

    removeClient(clientId: string, sessionId: string) {
        if (this.connectedClients[sessionId]) {
            delete this.connectedClients[sessionId][clientId];
        }
    }

    getConnectedClients(sessionId: string): string[] {
        return this.connectedClients[sessionId] ? Object.keys(this.connectedClients[sessionId]) : [];
    }

    registerEstimation(est: Estimation, sessionId: string) {
        if (!this.estimations[sessionId]) {
            this.estimations[sessionId] = [];
        }
        let filtrado = this.estimations[sessionId].find(fil => est.name === fil.name)
        if (!filtrado) {
            this.estimations[sessionId].push(est);
        }
    }

    getEstimations(sessionId: string): Estimation[] {
        return this.estimations[sessionId] || [];
    }

    cleanEstimations(sessionId: string) {
        this.estimations[sessionId] = [];
    }

    getCurrentMode(sessionId: string): { showAll: boolean, numbers: string[] } {
        return this.currentModes[sessionId] || { showAll: false, numbers: ['1', '2', '3', '5', '8', '13', '☕'] };
    }

    setCurrentMode(sessionId: string, mode: { showAll: boolean, numbers: string[] }) {
        this.currentModes[sessionId] = mode;
    }
    
    
}
