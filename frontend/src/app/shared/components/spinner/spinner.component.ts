import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [class]="containerClass">
      <div
        class="animate-spin rounded-full border-2 border-neutral-200"
        [class]="spinnerClass"
        [style.border-top-color]="color"
      ></div>
    </div>
  `,
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color = '#2563eb';
  @Input() fullPage = false;

  get containerClass() {
    return this.fullPage ? 'min-h-screen' : 'py-8';
  }

  get spinnerClass() {
    const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return sizes[this.size];
  }
}
