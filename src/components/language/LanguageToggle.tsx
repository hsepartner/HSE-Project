import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function LanguageToggle() {
  const { currentLanguage, setLanguage } = useLanguage();
  
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" }
  ];
  
  // Find the current language object
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  // Force LTR direction regardless of language
  useEffect(() => {
    // Force LTR direction and override any automatic RTL setting
    document.documentElement.dir = "ltr";
    document.documentElement.style.direction = "ltr";
    
    // Remove any RTL classes that might be added
    document.documentElement.classList.remove('rtl');
    document.body.classList.remove('rtl');
    
    // Clean up function to ensure consistency
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.style.direction = "ltr";
    };
  }, [currentLanguage]); // Re-run when language changes
  
  const handleLanguageChange = (langCode) => {
    // Set the language but enforce LTR layout
    setLanguage(langCode);
    
    // Immediately force LTR direction
    document.documentElement.dir = "ltr";
    document.documentElement.style.direction = "ltr";
    document.documentElement.lang = langCode;
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 h-8 px-2 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{currentLang.flag}</span>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => {
          const isSelected = currentLanguage === language.code;
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isSelected ? "bg-accent/80 font-medium" : ""
              )}
            >
              <span>{language.flag}</span>
              <span className={cn(
                language.code === "ar" ? "font-arabic" : "",
                "flex-1"
              )}>
                {language.name}
              </span>
              {isSelected && (
                <span className="h-2 w-2 rounded-full bg-primary ml-auto"></span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}