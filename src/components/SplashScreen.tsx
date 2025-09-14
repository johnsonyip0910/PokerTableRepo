import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

export function SplashScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-8">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-16">
        <Logo size="5xl" showText={false} forceBlackText={true} />
      </div>

      {/* Loading Indicator */}
      <div className="w-48 max-w-xs">
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-1 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {loadingProgress < 30 && "Loading tables..."}
            {loadingProgress >= 30 && loadingProgress < 60 && "Finding games..."}
            {loadingProgress >= 60 && loadingProgress < 90 && "Connecting..."}
            {loadingProgress >= 90 && "Ready to play!"}
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Poker Chips */}
        <div className="absolute top-20 left-8 w-4 h-4 rounded-full bg-chart-1/20 animate-pulse" 
             style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-32 right-12 w-3 h-3 rounded-full bg-chart-2/20 animate-pulse" 
             style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-40 left-16 w-5 h-5 rounded-full bg-chart-3/20 animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute bottom-24 right-8 w-2 h-2 rounded-full bg-chart-4/20 animate-pulse" 
             style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
      </div>

      {/* Version Info */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-muted-foreground">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}