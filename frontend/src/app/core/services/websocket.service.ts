import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client | null = null;
  connected = signal(false);

  connect(userId: number, onMessage: (msg: any) => void): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      onConnect: () => {
        this.connected.set(true);
        this.client?.subscribe(`/user/${userId}/queue/notifications`, (msg: IMessage) =>
          onMessage(JSON.parse(msg.body)),
        );
      },
      onDisconnect: () => this.connected.set(false),
      reconnectDelay: 5000,
    });
    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.connected.set(false);
  }
}
