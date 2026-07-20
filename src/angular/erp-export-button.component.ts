import { 
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
  /**
   * Main button label text. Defaults to 'Export' or 'تصدير'
   */
  @Input() buttonText: string = 'Export';

  /**
   * If true, displays a spinner and changes text to "Exporting..."
   */
  @Input() isExporting: boolean = false;

  /**
   * Loading text to display when exporting
   */
  @Input() loadingText: string = 'Exporting...';

  /**
   * If true, disables the button and prevents dropdown interaction
   */
  @Input() disabled: boolean = false;

  /**
   * Direction of the interface ('rtl' | 'ltr')
   */
  @Input() dir: 'rtl' | 'ltr' = 'ltr';

  /**
   * Event emitted when an export option is clicked
   */
  @Output() exportTypeSelected = new EventEmitter<'excel' | 'pdf' | 'csv' | 'print'>();

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef<HTMLElement>;
  @ViewChild('mainButton') mainButton!: ElementRef<HTMLButtonElement>;

  isOpen: boolean = false;
  focusedItemIndex: number = -1;

  options: ExportOption[] = [
    {
      id: 'excel',
      labelAr: 'تصدير إلى Excel',
      labelEn: 'Export to Excel',
      icon: 'ri-file-excel-2-line',
      colorClass: 'text-success' // Uses --vz-success
    },
    {
      id: 'pdf',
      labelAr: 'تصدير إلى PDF',
      labelEn: 'Export to PDF',
      icon: 'ri-file-pdf-line',
      colorClass: 'text-danger' // Uses --vz-danger
    },
    {
      id: 'csv',
      labelAr: 'تصدير إلى CSV',
      labelEn: 'Export to CSV',
      icon: 'ri-file-text-line',
      colorClass: 'text-info' // Uses --vz-info
    },
    {
      id: 'print',
      labelAr: 'طباعة البيانات',
      labelEn: 'Print Data',
      icon: 'ri-printer-line',
      colorClass: 'text-dark' // Uses --vz-dark / text-dark
    }
  ];

  constructor(private elementRef: ElementRef) {}

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (this.disabled || this.isExporting) {
      return;
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focusedItemIndex = -1;
    }
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
}
