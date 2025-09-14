import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Calendar, List, Grid } from 'lucide-react';
import { WeeklyScheduleView } from './WeeklyScheduleView';
import { 
  type TableFilters, 
  defaultFilters 
} from './TableFilteringSystem';
import { getSponsoredDayNames } from '../utils/sponsoredDaysConfig';

interface ExpandedWeeklyViewProps {
  onBack: () => void;
  onTableSelect: (tableId: string) => void;
  initialFilters?: TableFilters;
}

export function ExpandedWeeklyView({ 
  onBack, 
  onTableSelect, 
  initialFilters = defaultFilters 
}: ExpandedWeeklyViewProps) {
  const [filters, setFilters] = useState<TableFilters>(initialFilters);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div 
        className="bg-primary px-4 pb-4 shadow-sm flex-shrink-0"
        style={{
          paddingTop: `max(48px, calc(12px + env(safe-area-inset-top)))`
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors duration-200 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-xl text-primary-foreground">
              Next 7 Days
            </h1>
            <div className="flex items-center space-x-1 mt-1">
              <Calendar className="w-3 h-3 text-primary-foreground/80" />
              <span className="text-sm text-primary-foreground/80">
                Weekly schedule with sponsored tables
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors duration-200 min-h-[44px] min-w-[44px]"
            >
              {viewMode === 'list' ? <Grid className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div 
        className="flex-1 overflow-y-auto overscroll-behavior-y-contain"
        style={{ 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          className="px-4 py-4"
          style={{
            paddingBottom: `max(24px, env(safe-area-inset-bottom))`
          }}
        >
          {/* Info Banner */}
          <div className="bg-accent/50 border border-border rounded-lg p-4 mb-6">
            <h3 className="text-card-foreground font-medium mb-2">
              Sponsored Tables
            </h3>
            <p className="text-sm text-muted-foreground">
              Selected days ({getSponsoredDayNames().join(', ')}) feature sponsored content as the first table. These cards use custom poster backgrounds and redirect to sponsor websites when clicked.
            </p>
          </div>

          {/* Weekly Schedule */}
          <WeeklyScheduleView 
            onTableSelect={onTableSelect}
            filters={filters}
            className="space-y-6"
          />
        </div>
      </div>
    </div>
  );
}