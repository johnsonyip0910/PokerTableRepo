import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  ArrowLeft,
  Search,
  AlertTriangle,
  Home,
  MapPin
} from 'lucide-react';

interface TableNotFoundScreenProps {
  onBack: () => void;
  onGoHome: () => void;
  onBrowseTables: () => void;
  tableId?: string;
}

export function TableNotFoundScreen({ 
  onBack, 
  onGoHome, 
  onBrowseTables,
  tableId 
}: TableNotFoundScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Fixed Header with Safe Area */}
      <div 
        className="flex-shrink-0 bg-primary px-4 pb-6"
        style={{
          paddingTop: `max(48px, calc(12px + env(safe-area-inset-top)))`
        }}
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-primary-foreground">Table Not Found</h1>
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto overscroll-behavior-y-contain" 
        style={{ 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          className="px-4 py-8 space-y-6"
          style={{
            paddingBottom: `calc(68px + env(safe-area-inset-bottom) + 16px)`
          }}
        >
          {/* Error Illustration */}
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
            
            <h2 className="text-xl text-card-foreground mb-3">Table Not Found</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The poker table you're looking for is no longer available. It may have been cancelled, completed, or removed by the host.
            </p>

            {tableId && (
              <div className="bg-muted/50 rounded-lg p-3 mb-6">
                <p className="text-sm text-muted-foreground">
                  <span className="text-card-foreground">Table ID:</span> {tableId}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">What would you like to do?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={onBrowseTables}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[56px] flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Browse Available Tables</span>
              </Button>

              <Button 
                variant="outline"
                onClick={onGoHome}
                className="w-full bg-card hover:bg-accent border-border min-h-[56px] flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </Button>

              <Button 
                variant="outline"
                onClick={() => onBrowseTables()}
                className="w-full bg-card hover:bg-accent border-border min-h-[56px] flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>Explore Nearby Games</span>
              </Button>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-4">
              <h3 className="text-card-foreground mb-2">Why might this happen?</h3>
              <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                <li>• The table was cancelled by the host</li>
                <li>• The game has already completed</li>
                <li>• The table reached maximum capacity</li>
                <li>• The notification link may be outdated</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}