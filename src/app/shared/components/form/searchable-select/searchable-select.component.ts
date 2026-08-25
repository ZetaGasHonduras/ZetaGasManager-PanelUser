import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SearchableOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-searchable-select',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <button type="button" (click)="toggle()"
        class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-left text-sm shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800">
        <span class="flex items-center justify-between gap-2">
          <span [class.text-gray-400]="!selectedLabel" [class.text-gray-800]="selectedLabel"
            [class.dark:text-white/90]="selectedLabel" [class.dark:text-white/30]="!selectedLabel"
            class="truncate">
            {{ selectedLabel || placeholder }}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            class="shrink-0 text-gray-400 transition-transform" [class.rotate-180]="open">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      @if (open) {
        <div class="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div class="relative border-b border-gray-100 dark:border-white/[0.05]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2.25a7.75 7.75 0 1 0 4.45 14.02l4.64 4.64a.75.75 0 1 0 1.06-1.06l-4.64-4.64A7.75 7.75 0 0 0 10 2.25ZM3.75 10a6.25 6.25 0 1 1 12.5 0 6.25 6.25 0 0 1-12.5 0Z" fill="currentColor"/>
            </svg>
            <input #searchInput type="text" [(ngModel)]="search" placeholder="Buscar..."
              class="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-300 dark:placeholder:text-white/30" />
          </div>
          <ul class="max-h-52 overflow-auto custom-scrollbar">
            @for (opt of filtered; track opt.value) {
              <li>
                <button type="button" (click)="select(opt)"
                  class="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]">
                  {{ opt.label }}
                </button>
              </li>
            } @empty {
              <li class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Sin resultados</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class SearchableSelectComponent {
  @Input() options: SearchableOption[] = [];
  @Input() placeholder = 'Seleccionar...';
  @Input() value: string | number = '';
  @Output() valueChange = new EventEmitter<string | number>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  private host = inject(ElementRef);

  open = false;
  search = '';

  get selectedLabel(): string {
    return this.options.find(o => o.value.toString() === this.value.toString())?.label || '';
  }

  get filtered(): SearchableOption[] {
    const q = this.search.toLowerCase().trim();
    if (!q) return this.options;
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) {
      this.search = '';
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    }
  }

  select(opt: SearchableOption): void {
    this.valueChange.emit(opt.value);
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }
}
