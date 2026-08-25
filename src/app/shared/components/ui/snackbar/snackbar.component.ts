import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService, SnackbarMessage } from '../../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none">
      @for (msg of snackbar.messages(); track msg.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all animate-slide-in"
          [ngClass]="{
            'bg-success-500/10 text-success-600 border border-success-500/20 dark:text-success-400': msg.type === 'success',
            'bg-error-500/10 text-error-600 border border-error-500/20 dark:text-error-400': msg.type === 'error',
            'bg-warning-500/10 text-warning-600 border border-warning-500/20 dark:text-warning-400': msg.type === 'warning',
            'bg-brand-500/10 text-brand-600 border border-brand-500/20 dark:text-brand-400': msg.type === 'info'
          }"
        >
          @if (msg.type === 'success') {
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          } @else if (msg.type === 'error') {
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          } @else if (msg.type === 'warning') {
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          } @else {
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          }
          <span class="flex-1">{{ msg.message }}</span>
          <button (click)="snackbar.dismiss(msg.id)" class="shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `
})
export class SnackbarComponent {
  snackbar = inject(SnackbarService);
}
