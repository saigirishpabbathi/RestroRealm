import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private audio: HTMLAudioElement;
  private notificationEnabled = true;

  constructor() {
    this.audio = new Audio('assets/notification.mp3');
  }

  playNewOrderNotification(): void {
    if (this.notificationEnabled) {
      this.audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  }

  toggleNotifications(enabled: boolean): void {
    this.notificationEnabled = enabled;
  }
}
