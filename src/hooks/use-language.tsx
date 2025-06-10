import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
// Simplified translations with only English and Arabic
const translations: Record<string, Record<string, string>> = {
  en: {
    "dashboard": "Dashboard",
    "equipment": "Equipment",
    "compliance": "Compliance",
    "vendors": "Vendors",
    "analytics": "Analytics",
    "settings": "Settings",
    "notifications": "Notifications",
    "logout": "Logout",
    "equipment_registry": "Equipment Registry",
    "maintenance": "Maintenance",
    "checklist": "Checklist",
    "document_tracker": "Document Tracker",
    "welcome": "Welcome",
    "expired": "Expired",
    "expiring_soon": "Expiring Soon",
    "valid": "Valid",
    "upload_documents": "Upload Documents",
    "vendor_verification": "Vendor Verification",
    "help": "Help",
    "operators": "Operators",
    // Login page translations
    "email_address": "Email Address",
    "password": "Password",
    "forgot_password": "Forgot password?",
    "remember_me": "Remember me",
    "login": "Login",
    "logging_in": "Logging in...",
    "login_successful": "Login Successful",
    "login_failed": "Login Failed",
    "welcome_back": "Welcome back",
    "demo_credentials": "Demo Email Credentials",
    "or_use_gmail": "Or use any Gmail address with a password of 6+ characters",
    // New translations
    "how_it_works": "How It Works",
    "quickstart_guide": "Quickstart Guide",
    "get_started": "Get Started",
    "close": "Close",
    "equipment_management": "Equipment Management",
    "user_roles": "User Roles",
    "admin": "Admin",
    "operator": "Operator",
    "hse": "HSE",
    "navigation": "Navigation",
    "quick_access": "Quick Access",
    "menu_features": "Menu Features",
    "full_access": "Full access",
    "daily_uploads": "Daily uploads",
    "view_only": "View only",
    "document_status": "Document Status",
    "system_status": "System Status",
    "last_updated": "Last updated",
    "learn_more": "Learn More",
    "color_codes": "Color Codes",
    // Missing translations added
    "ago": "ago",
    "main": "Main",
    "management": "Management",
    "notificationPreferences": "Notification Preferences",
    "howItWorks": "How It Works",
    "certifications": "Certifications",
    "scheduling": "Scheduling",
    "users": "Users",
    "documents": "Documents"
  },
  ar: {
    "dashboard": "لوحة القيادة",
    "equipment": "المعدات",
    "compliance": "الامتثال",
    "vendors": "الموردين",
    "analytics": "التحليلات",
    "settings": "الإعدادات",
    "notifications": "الإشعارات",
    "logout": "تسجيل الخروج",
    "equipment_registry": "سجل المعدات",
    "maintenance": "الصيانة",
    "checklist": "قائمة التحقق",
    "document_tracker": "متتبع المستندات",
    "welcome": "مرحبًا",
    "expired": "منتهي الصلاحية",
    "expiring_soon": "ينتهي قريبًا",
    "valid": "صالح",
    "upload_documents": "تحميل المستندات",
    "vendor_verification": "التحقق من المورد",
    "help": "مساعدة",
    "operators": "المشغلين",
    // Login page translations
    "email_address": "عنوان البريد الإلكتروني",
    "password": "كلمة المرور",
    "forgot_password": "هل نسيت كلمة المرور؟",
    "remember_me": "تذكرني",
    "login": "تسجيل الدخول",
    "logging_in": "جاري تسجيل الدخول...",
    "login_successful": "تم تسجيل الدخول بنجاح",
    "login_failed": "فشل تسجيل الدخول",
    "welcome_back": "مرحبًا بعودتك",
    "demo_credentials": "بيانات الاعتماد التجريبية",
    "or_use_gmail": "أو استخدم أي عنوان بريد إلكتروني من Gmail بكلمة مرور تتكون من 6 أحرف أو أكثر",
    // New translations
    "how_it_works": "كيف يعمل النظام",
    "quickstart_guide": "دليل البدء السريع",
    "get_started": "ابدأ الآن",
    "close": "إغلاق",
    "equipment_management": "إدارة المعدات",
    "user_roles": "أدوار المستخدمين",
    "admin": "المسؤول",
    "operator": "المشغل",
    "hse": "الصحة والسلامة",
    "navigation": "التنقل",
    "quick_access": "وصول سريع",
    "menu_features": "ميزات القائمة",
    "full_access": "وصول كامل",
    "daily_uploads": "تحميلات يومية",
    "view_only": "عرض فقط",
    "document_status": "حالة المستند",
    "system_status": "حالة النظام",
    "last_updated": "آخر تحديث",
    "learn_more": "معرفة المزيد",
    "color_codes": "رموز الألوان",
    // Missing translations added
    "ago": "منذ",
    "main": "الرئيسية",
    "management": "الإدارة",
    "notificationPreferences": "تفضيلات الإشعارات",
    "howItWorks": "كيف يعمل النظام",
    "certifications": "الشهادات",
    "scheduling": "الجدولة",
    "users": "المستخدمون",
    "documents": "المستندات",
    "Projects": "المشاريع"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    // Only allow English or Arabic
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setCurrentLanguage(savedLanguage);
      
      // MODIFIED: Always keep LTR direction regardless of language
      document.documentElement.dir = 'ltr';
      document.documentElement.style.direction = 'ltr';
      document.documentElement.lang = savedLanguage;
      
      // Add arabic font class for Arabic but don't add RTL class
      if (savedLanguage === 'ar') {
        document.body.classList.add('font-arabic');
        document.documentElement.classList.remove('rtl-active');
      } else {
        document.body.classList.remove('font-arabic');
        document.documentElement.classList.remove('rtl-active');
      }
    }
  }, []);
  
  const setLanguage = (lang: string) => {
    // Only allow English or Arabic
    if (lang !== 'en' && lang !== 'ar') {
      lang = 'en'; // Default to English if an invalid language is provided
    }
    
    setCurrentLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
    
    // MODIFIED: Always keep LTR direction regardless of language
    document.documentElement.dir = 'ltr';
    document.documentElement.style.direction = 'ltr';
    document.documentElement.lang = lang;
    
    // Add arabic font class for Arabic but don't add RTL class
    if (lang === 'ar') {
      document.body.classList.add('font-arabic');
      document.documentElement.classList.remove('rtl-active');
    } else {
      document.body.classList.remove('font-arabic');
      document.documentElement.classList.remove('rtl-active');
    }
  };
  
  const t = (key: string) => {
    return translations[currentLanguage]?.[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}