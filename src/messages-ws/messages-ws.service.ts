import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id: string]: Socket
}
interface Estimation {
    name: string;
    point: string;
}
interface Room {
    name: string;
    players: string[];
}
@Injectable()
export class MessagesWsService {
    private connectedClients: ConnectedClients = {};
    private estimation: Estimation[] = [];
    private rooms: Room[] = [];

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
    createRoom(roomName: string, playerName: string) {
        // Verificar si la sala ya existe
        const existingRoom = this.rooms.find((room) => room.name === roomName);
    
        if (existingRoom) {
          // La sala ya existe, simplemente agrega al jugador a la sala
          existingRoom.players.push(playerName);
        } else {
          // La sala no existe, crea una nueva sala y agrega al jugador
          const newRoom: Room = {
            name: roomName,
            players: [playerName],
          };
          this.rooms.push(newRoom);
        }
    
        // Retorna el nombre de la sala en la que se unió el jugador
        return roomName;
      }
      joinRoom(roomName: string, playerName: string) {
        // Busca la sala a la que el jugador desea unirse
        const roomToJoin = this.rooms.find((room) => room.name === roomName);
    
        if (roomToJoin) {
          // Agrega al jugador a la sala
          roomToJoin.players.push(playerName);
          return roomName;
        } else {
          // La sala no existe, puedes manejar este caso de acuerdo a tus necesidades
          // Por ejemplo, puedes crear la sala automáticamente o mostrar un mensaje de error
          return null;
        }
      }
      getRoomNameForPlayer(playerName: string): string | null {
        // Busca la sala a la que pertenece el jugador por su nombre
        for (const room of this.rooms) {
            if (room.players.includes(playerName)) {
                return room.name;
            }
        }
        return null; // El jugador no está en ninguna sala
    }
    
    
}
