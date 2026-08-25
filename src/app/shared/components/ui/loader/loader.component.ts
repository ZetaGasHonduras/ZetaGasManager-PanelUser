import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  template: `
    @if (loader.visible()) {
      <div class="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300">
        <div class="flex flex-col items-center gap-4">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <div class="text-center">
            <p class="text-lg font-semibold text-white">{{ loader.label() }}</p>
            <p class="mt-1 text-sm text-white/70">Espere un momento por favor</p>
          </div>
        </div>
      </div>
    }
  `
})
export class LoaderComponent {
  loader = inject(LoaderService);
}
