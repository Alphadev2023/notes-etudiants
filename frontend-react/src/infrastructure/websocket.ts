import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8081/ws";

export interface NotificationPayload {
  type: string;
  message: string;
  destinataireId: number;
  createdAt: string;
}

let client: Client | null = null;

export function connectWebSocket(
  onNotification: (notification: NotificationPayload) => void,
): Client {
  const token = localStorage.getItem("accessToken");

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    reconnectDelay: 5000,
    onConnect: () => {
      client?.subscribe("/user/queue/notifications", (message: IMessage) => {
        const payload: NotificationPayload = JSON.parse(message.body);
        onNotification(payload);
      });
    },
  });

  client.activate();
  return client;
}

export function disconnectWebSocket(): void {
  client?.deactivate();
  client = null;
}
