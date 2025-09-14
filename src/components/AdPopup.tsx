import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

interface AdPage {
  id: string;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

const mockAdPages: AdPage[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1616530221572-1bf801e5fb39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMHRvdXJuYW1lbnQlMjBjYXNpbm8lMjBjaGlwcyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTY0ODY0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'PokerStars $1M Guaranteed',
    description: 'Join the biggest online tournament series of the year! $200 buy-in satellites running now. Over $50M in total guarantees.',
    ctaText: 'Play Satellites',
    ctaUrl: '#'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwb2tlciUyMHRyYWluaW5nJTIwZWR1Y2F0aW9uJTIwb25saW5lJTIwY291cnNlfGVufDF8fHx8MTc1NjQ4NjQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Upswing Poker Lab',
    description: 'Master advanced poker strategy with GTO solutions, ranges, and training from top professionals. 14-day free trial included.',
    ctaText: 'Start Training',
    ctaUrl: '#'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1745473383212-59428c1156bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBwb2tlciUyMHJvb20lMjBsaWdodHMlMjBsdXh1cnl8ZW58MXx8fHwxNzU2NDg2NDkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'WPT World Championship',
    description: 'Experience the ultimate poker tournament in Las Vegas. $40,000 buy-in, $15M guaranteed prize pool. Dec 12-19, 2024.',
    ctaText: 'Register Now',
    ctaUrl: '#'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1736988957201-ba953f060960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMGNhcmRzJTIwcm95YWwlMjBmbHVzaCUyMGNhc2lub3xlbnwxfHx8fDE3NTY0ODY0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'RunGood Gear Pro Shop',
    description: 'Premium poker supplies used by professionals. Clay chips, plastic cards, custom tables, and apparel. Free shipping on orders over $100.',
    ctaText: 'Shop Now',
    ctaUrl: '#'
  }
];

export function AdPopup({ isOpen, onClose, onDismiss }: AdPopupProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const totalPages = mockAdPages.length;
  const currentAd = mockAdPages[currentPage];

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, totalPages]);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }

    setIsDragging(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-sm p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>
              Sponsored Advertisement: {currentAd?.title || 'Special Offer'}
            </DialogTitle>
            <DialogDescription>
              {currentAd?.description || 'View our special offers and promotions for poker players.'}
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
          aria-label="Close advertisement"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Carousel Container */}
        <div 
          className="relative h-96 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Advertisement carousel"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Image */}
          <div 
            className="relative h-48 overflow-hidden cursor-pointer"
            onClick={() => {
              window.open('https://www.google.com', '_blank');
              onClose();
            }}
          >
            <ImageWithFallback
              src={currentAd.image}
              alt={`${currentAd.title} advertisement`}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6 bg-card">
            <h3 className="text-xl font-bold text-card-foreground mb-3" id={`ad-title-${currentPage}`}>
              {currentAd.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6" id={`ad-description-${currentPage}`}>
              {currentAd.description}
            </p>

            {/* CTA Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
              onClick={() => {
                // Handle CTA click
                window.open('https://www.google.com', '_blank');
                onClose();
              }}
              aria-describedby={`ad-description-${currentPage}`}
            >
              {currentAd.ctaText}
            </Button>
          </div>

          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                aria-label="Previous advertisement"
                disabled={totalPages <= 1}
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                aria-label="Next advertisement"
                disabled={totalPages <= 1}
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2" 
            role="tablist" 
            aria-label="Advertisement navigation"
          >
            {mockAdPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/30'
                }`}
                role="tab"
                aria-selected={index === currentPage}
                aria-label={`Advertisement ${index + 1} of ${totalPages}: ${mockAdPages[index].title}`}
                tabIndex={index === currentPage ? 0 : -1}
              />
            ))}
          </div>
        )}

        {/* Ad Label */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/20 rounded text-white text-xs backdrop-blur-sm">
          Sponsored
        </div>

        {/* Screen reader status */}
        <VisuallyHidden>
          <div aria-live="polite" aria-atomic="true">
            Showing advertisement {currentPage + 1} of {totalPages}: {currentAd.title}
          </div>
        </VisuallyHidden>
      </DialogContent>
    </Dialog>
  );
}