/**
 * Source code for the ErpExportButtonComponent Angular component
 * to be showcased and made copyable in the React Playground.
 */

export const ANGULAR_TS_CODE = `import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  HostListener, 
  ElementRef, 
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';

export interface ExportOption {
  id: 'excel' | 'pdf' | 'csv' | 'print';
  labelAr: string;
  labelEn: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-erp-export-button',
  standalone: false,
  templateUrl: './erp-export-button.component.html',
  styleUrls: ['./erp-export-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErpExportButtonComponent {
  /** Main button label text. */
  @Input() buttonText: string = 'Export';

  /** If true, displays a spinner and changes text to "Exporting..." */
  @Input() isExporting: boolean = false;

  /** Loading text to display when exporting */
  @Input() loadingText: string = 'Exporting...';

  /** If true, disables the button and prevents dropdown interaction */
  @Input() disabled: boolean = false;

  /** Direction of the interface ('rtl' | 'ltr'). */
  @Input() dir: 'rtl' | 'ltr' = 'ltr';

  /** Event emitted when an export option is clicked */
  @Output() exportTypeSelected = new EventEmitter<'excel' | 'pdf' | 'csv' | 'print'>();

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef<HTMLElement>;
  @ViewChild('mainButton') mainButton!: ElementRef<HTMLButtonElement>;

  isOpen: boolean = false;
  focusedItemIndex: number = -1;

  options: ExportOption[] = [
    { id: 'excel', labelAr: 'تصدير إلى Excel', labelEn: 'Export to Excel', icon: 'ri-file-excel-2-line', colorClass: 'text-success' },
    { id: 'pdf', labelAr: 'تصدير إلى PDF', labelEn: 'Export to PDF', icon: 'ri-file-pdf-line', colorClass: 'text-danger' },
    { id: 'csv', labelAr: 'تصدير إلى CSV', labelEn: 'Export to CSV', icon: 'ri-file-text-line', colorClass: 'text-info' },
    { id: 'print', labelAr: 'طباعة البيانات', labelEn: 'Print Data', icon: 'ri-printer-line', colorClass: 'text-dark' }
  ];

  constructor(private elementRef: ElementRef) {}

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (this.disabled || this.isExporting) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.focusedItemIndex = -1;
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.focusedItemIndex = -1;
  }

  selectOption(id: 'excel' | 'pdf' | 'csv' | 'print'): void {
    if (this.disabled || this.isExporting) return;

    this.exportTypeSelected.emit(id);
    this.closeDropdown();
    this.mainButton.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.disabled || this.isExporting) return;

    switch (event.key) {
      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          this.closeDropdown();
          this.mainButton.nativeElement.focus();
        }
        break;

      case 'ArrowDown':
        if (!this.isOpen) {
          event.preventDefault();
          this.isOpen = true;
          this.focusedItemIndex = 0;
          this.focusItem(0);
        } else {
          event.preventDefault();
          this.focusedItemIndex = (this.focusedItemIndex + 1) % this.options.length;
          this.focusItem(this.focusedItemIndex);
        }
        break;

      case 'ArrowUp':
        if (this.isOpen) {
          event.preventDefault();
          this.focusedItemIndex = this.focusedItemIndex <= 0 ? this.options.length - 1 : this.focusedItemIndex - 1;
          this.focusItem(this.focusedItemIndex);
        }
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  private focusItem(index: number): void {
    setTimeout(() => {
      if (this.dropdownMenu) {
        const listItems = this.dropdownMenu.nativeElement.querySelectorAll('.dropdown-item');
        if (listItems && listItems[index]) {
          (listItems[index] as HTMLElement).focus();
        }
      }
    });
  }
}`;

export const ANGULAR_HTML_CODE = `<!-- ErpExportButton Component HTML Template -->
<div class="erp-export-container" [class.rtl-layout]="dir === 'rtl'" [class.ltr-layout]="dir === 'ltr'">
  
  <!-- Main Export Button Trigger -->
  <button
    #mainButton
    id="erp-export-main-trigger"
    type="button"
    class="btn-export-main"
    [class.is-loading]="isExporting"
    [class.is-open]="isOpen"
    [disabled]="disabled || isExporting"
    [attr.aria-haspopup]="'true'"
    [attr.aria-expanded]="isOpen"
    [attr.aria-controls]="'erp-export-dropdown-menu'"
    [attr.aria-label]="isExporting ? loadingText : buttonText"
    (click)="toggleDropdown($event)"
  >
    <!-- Normal State Content -->
    <ng-container *ngIf="!isExporting">
      <i class="ri-download-2-line btn-icon" aria-hidden="true"></i>
      <span class="btn-text">{{ buttonText }}</span>
      <i class="ri-arrow-down-s-line btn-caret" aria-hidden="true"></i>
    </ng-container>

    <!-- Loading State -->
    <ng-container *ngIf="isExporting">
      <svg class="spinner-icon" viewBox="0 0 50 50" aria-hidden="true">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
      <span class="btn-text loading-text">{{ loadingText }}</span>
    </ng-container>
  </button>

  <!-- Dropdown Menu -->
  <ul
    #dropdownMenu
    id="erp-export-dropdown-menu"
    class="export-dropdown-menu"
    [class.show]="isOpen"
    role="menu"
    aria-labelledby="erp-export-main-trigger"
  >
    <li *ngFor="let option of options; let i = index" role="none" class="menu-item-wrapper">
      <button
        type="button"
        class="dropdown-item"
        role="menuitem"
        [tabindex]="isOpen ? 0 : -1"
        [attr.aria-label]="dir === 'rtl' ? option.labelAr : option.labelEn"
        (click)="selectOption(option.id)"
        (keydown.enter)="selectOption(option.id)"
        (keydown.space)="$event.preventDefault(); selectOption(option.id)"
      >
        <span class="item-icon-container" [ngClass]="option.colorClass">
          <i [class]="option.icon" aria-hidden="true"></i>
        </span>
        
        <span class="item-label">
          {{ dir === 'rtl' ? option.labelAr : option.labelEn }}
        </span>

        <span class="item-arrow-indicator">
          <i class="ri-arrow-right-s-line" aria-hidden="true"></i>
        </span>
      </button>
    </li>
  </ul>
</div>`;

export const ANGULAR_SCSS_CODE = `/** ErpExportButton SCSS Stylesheet */
:host {
  display: inline-block;
  --vz-item-hover-color: var(--vz-primary, #405189);
}

.erp-export-container {
  position: relative;
  display: inline-block;
  font-family: inherit;
  font-weight: 500;

  &.rtl-layout {
    direction: rtl;
    .btn-icon { margin-left: 8px; }
    .btn-caret { margin-right: 8px; }
    .export-dropdown-menu {
      left: 0; right: auto;
      transform-origin: top left;
    }
    .item-icon-container { margin-left: 12px; }
    .item-arrow-indicator {
      margin-right: auto; margin-left: 0;
      transform: scaleX(-1);
    }
    .dropdown-item:hover .item-arrow-indicator {
      transform: translateX(-4px) scaleX(-1);
    }
  }

  &.ltr-layout {
    direction: ltr;
    .btn-icon { margin-right: 8px; }
    .btn-caret { margin-left: 8px; }
    .export-dropdown-menu {
      right: 0; left: auto;
      transform-origin: top right;
    }
    .item-icon-container { margin-right: 12px; }
    .item-arrow-indicator { margin-left: auto; margin-right: 0; }
    .dropdown-item:hover .item-arrow-indicator {
      transform: translateX(4px);
    }
  }
}

.btn-export-main {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 18px;
  min-height: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background-color: var(--vz-primary);
  border: 1px solid var(--vz-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  outline: none;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.95;
    box-shadow: 0 4px 12px rgba(var(--vz-primary-rgb, 64, 81, 137), 0.25);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    box-shadow: none;
  }

  &.is-open {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
    .btn-caret { transform: rotate(180deg); }
  }

  .btn-icon { font-size: 16px; }
  .btn-caret { font-size: 12px; transition: transform 0.2s ease; }
}

.spinner-icon {
  animation: rotate 2s linear infinite;
  width: 16px; height: 16px;
  margin-left: 8px; margin-right: 8px;

  & .path {
    stroke: #ffffff;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
}

@keyframes rotate { 100% { transform: rotate(360deg); } }

.export-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  z-index: 1000;
  display: none;
  min-width: 210px;
  padding: 6px;
  border-radius: 8px;
  background: var(--vz-card-bg-custom, var(--vz-card-bg, #212529));
  border: 1px solid var(--vz-border-color);
  box-shadow: var(--vz-dropdown-shadow, 0 8px 32px 0 rgba(0, 0, 0, 0.37));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(10px);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;

  &.show {
    display: block;
    transform: translateY(0);
    opacity: 1;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--vz-body-color, #adb5bd);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover, &:focus {
    background-color: var(--vz-active-hover-bg, rgba(255, 255, 255, 0.08));
    color: var(--vz-primary);
  }

  .item-icon-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    border-radius: 6px;
    font-size: 15px;

    &.text-success { color: var(--vz-success); background-color: rgba(10, 179, 156, 0.1); }
    &.text-danger { color: var(--vz-danger); background-color: rgba(240, 101, 72, 0.1); }
    &.text-info { color: var(--vz-info); background-color: rgba(41, 156, 219, 0.1); }
    &.text-dark { color: var(--vz-dark); background-color: rgba(33, 37, 41, 0.1); }
  }
}`;

export const ANGULAR_USAGE_EXAMPLE = `// 1. Importing standard-module declaration component
import { Component } from '@angular/core';

@Component({
  selector: 'app-sales-dashboard',
  standalone: false,
  template: \`
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Sales Invoices</h5>
        
        <!-- ERP Advanced Export Button -->
        <app-erp-export-button
          [buttonText]="dir === 'rtl' ? 'تصدير' : 'Export'"
          [isExporting]="isExporting"
          [dir]="dir"
          (exportTypeSelected)="onExportSelected($event)"
        ></app-erp-export-button>
        
      </div>
    </div>
  \`
})
export class SalesDashboardComponent {
  isExporting = false;
  dir: 'rtl' | 'ltr' = 'ltr';

  onExportSelected(format: 'excel' | 'pdf' | 'csv' | 'print') {
    this.isExporting = true;
    console.log(\`Starting export format: \${format}\`);
    
    // Simulate process duration
    setTimeout(() => {
      this.isExporting = false;
    }, 2000);
  }
}`;
