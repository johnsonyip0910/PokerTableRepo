import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Filter, ArrowUpDown, MapPin, Users, DollarSign, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { AdBanner } from './AdBanner';
import { 
  type TableFilters, 
  type TableRecord,
  defaultFilters, 
  generateTablesForDate,
  generateDayScheduleTables,
  filterAndSortTables 
} from './TableFilteringSystem';

interface HomeScreenProps {
  onTableSelect: (tableId: string) => void;
  onDaySelect?: (date: Date, filters: TableFilters) => void;
}

type SortOption = 'distance' | 'buyinLowHigh' | 'buyinHighLow' | 'startTime';
type GameType = 'all' | 'cash' | 'tournament';
type GameVariant = 'nlh' | 'plo' | 'lhe';
type TableSize = '6max' | '9max';
type BuyinRange = 'low' | 'medium' | 'high';

const gameVariants = [
  { id: 'nlh', name: 'No Limit Hold\'em' },
  { id: 'plo', name: 'Pot Limit Omaha' },
  { id: 'lhe', name: 'Limit Hold\'em' }
];

const tableSizes = [
  { id: '6max', name: '6-Max' },
  { id: '9max', name: '9-Max' }
];

const buyinRanges = [
  { id: 'low', name: '$1 - $50' },
  { id: 'medium', name: '$50 - $200' },
  { id: 'high', name: '$200+' }
];

const sortOptions = [
  { id: 'distance', name: 'Distance (Near → Far)' },
  { id: 'buyinLowHigh', name: 'Buy-in (Low → High)' },
  { id: 'buyinHighLow', name: 'Buy-in (High → Low)' },
  { id: 'startTime', name: 'Start Time (Earliest → Latest)' }
];

// Generate next 7 days with consistent table counts using the same logic as DayScheduleScreen
const getNext7Days = (currentFilters: TableFilters) => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Use the EXACT same generation logic as DayScheduleScreen
    // Generate exactly 10 poker game cards per day (same as DayScheduleScreen)
    const tablesForDate = generateDayScheduleTables(date);
    const { visibleCount } = filterAndSortTables(tablesForDate, currentFilters);
    
    days.push({
      date: date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: i === 0,
      tables: visibleCount // This will match exactly with DayScheduleScreen
    });
  }
  
  return days;
};

export function HomeScreen({ onTableSelect, onDaySelect }: HomeScreenProps) {
  const [filters, setFilters] = useState<TableFilters>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Generate consistent day data using the shared filtering system
  const next7Days = getNext7Days(filters);
  
  const toggleGameVariant = (variant: GameVariant) => {
    setFilters(prev => ({
      ...prev,
      gameVariants: prev.gameVariants.includes(variant)
        ? prev.gameVariants.filter(v => v !== variant)
        : [...prev.gameVariants, variant]
    }));
  };

  const toggleTableSize = (size: TableSize) => {
    setFilters(prev => ({
      ...prev,
      tableSizes: prev.tableSizes.includes(size)
        ? prev.tableSizes.filter(s => s !== size)
        : [...prev.tableSizes, size]
    }));
  };

  const toggleBuyinRange = (range: BuyinRange) => {
    setFilters(prev => ({
      ...prev,
      buyinRanges: prev.buyinRanges.includes(range)
        ? prev.buyinRanges.filter(r => r !== range)
        : [...prev.buyinRanges, range]
    }));
  };

  const handleDaySelect = (day: any) => {
    if (onDaySelect) {
      // Pass the current filters so DayScheduleScreen shows the same count
      onDaySelect(day.date, filters);
    }
  };

  const currentSortOption = sortOptions.find(option => option.id === filters.sortBy);

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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg text-primary-foreground">Poker Tables</h1>
        </div>

        {/* Controls - Fixed width row with space-between layout */}
        <div className="flex items-center justify-between w-full">
          {/* Left group - Filter (hug contents, pinned left) */}
          <div className="flex items-center shrink-0">
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 min-h-[44px]"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-sm mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Filter Tables</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Customize your search by filtering tables based on game type, variants, table size, and buy-in ranges.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Game Type Toggle */}
                  <div className="space-y-3">
                    <h3 className="text-card-foreground">Game Type</h3>
                    <div className="flex space-x-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, gameType: 'all' }))}
                        className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all min-h-[44px] ${
                          filters.gameType === 'all'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, gameType: 'cash' }))}
                        className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all min-h-[44px] ${
                          filters.gameType === 'cash'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Cash
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, gameType: 'tournament' }))}
                        className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all min-h-[44px] ${
                          filters.gameType === 'tournament'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Tournament
                      </button>
                    </div>
                  </div>

                  {/* Game Variants */}
                  <div className="space-y-3">
                    <h3 className="text-card-foreground">Game Variants</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {gameVariants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => toggleGameVariant(variant.id as GameVariant)}
                          className={`p-3 rounded-lg border text-left transition-colors min-h-[44px] ${
                            filters.gameVariants.includes(variant.id as GameVariant)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:bg-accent text-card-foreground'
                          }`}
                        >
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table Sizes */}
                  <div className="space-y-3">
                    <h3 className="text-card-foreground">Table Size</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {tableSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => toggleTableSize(size.id as TableSize)}
                          className={`p-3 rounded-lg border text-center transition-colors min-h-[44px] ${
                            filters.tableSizes.includes(size.id as TableSize)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:bg-accent text-card-foreground'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buy-in Ranges */}
                  <div className="space-y-3">
                    <h3 className="text-card-foreground">Buy-in Range</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {buyinRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => toggleBuyinRange(range.id as BuyinRange)}
                          className={`p-3 rounded-lg border text-left transition-colors min-h-[44px] ${
                            filters.buyinRanges.includes(range.id as BuyinRange)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:bg-accent text-card-foreground'
                          }`}
                        >
                          {range.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Button
                    onClick={() => setFilterOpen(false)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]"
                  >
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right control - Sort dropdown (fixed width, pinned right) */}
          <div className="relative w-[128px] shrink-0">
            <Button
              onClick={() => setSortOpen(!sortOpen)}
              variant="outline"
              className="w-full bg-primary-foreground/10 border-primary-foreground/30 hover:bg-primary-foreground/20 hover:border-primary-foreground/50 active:bg-primary-foreground/30 transition-all duration-200 cursor-pointer min-h-[44px] z-10 relative"
            >
              <div className="flex items-center justify-center w-full">
                <ArrowUpDown className="w-4 h-4 mr-2 text-primary-foreground shrink-0" />
                <span className="text-white truncate">{currentSortOption?.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 ml-2 text-primary-foreground shrink-0" />
              </div>
            </Button>
            
            {/* Sort overlay menu */}
            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg min-w-[220px] max-w-[90vw] z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: option.id as SortOption }));
                      setSortOpen(false);
                    }}
                    className={`w-full cursor-pointer transition-colors duration-200 flex items-center justify-between px-3 py-2.5 first:rounded-t-lg last:rounded-b-lg min-h-[44px] ${
                      filters.sortBy === option.id
                        ? 'bg-primary text-white'
                        : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <span className="text-sm">{option.name}</span>
                    {filters.sortBy === option.id && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content with Full Height */}
      <div 
        className="flex-1 overflow-y-auto overscroll-behavior-y-contain" 
        style={{ 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* 7-Day Calendar View */}
        <div 
          className="px-4 py-4"
          style={{
            paddingBottom: `calc(68px + env(safe-area-inset-bottom) + 16px)`
          }}
        >
          <h2 className="text-card-foreground mb-3">Next 7 Days</h2>
          <div className="space-y-2">
            {next7Days.map((day, index) => (
              <Card key={index} className="bg-card border-border hover:border-chart-1 hover:shadow-lg hover:shadow-chart-1/10 transition-all duration-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => handleDaySelect(day)}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent active:bg-accent/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 text-left cursor-pointer min-h-[80px]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center ${
                        day.isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <span className="text-xs">{day.dayName}</span>
                        <span className="text-sm">{day.dayNumber}</span>
                      </div>
                      <div>
                        <h3 className="text-card-foreground">
                          {day.isToday ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {day.tables} table{day.tables !== 1 ? 's' : ''} scheduled
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}