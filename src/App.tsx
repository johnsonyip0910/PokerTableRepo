import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { MainApp } from './components/MainApp';
import { TermsOfServiceScreen } from './components/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'auth' | 'main' | 'terms' | 'privacy'>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate splash screen loading
    const timer = setTimeout(() => {
      setCurrentScreen('auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('main');
  };

  const handleNavigateToTerms = () => {
    setCurrentScreen('terms');
  };

  const handleNavigateToPrivacy = () => {
    setCurrentScreen('privacy');
  };

  const handleBackToAuth = () => {
    setCurrentScreen('auth');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('auth');
  };

  return (
    <ThemeProvider>
      <div className="mobile-container">
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'auth' && (
          <AuthScreen 
            onLogin={handleLogin} 
            onNavigateToTerms={handleNavigateToTerms}
            onNavigateToPrivacy={handleNavigateToPrivacy}
          />
        )}
        {currentScreen === 'terms' && <TermsOfServiceScreen onBack={handleBackToAuth} />}
        {currentScreen === 'privacy' && <PrivacyPolicyScreen onBack={handleBackToAuth} />}
        {currentScreen === 'main' && <MainApp onLogout={handleLogout} />}
        <Toaster 
          position="bottom-center"
          closeButton
          richColors
          toastOptions={{
            style: {
              marginBottom: 'env(safe-area-inset-bottom, 0px)'
            }
          }}
        />
      </div>
    </ThemeProvider>
  );
}