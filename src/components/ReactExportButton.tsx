import React, { useState, useEffect, useRef } from 'react';

export interface ReactExportButtonProps {
  buttonText: string;
  isExporting: boolean;
  loadingText?: string;
  disabled: boolean;
  dir: 'rtl' | 'ltr';
  exportTypeSelected: (type: 'excel' | 'pdf' | 'csv' | 'print') => void;
}

export const ReactExportButton: React.FC<ReactExportButtonProps> = ({
  buttonText,
  isExporting,
  loadingText = 'Exporting...',
  disabled,
  dir,
  exportTypeSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const options = [
    {
      id: 'excel' as const,
      labelAr: 'تصدير إلى Excel',
      labelEn: 'Export to Excel',
      icon: 'ri-file-excel-2-line',
      colorClass: 'text-[var(--vz-success)] bg-[rgba(var(--vz-success-rgb),0.1)]',
      action: () => exportTypeSelected('excel')
    },
    {
      id: 'pdf' as const,
      labelAr: 'تصدير إلى PDF',
      labelEn: 'Export to PDF',
      icon: 'ri-file-pdf-line',
      colorClass: 'text-[var(--vz-danger)] bg-[rgba(var(--vz-danger-rgb),0.1)]',
      action: () => exportTypeSelected('pdf')
    },
    {
      id: 'csv' as const,
      labelAr: 'تصدير إلى CSV',
      labelEn: 'Export to CSV',
      icon: 'ri-file-text-line',
      colorClass: 'text-[var(--vz-info)] bg-[rgba(41,156,219,0.1)]',
      action: () => exportTypeSelected('csv')
    },
    {
      id: 'print' as const,
      labelAr: 'طباعة البيانات',
      labelEn: 'Print Data',
      icon: 'ri-printer-line',
      colorClass: 'text-[var(--vz-dark)] bg-[rgba(33,37,41,0.1)] dark:bg-white/10 dark:text-white',
      action: () => exportTypeSelected('print')
    }
  ];

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isExporting) return;
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleSelect = (action: () => void) => {
    if (disabled || isExporting) return;
    action();
    closeDropdown();
    buttonRef.current?.focus();
  };

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Keyboard Navigation inside Dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isExporting) return;

    switch (e.key) {
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          closeDropdown();
          buttonRef.current?.focus();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => (prev + 1) % options.length);
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
        }
        break;

      case 'Enter':
      case ' ':
        if (isOpen && focusedIndex >= 0) {
          e.preventDefault();
          handleSelect(options[focusedIndex].action);
        }
        break;

      case 'Tab':
        closeDropdown();
        break;
    }
  };

  // Focus item on index change
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.dropdown-item-btn');
      const activeItem = items[focusedIndex] as HTMLButtonElement;
      activeItem?.focus();
    }
  }, [focusedIndex, isOpen]);

  const isRTL = dir === 'rtl';

  return (
    <div 
      ref={containerRef} 
      className="relative inline-block font-sans select-none"
      style={{ direction: dir }}
      onKeyDown={handleKeyDown}
    >
      {/* Main Export Button */}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled || isExporting}
        onClick={toggleDropdown}
        className={`
          flex items-center justify-center px-[18px] min-h-[40px] rounded-[6px] 
          font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm
          outline-none active:scale-[0.98] border
          ${isExporting 
            ? 'bg-[var(--vz-primary)] border-[var(--vz-primary)] opacity-75 cursor-not-allowed text-white' 
            : 'bg-[var(--vz-primary)] hover:bg-[rgba(var(--vz-primary-rgb),0.92)] hover:-translate-y-[1px] hover:shadow-md text-white border-[var(--vz-primary)]'
          }
          ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}
          ${isOpen ? 'shadow-inner' : ''}
        `}
        style={{
          boxShadow: isOpen 
            ? 'inset 0 2px 4px rgba(0, 0, 0, 0.15)' 
            : '0 2px 5px rgba(0, 0, 0, 0.08)'
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={isExporting ? loadingText : buttonText}
      >
        {!isExporting ? (
          <>
            {/* Download Icon */}
            <i 
              className={`ri-download-2-line text-base leading-none ${isRTL ? 'ml-2' : 'mr-2'}`} 
              aria-hidden="true"
            />
            {/* Button Text */}
            <span className="leading-none">{buttonText}</span>
            {/* Caret Down Icon */}
            <i 
              className={`ri-arrow-down-s-line text-xs transition-transform duration-200 ${isRTL ? 'mr-2' : 'ml-2'} ${isOpen ? 'rotate-180' : ''}`} 
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            {/* Spinning SVG Loader */}
            <svg 
              className={`animate-spin h-4 w-4 text-white ${isRTL ? 'ml-2' : 'mr-2'}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="leading-none text-white opacity-90">{loadingText}</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      <ul
        className={`
          absolute top-[calc(100%+6px)] z-[1000] w-[220px] p-[6px] rounded-[8px]
          border border-[var(--vz-border-color)] bg-[var(--vz-card-bg-custom)] shadow-lg
          backdrop-blur-[10px] -webkit-backdrop-blur-[10px]
          transition-all duration-200 origin-top-right
          ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto block' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none hidden'}
          ${isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}
        `}
        role="menu"
      >
        {options.map((option, index) => {
          const isItemFocused = index === focusedIndex;
          const label = isRTL ? option.labelAr : option.labelEn;

          return (
            <li key={option.id} role="none" className="mb-[2px] last:mb-0">
              <button
                type="button"
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                className={`
                  dropdown-item-btn flex items-center w-full px-3 py-[8px] rounded-[6px] 
                  text-[13px] font-medium text-[var(--vz-body-color)] text-start
                  transition-all duration-150 border-none outline-none cursor-pointer
                  bg-transparent
                  ${isItemFocused ? 'bg-[var(--vz-active-hover-bg)] text-[var(--vz-primary)] font-semibold' : ''}
                  hover:bg-[var(--vz-active-hover-bg)] hover:text-[var(--vz-primary)]
                `}
                onClick={() => handleSelect(option.action)}
              >
                {/* Visual Icon with Custom Rounded Background Container */}
                <span 
                  className={`
                    flex items-center justify-center w-7 h-7 rounded-[6px] text-base
                    ${isRTL ? 'ml-3' : 'mr-3'} transition-transform duration-150
                    ${option.colorClass}
                    hover:scale-105
                  `}
                >
                  <i className={option.icon} aria-hidden="true" />
                </span>

                {/* Label */}
                <span className="flex-grow leading-none pt-[2px]">{label}</span>

                {/* Left/Right arrow indicator */}
                <span 
                  className={`
                    text-xs text-slate-300 dark:text-slate-600 transition-all duration-150
                    ${isRTL ? 'mr-auto rotate-180 hover:-translate-x-1' : 'ml-auto hover:translate-x-1'}
                  `}
                >
                  <i className="ri-arrow-right-s-line" aria-hidden="true" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
