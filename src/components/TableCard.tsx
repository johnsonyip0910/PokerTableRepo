import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Users, DollarSign } from 'lucide-react';
import { TableRecord } from './TableFilteringSystem';

interface TableCardProps {
  table: TableRecord;
  onClick: (table: TableRecord) => void;
  showReservationButton?: boolean;
  onReservationClick?: () => void;
  variant?: 'default' | 'hover' | 'pressed';
}

export function TableCard({ 
  table, 
  onClick, 
  showReservationButton = true, 
  onReservationClick,
  variant = 'default'
}: TableCardProps) {
  const getCardClassName = () => {
    let baseClasses = "bg-card border-border cursor-pointer transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    
    switch (variant) {
      case 'hover':
        return `${baseClasses} border-chart-1 shadow-lg shadow-chart-1/10`;
      case 'pressed':
        return `${baseClasses} scale-[0.98] border-chart-1 shadow-lg shadow-chart-1/10`;
      default:
        return `${baseClasses} hover:border-chart-1 hover:shadow-lg hover:shadow-chart-1/10 active:scale-[0.98]`;
    }
  };

  const handleCardClick = () => {
    // Pass the entire table record to onClick
    onClick(table);
  };

  // Format buy-in display consistently
  const formatBuyIn = () => {
    if (table.type === 'cash') {
      return `${table.currency}${table.buyInMin}-${table.buyInMax}`;
    } else {
      // Tournament: show total buy-in (entry + fee)
      const total = (table.entry || 0) + (table.fee || 0);
      return `${table.currency}${total}`;
    }
  };

  // Format seats/players display consistently
  const formatSeatsPlayers = () => {
    if (table.type === 'cash') {
      return `${table.seatedCount}/${table.totalSeats}`;
    } else {
      return `${table.playersRegistered}/${table.playerCap}`;
    }
  };

  // Format start time consistently
  const formatStartTime = () => {
    return new Date(table.startTimeISO).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <Card 
      className={getCardClassName()}
      onClick={handleCardClick}
    >
      <CardContent className={`p-4 ${
        table.isSponsored ? 'bg-primary/5 border-primary/30' : ''
      }`}>
        {/* Table header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-card-foreground">{table.name}</h3>
              {table.isSponsored && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  Sponsored
                </Badge>
              )}
              {table.isLive && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Live
                </Badge>
              )}
              {table.type === 'tournament' && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  Tournament
                </Badge>
              )}
              {table.type === 'cash' && (
                <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30 text-xs">
                  Cash Game
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
              <MapPin className="w-3 h-3" />
              <span>{table.venue}</span>
              <span>•</span>
              <span>{table.distanceMiles.toFixed(1)} miles</span>
            </div>
          </div>
        </div>

        {/* Table details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stakes & Game:</span>
            <span className="text-card-foreground">{table.stakes}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {table.type === 'cash' ? 'Seats:' : 'Players:'}
            </span>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-card-foreground">
                {formatSeatsPlayers()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Buy-in:</span>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-card-foreground">
                {formatBuyIn()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Start Time:</span>
            <span className="text-card-foreground">{formatStartTime()}</span>
          </div>
        </div>

        {/* Action button */}
        {showReservationButton && (
          <div className="mt-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onReservationClick?.();
              }}
            >
              Make a Reservation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}