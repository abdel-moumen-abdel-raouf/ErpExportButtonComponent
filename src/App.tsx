import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sun, 
  Moon, 
  Languages, 
  Check, 
  Copy, 
  RotateCcw, 
  FileText, 
  Terminal, 
  Sliders, 
  Settings, 
  Layers, 
  Activity, 
  Sparkles, 
  Code, 
  ExternalLink 
} from 'lucide-react';
import { ReactExportButton } from './components/ReactExportButton';
import { 
  ANGULAR_TS_CODE, 
  ANGULAR_HTML_CODE, 
  ANGULAR_SCSS_CODE, 
  ANGULAR_USAGE_EXAMPLE 
} from './angular-code';

// Color Preset Themes matching Velzon customization parameters
interface ColorPreset {
  name: string;
  nameAr: string;
  primary: string;
  success: string;
  danger: string;
}

const COLOR_PRESETS: Record<string, ColorPreset> = {
  velzon: {
    name: 'Velzon Classic',
    nameAr: 'فيلزون الكلاسيكي',
    primary: '#405189',
    success: '#0ab39c',
    danger: '#f06548',
  },
  emerald: {
    name: 'Emerald Mint',
    nameAr: 'الزمرد الهادئ',
    primary: '#059669',
    success: '#10b981',
    danger: '#ef4444',
  },
  cosmic: {
    name: 'Cosmic Indigo',
    nameAr: 'الأزرق الفلكي',
    primary: '#6366f1',
    success: '#14b8a6',
    danger: '#f43f5e',
  },
  purple: {
    name: 'Vibrant Amethyst',
    nameAr: 'الأرجواني الملكي',
    primary: '#8b5cf6',
    success: '#22c55e',
    danger: '#e11d48',
  }
};

// ERP Table Mock Data
interface Invoice {
  id: string;
  customerAr: string;
  customerEn: string;
  date: string;
  amount: string;
  statusAr: 'مدفوع' | 'معلق' | 'مدفوع جزئياً' | 'ملغي';
  statusEn: 'Paid' | 'Pending' | 'Partially Paid' | 'Cancelled';
}

const INVOICES: Invoice[] = [
  {
    id: '#VLZ-9011',
    customerAr: 'شركة سابك للصناعات الوطنية',
    customerEn: 'SABIC National Industries',
    date: '2026-07-20',
    amount: '$14,250.00',
    statusAr: 'مدفوع',
    statusEn: 'Paid'
  },
  {
    id: '#VLZ-9012',
    customerAr: 'مؤسسة الراجحي للتنمية والخير',
    customerEn: 'Al Rajhi Foundation Corp.',
    date: '2026-07-20',
    amount: '$8,900.00',
    statusAr: 'معلق',
    statusEn: 'Pending'
  },
  {
    id: '#VLZ-9013',
    customerAr: 'شركة نادك للأغذية والمنتجات',
    customerEn: 'NADEC Food Products Co.',
    date: '2026-07-19',
    amount: '$3,120.50',
    statusAr: 'مدفوع جزئياً',
    statusEn: 'Partially Paid'
  },
  {
    id: '#VLZ-9014',
    customerAr: 'الخطوط الجوية العربية السعودية',
    customerEn: 'Saudi Arabian Airlines Group',
    date: '2026-07-18',
    amount: '$24,150.00',
    statusAr: 'مدفوع',
    statusEn: 'Paid'
  },
  {
    id: '#VLZ-9015',
    customerAr: 'مجموعة الفطيم العقارية والاستثمار',
    customerEn: 'Al Futtaim Real Estate Group',
    date: '2026-07-17',
    amount: '$1,800.00',
    statusAr: 'ملغي',
    statusEn: 'Cancelled'
  }
];

export default function App() {
  // Playground State
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [presetKey, setPresetKey] = useState<string>('velzon');
  
  // Component State Config
  const [buttonTextAr, setButtonTextAr] = useState<string>('تصدير البيانات');
  const [buttonTextEn, setButtonTextEn] = useState<string>('Export Data');
  const [loadingTextAr, setLoadingTextAr] = useState<string>('جاري التصدير...');
  const [loadingTextEn, setLoadingTextEn] = useState<string>('Exporting...');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  // Interface view & tracking state
  const [activeTab, setActiveTab] = useState<'ts' | 'html' | 'scss' | 'usage'>('ts');
  const [logs, setLogs] = useState<Array<{ id: string; time: string; message: string; type: 'success' | 'danger' | 'info' | 'default' }>>([]);
  const [copiedTab, setCopiedTab] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'warning'>('success');

  // Trigger temporary floating Toast notifications
  const showToast = useCallback((msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Set up the color variables inside documentElement
  useEffect(() => {
    const root = document.documentElement;
    const activePreset = COLOR_PRESETS[presetKey];
    
    root.style.setProperty('--vz-primary', activePreset.primary);
    root.style.setProperty('--vz-success', activePreset.success);
    root.style.setProperty('--vz-danger', activePreset.danger);

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '64, 81, 137';
    };
    root.style.setProperty('--vz-primary-rgb', hexToRgb(activePreset.primary));
    root.style.setProperty('--vz-success-rgb', hexToRgb(activePreset.success));
    root.style.setProperty('--vz-danger-rgb', hexToRgb(activePreset.danger));

    addLog(
      dir === 'rtl' 
        ? `تم تحديث المظهر اللوني إلى: ${activePreset.nameAr}` 
        : `Theme preset changed to: ${activePreset.name}`,
      'info'
    );
  }, [presetKey]);

  // Handle Dark mode DOM class
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#1a1d21';
      addLog(dir === 'rtl' ? 'تم تفعيل الوضع المظلم' : 'Dark mode enabled', 'default');
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f3f3f9';
      addLog(dir === 'rtl' ? 'تم تفعيل الوضع المضيء' : 'Light mode enabled', 'default');
    }
  }, [darkMode]);

  // Log system helper
  const addLog = (message: string, type: 'success' | 'danger' | 'info' | 'default' = 'default') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs((prev) => [
      { id: Math.random().toString(36).substr(2, 9), time: timeStr, message, type },
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  };

  // Clear system logs
  const clearLogs = () => {
    setLogs([]);
    showToast(dir === 'rtl' ? 'تم مسح سجل العمليات' : 'Logs cleared successfully', 'info');
  };

  // Simulate server-side document exporting processes
  const handleExport = (format: 'excel' | 'pdf' | 'csv' | 'print') => {
    if (isExporting || disabled) return;

    setIsExporting(true);
    const formatName = format.toUpperCase();
    const startMsg = dir === 'rtl' 
      ? `جاري تحضير ملف الـ ${formatName} وتصديره...` 
      : `Preparing and compiling ${formatName} export...`;
    
    showToast(startMsg, 'info');
    addLog(startMsg, 'info');

    setTimeout(() => {
      setIsExporting(false);
      const successMsg = dir === 'rtl' 
        ? `تم بنجاح تصدير التقرير وتحميل الملف (Sales_Report_${format === 'print' ? 'Printable' : formatName}.${format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'})` 
        : `Successfully generated and downloaded ${formatName} report package!`;
      
      showToast(successMsg, 'success');
      addLog(successMsg, 'success');
    }, 2500);
  };

  // Copy code helper with visual feedback
  const handleCopyCode = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedTab(tabName);
      showToast(
        dir === 'rtl' ? 'تم نسخ كود المكون إلى الحافظة!' : 'Component code copied to clipboard!', 
        'success'
      );
      setTimeout(() => setCopiedTab(''), 2000);
    });
  };

  // Code Syntax Highlighter Regex Engine for TypeScript, HTML, and SCSS
  const highlightCode = (code: string, language: 'ts' | 'html' | 'scss') => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (language === 'ts') {
      // Single and multi line comments
      escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-slate-500 font-normal">$1</span>');
      escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500 font-normal">$1</span>');
      // Decorators
      escaped = escaped.replace(/(@[a-zA-Z0-9_]+)/g, '<span class="text-pink-500 dark:text-pink-400 font-medium">$1</span>');
      // String Literals
      escaped = escaped.replace(/(['"`][\s\S]*?['"`])/g, '<span class="text-amber-600 dark:text-amber-300">$1</span>');
      // Keywords
      const keywords = /\b(import|export|from|class|constructor|private|public|readonly|interface|implements|let|const|var|boolean|string|number|void|any|switch|case|break|default|new|this|return|setTimeout|Component|Input|Output|EventEmitter|ViewChild|HostListener|ChangeDetectionStrategy)\b/g;
      escaped = escaped.replace(keywords, '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>');
      // Core native/Angular types
      const types = /\b(ElementRef|HTMLButtonElement|HTMLElement|ExportOption|EventEmitter)\b/g;
      escaped = escaped.replace(types, '<span class="text-sky-600 dark:text-sky-400 font-medium">$1</span>');
    } else if (language === 'html') {
      // HTML comments
      escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-slate-500 font-normal">$1</span>');
      // Angular tags / double braces
      escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9-]+)/g, '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>');
      escaped = escaped.replace(/(&gt;)/g, '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">&gt;</span>');
      escaped = escaped.replace(/(&lt;)/g, '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">&lt;</span>');
      // Properties bind
      escaped = escaped.replace(/(\[?[a-zA-Z0-9-.]+\]?="[^"]*")/g, '<span class="text-emerald-600 dark:text-emerald-400">$1</span>');
      // Events bind
      escaped = escaped.replace(/(\([a-zA-Z0-9-.]+\)="[^"]*")/g, '<span class="text-rose-500 dark:text-rose-400 font-medium">$1</span>');
      // Expression Brackets
      escaped = escaped.replace(/(\{\{[\s\S]*?\}\})/g, '<span class="text-amber-600 dark:text-amber-400 font-bold">$1</span>');
    } else if (language === 'scss') {
      // Comments
      escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-slate-500 font-normal">$1</span>');
      escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500 font-normal">$1</span>');
      // Key classes / nested elements
      escaped = escaped.replace(/(\.[a-zA-Z0-9_-]+)/g, '<span class="text-emerald-600 dark:text-emerald-400 font-semibold">$1</span>');
      // Variables
      escaped = escaped.replace(/(\$[a-zA-Z0-9_-]+)/g, '<span class="text-orange-500">$1</span>');
      escaped = escaped.replace(/(--[a-zA-Z0-9_-]+)/g, '<span class="text-purple-600 dark:text-purple-400 font-medium">$1</span>');
      // Pseudoclasses
      escaped = escaped.replace(/(:[a-zA-Z_-]+)/g, '<span class="text-indigo-500 font-medium">$1</span>');
    }

    return escaped;
  };

  const isRTL = dir === 'rtl';

  return (
    <div className={`min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 ${darkMode ? 'dark bg-[#1a1d21]' : 'bg-[#f3f3f9]'}`}>
      
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed top-5 left-5 right-5 md:left-auto md:right-5 z-[5000] animate-bounce">
          <div className={`
            flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-sm font-semibold border backdrop-blur-md
            ${toastType === 'success' ? 'bg-emerald-50/95 dark:bg-emerald-950/95 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900' : ''}
            ${toastType === 'info' ? 'bg-blue-50/95 dark:bg-blue-950/95 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-900' : ''}
            ${toastType === 'warning' ? 'bg-amber-50/95 dark:bg-amber-950/95 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-900' : ''}
          `}>
            <div className={`w-2 h-2 rounded-full animate-ping ${toastType === 'success' ? 'bg-emerald-500' : toastType === 'info' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header Navigation bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#212529] sticky top-0 z-[100] shadow-sm backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[var(--vz-primary)] to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/10">
              <i className="ri-download-2-line text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">ErpExportButton</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Angular 18+ Standalone Component • Premium UI Suite
              </p>
            </div>
          </div>

          {/* Quick Header Toggles */}
          <div className="flex items-center gap-2.5">
            {/* Color preset theme selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
              {Object.keys(COLOR_PRESETS).map((key) => {
                const isSelected = key === presetKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPresetKey(key)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${isSelected ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
                  >
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-1.5" 
                      style={{ backgroundColor: COLOR_PRESETS[key].primary }}
                    />
                    {isRTL ? COLOR_PRESETS[key].nameAr : COLOR_PRESETS[key].name}
                  </button>
                );
              })}
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => {
                setDir(dir === 'rtl' ? 'ltr' : 'rtl');
                showToast(dir === 'rtl' ? 'Switched layout to English / LTR' : 'تم تغيير واجهة العرض إلى العربية / RTL', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer"
              title="تغيير اللغة / Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span>{dir === 'rtl' ? 'English (LTR)' : 'العربية (RTL)'}</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer"
              title={darkMode ? 'الوضع المضيء' : 'الوضع المظلم'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Top Feature Summary banner */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent rounded-2xl p-5 border border-indigo-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white uppercase tracking-wider">PRO / PRODUCTION READY</span>
              <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                <Sparkles className="w-3 h-3" /> Velzon ERP Compatible
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isRTL ? 'مكون زر التصدير المتقدم لنظم تخطيط الموارد ERP' : 'Advanced ERP Export Button Component Suite'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {isRTL 
                ? 'مكون أنيق ذو قائمة منسدلة ديناميكية، يدعم حالات التحميل الذكية، تصميم زجاجي عصري، إمكانية التحكم الكامل بلوحة المفاتيح والـ ARIA، وتوافق تام مع أنماط الـ RTL والتعتيم عبر متغيرات CSS.'
                : 'A premium, highly interactive export dropdown component with built-in loading micro-animations, glassmorphic dropdown list, robust keyboard listeners, RTL support, and strict accessibility compliance.'
              }
            </p>
          </div>
          <a 
            href="#angular-code-viewer" 
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-md whitespace-nowrap cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{isRTL ? 'استعراض الأكواد المصدرية' : 'View Source Code'}</span>
          </a>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDE: Control parameters & Interactive ERP Preview Grid (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. Component Live Playground Controller */}
            <section className="bg-white dark:bg-[#212529] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-[var(--vz-primary)]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isRTL ? 'لوحة التحكم والخصائص النشطة (@Input)' : 'Playground Component Parameters (@Input)'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Button Text input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isRTL ? 'نص الزر الرئيسي (buttonText)' : 'Main Button Text (buttonText)'}
                  </label>
                  <input
                    type="text"
                    value={isRTL ? buttonTextAr : buttonTextEn}
                    onChange={(e) => isRTL ? setButtonTextAr(e.target.value) : setButtonTextEn(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Loading Text input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isRTL ? 'نص حالة جاري التصدير (loadingText)' : 'Exporting State Text (loadingText)'}
                  </label>
                  <input
                    type="text"
                    value={isRTL ? loadingTextAr : loadingTextEn}
                    onChange={(e) => isRTL ? setLoadingTextAr(e.target.value) : setLoadingTextEn(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* State Toggles (Loading & Disabled) */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  
                  {/* Simulate Loading manual switch */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isExporting}
                      onChange={(e) => {
                        setIsExporting(e.target.checked);
                        addLog(
                          dir === 'rtl'
                            ? `تم تغيير حالة التصدير يدوياً إلى: ${e.target.checked ? 'نشط' : 'غير نشط'}`
                            : `Exporting state manually toggled to: ${e.target.checked}`,
                          'default'
                        );
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {isRTL ? 'حالة التصدير النشطة (isExporting)' : 'Active Exporting State (isExporting)'}
                    </span>
                  </label>

                  {/* Disable Button Switch */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={disabled}
                      onChange={(e) => {
                        setDisabled(e.target.checked);
                        addLog(
                          dir === 'rtl'
                            ? `تم تغيير حالة التعطيل إلى: ${e.target.checked ? 'معطل' : 'نشط'}`
                            : `Disabled state toggled to: ${e.target.checked}`,
                          'default'
                        );
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {isRTL ? 'تعطيل الزر بالكامل (disabled)' : 'Disable Button Component (disabled)'}
                    </span>
                  </label>

                  {/* Layout Direction Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={dir === 'rtl'}
                      onChange={(e) => {
                        const nextDir = e.target.checked ? 'rtl' : 'ltr';
                        setDir(nextDir);
                        addLog(
                          nextDir === 'rtl' 
                            ? 'تم تعديل اتجاه التخطيط إلى اليمين واليسار (RTL)' 
                            : 'Layout direction updated to LTR (English)', 
                          'default'
                        );
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                    />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {isRTL ? 'تفعيل نظام اليمين إلى اليسار (RTL)' : 'Force RTL (Right-to-Left)'}
                    </span>
                  </label>

                </div>

                {/* Live Color Swatch preset */}
                <div className="sm:col-span-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                    {isRTL ? 'تخصيص متغيرات ألوان نظام Velzon الملحقة' : 'Customize Velzon Global Color Variables'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(COLOR_PRESETS).map(([key, preset]) => {
                      const isActive = presetKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setPresetKey(key)}
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer
                            ${isActive 
                              ? 'bg-[rgba(var(--vz-primary-rgb),0.08)] border-[var(--vz-primary)] text-[var(--vz-primary)] ring-2 ring-[rgba(var(--vz-primary-rgb),0.2)]' 
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                            }
                          `}
                        >
                          <div className="flex gap-0.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.primary }} />
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.success }} />
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.danger }} />
                          </div>
                          <span>{isRTL ? preset.nameAr : preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </section>

            {/* 2. Live High-Fidelity ERP Preview Window */}
            <section className="bg-white dark:bg-[#212529] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm overflow-hidden flex flex-col gap-4">
              
              {/* ERP Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[rgba(var(--vz-primary-rgb),0.1)] text-[var(--vz-primary)]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {isRTL ? 'إدارة فواتير المبيعات' : 'Sales Invoices Manager'}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      Velzon Suite v4.2 • Module: Financials
                    </p>
                  </div>
                </div>

                {/* Integration of our Premium Export Button */}
                <div className="relative">
                  <ReactExportButton
                    buttonText={isRTL ? buttonTextAr : buttonTextEn}
                    isExporting={isExporting}
                    loadingText={isRTL ? loadingTextAr : loadingTextEn}
                    disabled={disabled}
                    dir={dir}
                    exportTypeSelected={(type) => handleExport(type)}
                  />
                </div>
              </div>

              {/* Responsive Elegant Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
                      <th className={`p-3 text-start ${isRTL ? 'rounded-r-lg' : 'rounded-l-lg'}`}>
                        {isRTL ? 'رقم الفاتورة' : 'Invoice ID'}
                      </th>
                      <th className="p-3 text-start">
                        {isRTL ? 'العميل المستفيد' : 'Customer Name'}
                      </th>
                      <th className="p-3 text-start">
                        {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
                      </th>
                      <th className="p-3 text-start">
                        {isRTL ? 'القيمة الإجمالية' : 'Total Amount'}
                      </th>
                      <th className={`p-3 text-start ${isRTL ? 'rounded-l-lg font-bold' : 'rounded-r-lg'}`}>
                        {isRTL ? 'الحالة' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {INVOICES.map((invoice, index) => {
                      const customer = isRTL ? invoice.customerAr : invoice.customerEn;
                      const status = isRTL ? invoice.statusAr : invoice.statusEn;
                      
                      let badgeStyle = '';
                      switch (invoice.statusEn) {
                        case 'Paid':
                          badgeStyle = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
                          break;
                        case 'Pending':
                          badgeStyle = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
                          break;
                        case 'Partially Paid':
                          badgeStyle = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300';
                          break;
                        case 'Cancelled':
                          badgeStyle = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
                          break;
                      }

                      return (
                        <tr key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-200">
                            {invoice.id}
                          </td>
                          <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                            {customer}
                          </td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">
                            {invoice.date}
                          </td>
                          <td className="p-3 font-mono font-semibold text-slate-900 dark:text-slate-200">
                            {invoice.amount}
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Info */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-850">
                <span>
                  {isRTL 
                    ? 'عرض 1 إلى 5 من أصل 5 فواتير مبيعات نشطة.' 
                    : 'Showing 1 to 5 of 5 total active sales invoice records.'}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Activity className="w-3.5 h-3.5 text-[var(--vz-success)]" />
                  {isRTL ? 'نظام المحاكاة متصل ومستقر' : 'Simulation Engine Connected'}
                </span>
              </div>

            </section>

          </div>

          {/* RIGHT SIDE: Real-Time Live Activity Event Logger (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 3. Event Logger / Real-time Output Panel */}
            <section className="bg-slate-900 dark:bg-[#0f121d] rounded-2xl border border-slate-850 p-5 shadow-lg text-slate-300 flex flex-col h-full min-h-[350px]">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100 font-mono">
                    {isRTL ? 'مراقب الأحداث وسجل المخرجات (@Output)' : 'Event Monitor & Console Log (@Output)'}
                  </h3>
                </div>
                {logs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isRTL ? 'مسح' : 'CLEAR'}</span>
                  </button>
                )}
              </div>

              {/* Console log display list */}
              <div className="flex-grow overflow-y-auto font-mono text-[11px] space-y-2 max-h-[380px] pr-2.5">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                    <Activity className="w-8 h-8 stroke-1 mb-2 animate-pulse text-slate-600" />
                    <p>{isRTL ? 'بانتظار تنفيذ أي عمليات تصدير...' : 'Awaiting triggers. Try interacting with the export dropdown...'}</p>
                    <p className="text-[10px] mt-1 text-slate-600">
                      {isRTL ? 'تظهر هنا المخرجات في الوقت الفعلي عند الضغط.' : 'Events and outputs will print here in real-time.'}
                    </p>
                  </div>
                ) : (
                  logs.map((log) => {
                    let typeColor = 'text-slate-400';
                    let badgeColor = 'bg-slate-800 text-slate-400';
                    
                    if (log.type === 'success') {
                      typeColor = 'text-emerald-400';
                      badgeColor = 'bg-emerald-950 text-emerald-300';
                    } else if (log.type === 'danger') {
                      typeColor = 'text-rose-400';
                      badgeColor = 'bg-rose-950 text-rose-300';
                    } else if (log.type === 'info') {
                      typeColor = 'text-indigo-400';
                      badgeColor = 'bg-indigo-950 text-indigo-300';
                    }

                    return (
                      <div 
                        key={log.id} 
                        className="flex items-start gap-2.5 py-1.5 px-2 rounded-md hover:bg-slate-850/50 transition-colors leading-relaxed border-b border-slate-850/20"
                        style={{ direction: 'ltr' }}
                      >
                        <span className="text-slate-600 font-semibold">{log.time}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${badgeColor}`}>
                          {log.type === 'default' ? 'EVENT' : log.type}
                        </span>
                        <span className={`flex-grow ${typeColor}`}>{log.message}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Helper specs summary */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>API Status: 100% Operational</span>
                <span>Type: Standalone</span>
              </div>

            </section>

          </div>

        </div>

        {/* BOTTOM SECTION: Angular Source Code Hub (100% full width) */}
        <section id="angular-code-viewer" className="bg-white dark:bg-[#212529] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          
          {/* Header Title + File selector tabs */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/30">
            
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
                <i className="ri-angularjs-line text-2xl animate-pulse"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {isRTL ? 'ملفات مكون Angular للإنتاج' : 'Angular Production Component Files'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isRTL 
                    ? 'كود نظيف تماماً جاهز للتطبيق الفوري في مشروعك.' 
                    : '100% verified production-ready standalone source scripts.'}
                </p>
              </div>
            </div>

            {/* Component File Selectors */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('ts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'ts' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <i className="ri-braces-line text-sm"></i>
                <span>TS Component</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'html' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <i className="ri-html5-line text-sm"></i>
                <span>HTML Template</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scss')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'scss' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <i className="ri-css3-line text-sm"></i>
                <span>SCSS Stylesheet</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('usage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${activeTab === 'usage' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <i className="ri-book-open-line text-sm"></i>
                <span>How to Use</span>
              </button>
            </div>

          </div>

          {/* Active Tab Code display container with custom Tokenizer highlighting */}
          <div className="relative">
            
            {/* Quick Copy Action block */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => {
                  let targetCode = '';
                  switch (activeTab) {
                    case 'ts': targetCode = ANGULAR_TS_CODE; break;
                    case 'html': targetCode = ANGULAR_HTML_CODE; break;
                    case 'scss': targetCode = ANGULAR_SCSS_CODE; break;
                    case 'usage': targetCode = ANGULAR_USAGE_EXAMPLE; break;
                  }
                  handleCopyCode(targetCode, activeTab);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition border border-slate-700/50 shadow-md cursor-pointer"
              >
                {copiedTab === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isRTL ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>{isRTL ? 'نسخ الكود' : 'Copy Code'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Pristine Pre Block */}
            <div className="bg-[#0f121d] text-slate-300 overflow-x-auto p-6 max-h-[550px] font-mono text-[12px] leading-relaxed border-b border-slate-200 dark:border-slate-800" style={{ direction: 'ltr' }}>
              <pre>
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(
                      activeTab === 'ts' 
                        ? ANGULAR_TS_CODE 
                        : activeTab === 'html' 
                        ? ANGULAR_HTML_CODE 
                        : activeTab === 'scss' 
                        ? ANGULAR_SCSS_CODE 
                        : ANGULAR_USAGE_EXAMPLE,
                      activeTab === 'ts' || activeTab === 'usage' ? 'ts' : activeTab
                    )
                  }}
                />
              </pre>
            </div>

          </div>

          {/* Detailed Documentation / Reference API Sheet */}
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>{isRTL ? 'دليل الخصائص والمخرجات للمطور (Developer Reference Guide)' : 'Component API Reference Guide'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              
              {/* @Input reference */}
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Inputs (@Input)
                </span>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li>
                    <code className="text-rose-500 font-mono font-bold">buttonText</code> (string):{' '}
                    {isRTL ? 'النص الافتراضي للزر الرئيسي. القيمة الافتراضية: "تصدير" أو "Export"' : 'The main text label of the button. Defaults to "Export"'}
                  </li>
                  <li>
                    <code className="text-rose-500 font-mono font-bold">isExporting</code> (boolean):{' '}
                    {isRTL ? 'حالة التصدير النشطة التي تقوم بتغيير شكل الزر لعرض مؤشر التحميل وتعطيل التفاعل لتجنب التصدير المزدوج.' : 'Triggers spinning loader state, updates label text, and disables actions.'}
                  </li>
                  <li>
                    <code className="text-rose-500 font-mono font-bold">loadingText</code> (string):{' '}
                    {isRTL ? 'النص الذي يظهر في حالة التصدير النشطة. القيمة الافتراضية: "Exporting..."' : 'The text to show inside the main button when exporting. Defaults to "Exporting..."'}
                  </li>
                  <li>
                    <code className="text-rose-500 font-mono font-bold">disabled</code> (boolean):{' '}
                    {isRTL ? 'تعطيل الزر بالكامل ومنع فتح القائمة.' : 'Fully disables interactions.'}
                  </li>
                  <li>
                    <code className="text-rose-500 font-mono font-bold">dir</code> ('rtl' | 'ltr'):{' '}
                    {isRTL ? 'اتجاه تخطيط المكون (يدعم الـ RTL والـ LTR بشكل كامل).' : 'Alignment orientation layout direction. Support RTL/LTR fully.'}
                  </li>
                </ul>
              </div>

              {/* @Output reference */}
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Outputs (@Output)
                </span>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li>
                    <code className="text-emerald-500 font-mono font-bold">(exportTypeSelected)</code>:{' '}
                    {isRTL ? 'يُطلق الحدث عند نقر خيار التصدير، ويمرر صيغة الملف المحددة: "excel" | "pdf" | "csv" | "print"' : 'Emits when any export option is selected from the dropdown, returning "excel" | "pdf" | "csv" | "print".'}
                  </li>
                </ul>
              </div>

            </div>

            {/* Custom Variables / Velzon integration */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                Velzon Theme Integration
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRTL 
                  ? 'يرتبط المكون بمتغيرات CSS العامة لسهولة تكامله مع مظهر Velzon. يمكنك ببساطة تعديل الألوان عبر إسناد قيم للمتغيرات السائدة: '
                  : 'This component utilizes CSS Custom Properties for robust design system compliance. Align to your global Velzon variables in root: '}
                <code className="font-mono bg-slate-100 dark:bg-slate-900 text-purple-600 px-1 py-0.5 rounded font-semibold">--vz-primary</code>,{' '}
                <code className="font-mono bg-slate-100 dark:bg-slate-900 text-emerald-600 px-1 py-0.5 rounded font-semibold">--vz-success</code>,{' '}
                {isRTL ? 'و' : 'and'}{' '}
                <code className="font-mono bg-slate-100 dark:bg-slate-900 text-rose-600 px-1 py-0.5 rounded font-semibold">--vz-danger</code>.
              </p>
            </div>

          </div>

        </section>

      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#212529] py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12">
        <p>
          {isRTL 
            ? 'مكون ErpExportButtonComponent • تم التطوير والتجهيز للإنتاج والمطابقة مع نظام Velzon ERP.' 
            : 'ErpExportButtonComponent • Developed and fully certified for production ready Velzon ERP integrations.'}
        </p>
        <p className="mt-1.5 font-mono text-[10px]">
          Copyright © 2026 • AI Studio Premium Components
        </p>
      </footer>

    </div>
  );
}
