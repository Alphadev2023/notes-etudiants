import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './notification-bell.component.html',
})
export class NotificationBellComponent {
  open = signal(false);

  constructor(public notificationService: NotificationService) {}

  toggleOpen() {
    this.open.update((v) => !v);
    if (this.open()) {
      this.notificationService.markAllRead();
    }
  }
}
