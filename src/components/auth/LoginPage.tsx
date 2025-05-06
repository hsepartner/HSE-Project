import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Eye, EyeOff, LogIn, Mail, ChevronRight, ChevronLeft } from "lucide-react";

// Removed framer-motion import since we're not using it anymore

interface LocationState {
  from?: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  
  // Get the path the user was trying to access
  const from = (location.state as LocationState)?.from || "/";

  // Check for stored credentials if rememberMe was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe');
    
    if (savedRememberMe === 'true' && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This is a simplified version - would typically call an API instead
      if (email === 'admin' && password === 'admin') {
        // Save to localStorage if rememberMe is checked
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('rememberMe');
        }
        
        // Store the user role (in a real app, this would come from the backend)
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('username', email);
        
        toast({
          title: isRTL ? "تم تسجيل الدخول بنجاح" : "Login Successful",
          description: isRTL ? "مرحبًا بك في شريك HSE الخاص بك!" : "Welcome to YourHSE Partner!",
        });
        
        // Directly navigate to the dashboard without setTimeout
        navigate(from === "/login" ? "/" : from, { replace: true });
        
        // Force a reload to ensure the app recognizes the auth state change
        window.location.reload();
      } else {
        toast({
          title: isRTL ? "فشل تسجيل الدخول" : "Login Failed",
          description: isRTL ? "بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى." : "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في تسجيل الدخول" : "Login Error",
        description: isRTL ? "حدث خطأ أثناء تسجيل الدخول." : "An error occurred during login.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = () => {
    // In a real app, this would initiate OAuth
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('username', 'Gmail User');
    toast({
      title: isRTL ? "تم تسجيل الدخول بنجاح عبر Google" : "Google Login Successful",
      description: isRTL ? "مرحبًا بك في شريك HSE الخاص بك!" : "Welcome to YourHSE Partner!",
    });
    
    // Directly navigate to the dashboard without setTimeout
    navigate(from === "/login" ? "/" : from, { replace: true });
    
    // Force a reload to ensure the app recognizes the auth state change
    window.location.reload();
  };

  return (
    <div 
      className={`min-h-screen flex bg-background transition-all duration-300 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/8c82d641-16a6-45c2-baf5-d1cdef4d2b67.png" 
              alt="YourHSE Partner Logo" 
              className="h-20"
            />
          </div>
          
          <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#329D4B] to-[#2A8540] bg-clip-text text-transparent pb-1">
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </CardTitle>
              <CardDescription className="text-base">
                {isRTL ? 'أدخل بيانات اعتماد لتسجيل الدخول إلى حسابك' : 'Enter your credentials to access your account'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-5 px-6">
              <form onSubmit={handleLogin}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium text-sm">
                      {isRTL ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or Username'}
                    </Label>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-all`}>
                        <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <Input
                        id="email"
                        placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-background border-2 h-11 transition-all focus:border-primary`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="font-medium text-sm">
                        {isRTL ? 'كلمة المرور' : 'Password'}
                      </Label>
                      <Button 
                        type="button" 
                        variant="link" 
                        className="p-0 h-auto text-sm font-medium hover:text-primary"
                        onClick={() => toast({
                          title: isRTL ? "وظيفة إعادة تعيين كلمة المرور" : "Password Reset",
                          description: isRTL ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني." : "Password reset link has been sent to your email."
                        })}
                      >
                        {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </Button>
                    </div>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-all`}>
                        <LogIn className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                        className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} bg-background border-2 h-11 transition-all focus:border-primary`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center transition-all`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe} 
                      onCheckedChange={() => setRememberMe(!rememberMe)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm cursor-pointer select-none"
                    >
                      {isRTL ? 'تذكرني' : 'Remember me'}
                    </Label>
                  </div>
                  
                  <div className="transition-transform hover:scale-[1.01] active:scale-[0.98]">
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-base font-medium transition-all bg-gradient-to-r from-[#329D4B] to-[#2A8540] hover:from-[#2A8540] hover:to-[#236D35]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                          {isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          {isRTL ? (
                            <>
                              تسجيل الدخول
                              <ChevronLeft className="ml-2 h-5 w-5" />
                            </>
                          ) : (
                            <>
                              Sign In
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {isRTL ? 'أو' : 'Or continue with'}
                  </span>
                </div>
              </div>
              
              <div className="transition-transform hover:scale-[1.01] active:scale-[0.98]">
                <Button 
                  variant="outline" 
                  className="w-full h-11 transition-all border-2 hover:border-[#329D4B] hover:text-[#329D4B] flex items-center justify-center gap-2" 
                  onClick={handleLoginWithGoogle}
                >
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="h-5 w-5"
                  />
                  {isRTL ? 'تسجيل الدخول باستخدام Google' : 'Sign in with Google'}
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between px-6 pb-6">
              <div className="w-full transition-transform hover:scale-[1.01] active:scale-[0.98]">
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
                  className="w-full border-2 hover:border-[#329D4B] hover:text-[#329D4B] transition-all"
                >
                  {isRTL ? (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">English</span>
                      🇺🇸
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">العربية</span>
                      🇸🇦
                    </div>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground mt-4 animate-fade-in">
            {isRTL
              ? 'للدخول كمسؤول، استخدم "admin" كاسم المستخدم وكلمة المرور'
              : 'To login as admin, use "admin" as both username and password'}
          </p>
        </div>
      </div>
      
      {/* Right side - Image/Illustration */}
      <div 
        className="hidden lg:w-1/2 lg:block bg-gradient-to-r from-[#329D4B] to-[#2A8540] relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="w-full max-w-xl text-white">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-6">
                {isRTL ? 'مرحبًا بك في شريك HSE الخاص بك' : 'Welcome to YourHSE Partner'}
              </h1>
              
              <p className="text-xl mb-10 opacity-90">
                {isRTL 
                  ? 'حلك الشامل لإدارة الصحة والسلامة والبيئة' 
                  : 'Your comprehensive solution for health, safety, and environmental management'}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start transition-transform hover:translate-x-2 rtl:hover:-translate-x-2">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {isRTL ? 'إدارة شاملة للمعدات' : 'Comprehensive Equipment Management'}
                    </h3>
                    <p className="opacity-80 mt-1">
                      {isRTL 
                        ? 'تتبع وصيانة جميع معدات السلامة الخاصة بك في مكان واحد' 
                        : 'Track and maintain all your safety equipment in one place'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start transition-transform hover:translate-x-2 rtl:hover:-translate-x-2">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {isRTL ? 'مراقبة الامتثال في الوقت الفعلي' : 'Real-time Compliance Monitoring'}
                    </h3>
                    <p className="opacity-80 mt-1">
                      {isRTL 
                        ? 'تفوق على المتطلبات التنظيمية مع التنبيهات الذكية' 
                        : 'Stay ahead of regulatory requirements with intelligent alerts'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start transition-transform hover:translate-x-2 rtl:hover:-translate-x-2">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg mr-4 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {isRTL ? 'أدوات تعاون الفريق' : 'Team Collaboration Tools'}
                    </h3>
                    <p className="opacity-80 mt-1">
                      {isRTL 
                        ? 'شارك المستندات وعيّن المهام وتتبع التقدم بكفاءة' 
                        : 'Share documents, assign tasks, and track progress efficiently'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative animated elements */}
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 animate-spin-slow">
        </div>
        
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 animate-reverse-spin">
        </div>
        
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8 animate-spin-slow">
        </div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-white bg-opacity-10 rounded-lg animate-float">
        </div>
        
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-float-delay">
        </div>
      </div>
    </div>
  );
};

export default LoginPage;