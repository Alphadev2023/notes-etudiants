import { Injectable, signal } from '@angular/core';

export interface Notification {
  type: string;
  message: string;
  destinataireId: number;
  createdAt: string;
  read?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([]);

  notifications = this.notificationsSignal.asReadonly();

  unreadCount = signal(0);

  add(notification: Notification): void {
    this.notificationsSignal.update((list) => [{ ...notification, read: false }, ...list]);
    this.unreadCount.update((c) => c + 1);
  }

  markAllRead(): void {
    this.notificationsSignal.update((list) => list.map((n) => ({ ...n, read: true })));
    this.unreadCount.set(0);
  }

  clear(): void {
    this.notificationsSignal.set([]);
    this.unreadCount.set(0);
  }
}
