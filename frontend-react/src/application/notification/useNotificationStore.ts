import { create } from "zustand";
import type { NotificationPayload } from "../../infrastructure/websocket";

export interface StoredNotification extends NotificationPayload {
  id: string;
  receivedAt: string;
}

interface NotificationState {
  notifications: StoredNotification[];
  unreadCount: number;
  addNotification: (notification: NotificationPayload) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: crypto.randomUUID(),
          receivedAt: new Date().toISOString(),
        },
        ...state.notifications,
      ].slice(0, 20),
      unreadCount: state.unreadCount + 1,
    })),

  markAllRead: () => set({ unreadCount: 0 }),
}));
