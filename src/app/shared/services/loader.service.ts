import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private counter = 0;
  visible = signal(false);
  label = signal('Procesando datos...');

  show(customLabel?: string) {
    this.counter++;
    if (customLabel) this.label.set(customLabel);
    this.visible.set(true);
  }

  hide() {
    this.counter = Math.max(0, this.counter - 1);
    if (this.counter === 0) {
      this.visible.set(false);
      this.label.set('Procesando datos...');
    }
  }
}
