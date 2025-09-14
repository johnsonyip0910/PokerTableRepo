import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdBannerProps {
  type?: 'header' | 'in-feed' | 'event';
  className?: string;
  isFixed?: boolean;
}

interface AdCreative {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  backgroundColor: string;
  textColor?: string;
}

const mockHeaderAds: AdCreative[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1616530221572-1bf801e5fb39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMHRvdXJuYW1lbnQlMjBjYXNpbm8lMjBjaGlwcyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTY0ODY0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'PokerStars Championship',
    subtitle: '$1M Guaranteed Main Event • Win your seat for $109',
    ctaText: 'Qualify Now',
    ctaUrl: '#',
    backgroundColor: '#1a472a',
    textColor: '#ffffff'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwb2tlciUyMHRyYWluaW5nJTIwZWR1Y2F0aW9uJTIwb25saW5lJTIwY291cnNlfGVufDF8fHx8MTc1NjQ4NjQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'GTO Wizard - Advanced Training',
    subtitle: 'Master poker theory • Free trial + solver access',
    ctaText: 'Start Free',
    ctaUrl: '#',
    backgroundColor: '#1e3a8a',
    textColor: '#ffffff'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1745473383212-59428c1156bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBwb2tlciUyMHJvb20lMjBsaWdodHMlMjBsdXh1cnl8ZW58MXx8fHwxNzU2NDg2NDkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'WSOP Paradise 2024',
    subtitle: 'Live in the Bahamas • $100K GTD Events Daily',
    ctaText: 'View Schedule',
    ctaUrl: '#',
    backgroundColor: '#7c2d12',
    textColor: '#ffffff'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1736988957201-ba953f060960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMGNhcmRzJTIwcm95YWwlMjBmbHVzaCUyMGNhc2lub3xlbnwxfHx8fDE3NTY0ODY0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'WPT World Championship',
    subtitle: '$15M Guaranteed Prize Pool • Dec 12-19 Las Vegas',
    ctaText: 'Register',
    ctaUrl: '#',
    backgroundColor: '#0f172a',
    textColor: '#ffffff'
  }
];

const mockInFeedAds: AdCreative[] = [
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwb2tlciUyMHRyYWluaW5nJTIwZWR1Y2F0aW9uJTIwb25saW5lJTIwY291cnNlfGVufDF8fHx8MTc1NjQ4NjQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Red Chip Poker Training',
    subtitle: 'From beginner to crusher • Join 50,000+ students',
    ctaText: 'Start Course',
    ctaUrl: '#',
    backgroundColor: '#dc2626',
    textColor: '#ffffff'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1736988957201-ba953f060960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNsZXJjaHwxfHhwb2tlciUyMGNhcmRzJTIwcm95YWwlMjBmbHVzaCUyMGNhc2lub3xlbnwxfHx8fDE3NTY0ODY0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Copag Premium Playing Cards',
    subtitle: '100% plastic cards used by professionals worldwide',
    ctaText: 'Shop Cards',
    ctaUrl: '#',
    backgroundColor: '#166534',
    textColor: '#ffffff'
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1745473383212-59428c1156bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBwb2tlciUyMHJvb20lMjBsaWdodHMlMjBsdXh1cnl8ZW58MXx8fHwxNzU2NDg2NDkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Bellagio Five Diamond Classic',
    subtitle: '$10,400 buy-in • Dec 16-20 • $5M guaranteed',
    ctaText: 'Register',
    ctaUrl: '#',
    backgroundColor: '#0f172a',
    textColor: '#ffffff'
  }
];

export function AdBanner({ type = 'header', className = '', isFixed = false }: AdBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  const ads = type === 'header' ? mockHeaderAds : mockInFeedAds;
  // Increased height by 15% for better visual impact - no scaling or shrinking
  const height = type === 'header' ? 'h-[92px]' : 'h-32';

  // Rotate ads every 8 seconds for header, 12 seconds for in-feed
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, type === 'header' ? 8000 : 12000);

    return () => clearInterval(interval);
  }, [ads.length, type]);

  const currentAd = ads[currentAdIndex];

  const containerClasses = `
    relative overflow-hidden rounded-t-lg shadow-sm
    ${height} w-full max-w-full flex-shrink-0
    ${isFixed ? 'fixed top-0 left-0 right-0 z-40' : ''} 
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <div 
        className="relative h-full w-full flex items-center px-4 rounded-t-lg cursor-pointer"
        style={{ 
          backgroundColor: currentAd.backgroundColor,
          paddingTop: type === 'header' ? `max(16px, env(safe-area-inset-top))` : '16px'
        }}
        onClick={() => window.open('https://www.google.com', '_blank')}
      >
        {/* Background Image - Full width scaling with center cropping, no distortion */}
        <div className="absolute inset-0 rounded-t-lg overflow-hidden">
          <ImageWithFallback
            src={currentAd.image}
            alt={currentAd.title}
            className="w-full h-full object-cover object-center"
            style={{
              minWidth: '100%',
              minHeight: '100%'
            }}
          />
          {/* Enhanced overlay for text readability */}
          <div 
            className="absolute inset-0 rounded-t-lg"
            style={{ 
              backgroundColor: currentAd.backgroundColor,
              opacity: 0.65
            }}
          />
        </div>

        {/* Content - Positioned above background with enhanced contrast */}
        <div className="relative flex-1 flex items-center justify-between z-20">
          <div className="flex-1 min-w-0">
            <h4 
              className="font-medium text-sm leading-tight truncate drop-shadow-sm"
              style={{ 
                color: currentAd.textColor || '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}
            >
              {currentAd.title}
            </h4>
            <p 
              className="text-xs mt-0.5 truncate drop-shadow-sm"
              style={{ 
                color: currentAd.textColor ? `${currentAd.textColor}E6` : 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}
            >
              {currentAd.subtitle}
            </p>
          </div>

          <button 
            className="ml-4 bg-white/25 hover:bg-white/35 text-white px-3 py-1.5 rounded-md text-xs font-medium backdrop-blur-sm border border-white/30 transition-all duration-200 flex-shrink-0 drop-shadow-sm"
            style={{ 
              color: currentAd.textColor || '#ffffff',
              borderColor: `${currentAd.textColor || '#ffffff'}4D`,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.open('https://www.google.com', '_blank');
            }}
          >
            {currentAd.ctaText}
          </button>
        </div>

        {/* Ad Indicator - Enhanced visibility */}
        <div className="absolute bottom-1 right-2 z-30">
          <span 
            className="text-xs opacity-70 drop-shadow-sm"
            style={{ 
              color: currentAd.textColor || '#ffffff',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}
          >
            Ad
          </span>
        </div>

        {/* Rotation Indicators - Enhanced visibility */}
        {ads.length > 1 && (
          <div className="absolute bottom-1 left-4 flex space-x-1 z-30">
            {ads.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-opacity drop-shadow-sm ${
                  index === currentAdIndex ? 'opacity-100' : 'opacity-50'
                }`}
                style={{ 
                  backgroundColor: currentAd.textColor || '#ffffff',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}