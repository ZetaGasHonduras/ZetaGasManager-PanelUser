import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarMessage {
  id: number;
  message: string;
  type: SnackbarType;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private counter = 0;
  messages = signal<SnackbarMessage[]>([]);

  show(message: string, type: SnackbarType = 'info', duration = 4000) {
    const id = ++this.counter;
    this.messages.update(msgs => [...msgs, { id, message, type }]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string, duration = 4000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  dismiss(id: number) {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }
}
