import React from 'react';
import newAppIcon from 'figma:asset/8ba4e35561244221ab4fabd187153fadf8220f4c.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '5xl';
  showText?: boolean;
  className?: string;
  forceWhiteText?: boolean;
  forceBlackText?: boolean;
}

export function Logo({ size = 'md', showText = true, className = '', forceWhiteText = false, forceBlackText = false }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-48 h-48',
    '3xl': 'w-72 h-72',
    '5xl': 'w-80 h-80'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
    '2xl': 'text-7xl',
    '3xl': 'text-8xl',
    '5xl': 'text-9xl'
  };

  const subtitleSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
    '2xl': 'text-3xl',
    '3xl': 'text-4xl',
    '5xl': 'text-6xl'
  };

  const spacingClasses = {
    sm: 'space-x-2',
    md: 'space-x-3',
    lg: 'space-x-4',
    xl: 'space-x-6',
    '2xl': 'space-x-8',
    '3xl': 'space-x-10',
    '5xl': 'space-x-16'
  };

  // Determine text color with priority: forceBlackText > forceWhiteText > text-current
  let textColorClass = 'text-current';
  if (forceBlackText) {
    textColorClass = 'text-black';
  } else if (forceWhiteText) {
    textColorClass = 'text-white';
  }

  return (
    <div className={`flex items-center ${spacingClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center flex-shrink-0`}>
        <img
          src={newAppIcon}
          alt="Poker Table App"
          className={`${sizeClasses[size]} object-contain`}
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            boxShadow: 'none',
            imageRendering: 'crisp-edges'
          }}
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold ${textColorClass} leading-tight`}>
            Poker Table
          </h1>
          <p className={`${subtitleSizeClasses[size]} ${textColorClass} opacity-80 leading-tight`}>
            Find your game
          </p>
        </div>
      )}
    </div>
  );
}