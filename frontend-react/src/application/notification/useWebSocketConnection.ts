import { useEffect } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../../infrastructure/websocket";
import { useAuth } from "../auth/useAuth";
import { useNotificationStore } from "./useNotificationStore";

export function useWebSocketConnection(): void {
  const isAuthenticated = useAuth((state) => state.isAuthenticated());
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    connectWebSocket(addNotification);

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, addNotification]);
}
