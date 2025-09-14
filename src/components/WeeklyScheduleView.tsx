import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { TableCard } from './TableCard';
import { SponsoredTablePoster } from './SponsoredTablePoster';
import { Skeleton } from './ui/skeleton';
import { Calendar } from 'lucide-react';
import { 
  type TableFilters, 
  type TableRecord,
  defaultFilters,
  generateTablesForDate,
  generateDayScheduleTables,
  filterAndSortTables 
} from './TableFilteringSystem';
import { getSponsoredConfigForDay } from '../utils/sponsoredDaysConfig';

interface WeeklyScheduleViewProps {
  onTableSelect: (tableId: string) => void;
  filters?: TableFilters;
  className?: string;
}

interface DaySection {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  tables: TableRecord[];
}

export function WeeklyScheduleView({ 
  onTableSelect, 
  filters = defaultFilters,
  className = ''
}: WeeklyScheduleViewProps) {
  const [daySections, setDaySections] = useState<DaySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWeeklyData = async () => {
      setIsLoading(true);
      
      // Generate next 7 days
      const sections: DaySection[] = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Generate exactly 10 poker game cards for this date
        const allTablesForDate = generateDayScheduleTables(date);
        const { filteredTables } = filterAndSortTables(allTablesForDate, filters);
        
        // Take only first 5 tables per day for display in weekly view
        const displayTables = filteredTables.slice(0, 5);
        
        sections.push({
          date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate(),
          isToday: i === 0,
          tables: displayTables
        });
      }
      
      setDaySections(sections);
      setIsLoading(false);
    };

    loadWeeklyData();
  }, [filters]);

  const handleTableClick = (table: TableRecord) => {
    onTableSelect(table.id);
  };

  const renderTableCard = (table: TableRecord, dayIndex: number, tableIndex: number) => {
    // Convert the first table ONLY for specified sponsored days
    const isFirstTableOfDay = tableIndex === 0;
    const dayOfWeek = daySections[dayIndex]?.date.getDay(); // 0=Sunday, 1=Monday, 2=Tuesday, etc.
    const sponsoredConfig = getSponsoredConfigForDay(dayOfWeek);
    
    if (isFirstTableOfDay && sponsoredConfig) {
      return (
        <SponsoredTablePoster
          key={`sponsored-${table.id}`}
          table={table}
          onClick={() => {
            // Redirect to sponsor URL instead of table details
            window.open('https://www.google.com', '_blank');
          }}
          onReservationClick={() => {
            // Redirect to sponsor URL
            window.open('https://www.google.com', '_blank');
          }}
          sponsorBackgroundImage={sponsoredConfig.backgroundImage}
          sponsorOverlayOpacity={sponsoredConfig.overlayOpacity}
        />
      );
    }
    
    return (
      <TableCard 
        key={table.id}
        table={table}
        onClick={() => handleTableClick(table)}
        onReservationClick={() => {
          // Handle reservation logic here
        }}
      />
    );
  };

  const renderSkeleton = () => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {Array.from({ length: 7 }, (_, dayIndex) => (
          <div key={dayIndex} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, tableIndex) => (
                <div key={tableIndex}>
                  {renderSkeleton()}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {daySections.map((daySection, dayIndex) => (
        <div key={daySection.date.toISOString()} className="space-y-3">
          {/* Day Header */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs ${
              daySection.isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              <span className="text-[10px]">{daySection.dayName}</span>
              <span className="text-[11px] font-medium">{daySection.dayNumber}</span>
            </div>
            <div>
              <h3 className="text-card-foreground font-medium">
                {daySection.isToday ? 'Today' : daySection.date.toLocaleDateString('en-US', { weekday: 'long' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {daySection.tables.length} table{daySection.tables.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
          </div>

          {/* Tables for this day */}
          {daySection.tables.length > 0 ? (
            <div className="space-y-3 ml-4 pl-6 border-l border-border">
              {daySection.tables.map((table, tableIndex) => 
                renderTableCard(table, dayIndex, tableIndex)
              )}
            </div>
          ) : (
            <div className="ml-4 pl-6 border-l border-border">
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No tables scheduled</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}