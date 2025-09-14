import React from 'react';
import { AdBanner } from './AdBanner';

interface MapScreenProps {
  onTableSelect: (tableId: string) => void;
}

export function MapScreen({ onTableSelect }: MapScreenProps) {

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* AdBanner at very top - No spacing above, safe area handled within banner */}
      <div 
        className="flex-shrink-0"
        style={{
          paddingTop: `env(safe-area-inset-top, 0px)` // Only safe area, no extra padding
        }}
      >
        <AdBanner 
          type="header" 
          className="w-full" 
        />
      </div>

      {/* Blue Header - Directly touches bottom of ad banner */}
      <div className="bg-primary px-4 py-3 flex-shrink-0 min-h-[48px]">
        <div className="flex items-center justify-between">
          <h1 className="text-lg text-primary-foreground">Map</h1>
        </div>
      </div>

      {/* Coming Soon Content Area */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Coming Soon
          </h2>
          <p className="text-base text-muted-foreground">
            Live map will be available soon
          </p>
        </div>
      </div>
    </div>
  );
}