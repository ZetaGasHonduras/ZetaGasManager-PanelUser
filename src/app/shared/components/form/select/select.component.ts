
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface Option {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.component.html',
})
export class SelectComponent implements OnInit {
  @Input() options: Option[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() className: string = '';
  @Input() defaultValue: string | number = '';
  @Input() value: string | number = '';

  @Output() valueChange = new EventEmitter<string | number>();

  ngOnInit() {
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
  }

  onChange(event: Event) {
    const raw = (event.target as HTMLSelectElement).value;
    const matched = this.options.find(o => o.value.toString() === raw);
    const value = matched ? matched.value : raw;
    this.value = value;
    this.valueChange.emit(value);
  }
}