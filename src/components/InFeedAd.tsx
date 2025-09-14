import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface InFeedAdProps {
  className?: string;
}

interface InFeedAdData {
  id: string;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  badge?: string;
  sponsored: boolean;
}

const mockInFeedAds: InFeedAdData[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1616530221572-1bf801e5fb39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMHRvdXJuYW1lbnQlMjBjYXNpbm8lMjBjaGlwcyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTY0ODY0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'WSOP Circuit Event - $1M Guaranteed',
    description: 'Join the World Series of Poker Circuit Main Event. 3-day tournament with massive prize pool. Register now!',
    ctaText: 'Register Now',
    badge: 'Sponsored',
    sponsored: true
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMHRyYWluaW5nJTIwZWR1Y2F0aW9uJTIwb25saW5lJTIwY291cnNlfGVufDF8fHx8MTc1NjQ4NjQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'PokerStars School - Free Lessons',
    description: 'Learn from poker professionals. Free courses, strategy videos, and practice tables. Improve your game today.',
    ctaText: 'Start Learning',
    badge: 'Sponsored',
    sponsored: true
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1745473383212-59428c1156bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBwb2tlciUyMHJvb20lMjBsaWdodHMlMjBsdXh1cnl8ZW58MXx8fHwxNzU2NDg2NDkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Aria Poker Room - High Stakes Action',
    description: 'Experience luxury poker at Aria Las Vegas. Premium cash games, exclusive tournaments, and VIP treatment.',
    ctaText: 'Book Session',
    badge: 'Sponsored',
    sponsored: true
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1736988957201-ba953f060960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMGNhcmRzJTIwcm95YWwlMjBmbHVzaCUyMGNhc2lub3xlbnwxfHx8fDE3NTY0ODY0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'WPT Championship Series',
    description: 'Join the World Poker Tour Championship. Compete against the best players for life-changing prizes.',
    ctaText: 'View Schedule',
    badge: 'Sponsored',
    sponsored: true
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1616530221572-1bf801e5fb39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMHRvdXJuYW1lbnQlMjBjYXNpbm8lMjBjaGlwcyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTY0ODY0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'RunGood Poker Series',
    description: 'Premier tournament series coming to your city. Multiple events, guaranteed prize pools, and player-friendly structures.',
    ctaText: 'Find Events',
    badge: 'Sponsored',
    sponsored: true
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwb2tlciUyMHRyYWluaW5nJTIwZWR1Y2F0aW9uJTIwb25saW5lJTIwY291cnNlfGVufDF8fHx8MTc1NjQ4NjQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: 'Upswing Poker Training',
    description: 'Advanced poker strategy from top professionals. GTO solvers, hand reviews, and exclusive masterclasses.',
    ctaText: 'Try Free Trial',
    badge: 'Sponsored',
    sponsored: true
  }
];

export function InFeedAd({ className = '' }: InFeedAdProps) {
  // Randomly select an ad (in real app, this would be managed by ad server)
  const selectedAd = mockInFeedAds[Math.floor(Math.random() * mockInFeedAds.length)];

  return (
    <Card 
      className={`bg-card border-border overflow-hidden cursor-pointer ${className}`}
      onClick={() => window.open('https://www.google.com', '_blank')}
    >
      <CardContent className="p-0">
        {/* Ad Image */}
        <div className="relative h-40 overflow-hidden">
          <ImageWithFallback
            src={selectedAd.image}
            alt={selectedAd.title}
            className="w-full h-full object-cover"
          />
          
          {/* Sponsored Badge */}
          {selectedAd.sponsored && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary/90 text-primary-foreground text-xs px-2 py-1">
                {selectedAd.badge || 'Sponsored'}
              </Badge>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Ad Content */}
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1">
            {selectedAd.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {selectedAd.description}
          </p>

          {/* CTA Button */}
          <button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg font-medium text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              window.open('https://www.google.com', '_blank');
            }}
          >
            {selectedAd.ctaText}
          </button>
        </div>

        {/* Ad Disclaimer */}
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground opacity-60">
            Advertisement • Sponsored Content
          </p>
        </div>
      </CardContent>
    </Card>
  );
}