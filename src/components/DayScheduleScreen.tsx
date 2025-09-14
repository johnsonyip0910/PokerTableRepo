import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { TableCard } from './TableCard';
import { SponsoredTablePoster } from './SponsoredTablePoster';
import { ArrowLeft, RefreshCw, Calendar, Filter, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  type TableFilters, 
  type TableRecord,
  type Row,
  type SponsoredTablePosterData,
  defaultFilters,
  generateTablesForDate,
  generateDayScheduleTables,
  filterAndSortTables,
  generateRowsWithAds,
  computeVisibleTableCount 
} from './TableFilteringSystem';
import { getTableByIdWithFallback } from './TableDataStore';
import { getSponsoredConfigForDay } from '../utils/sponsoredDaysConfig';

interface DayScheduleScreenProps {
  selectedDate: Date;
  initialFilters?: TableFilters;
  onBack: () => void;
  onTableSelect: (tableId: string) => void;
  onFiltersChange?: (filters: TableFilters) => void;
}

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

export function DayScheduleScreen({ 
  selectedDate, 
  initialFilters = defaultFilters, 
  onBack, 
  onTableSelect, 
  onFiltersChange 
}: DayScheduleScreenProps) {
  const [allTables, setAllTables] = useState<TableRecord[]>([]);
  const [displayRows, setDisplayRows] = useState<Row[]>([]);
  const [filters, setFilters] = useState<TableFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleTableCount, setVisibleTableCount] = useState(0);
  const pageSize = 20;
  const loadedCountRef = useRef(0);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const updateDisplayRows = (tables: TableRecord[], currentFilters: TableFilters, loadedCount: number) => {
    // Use IDENTICAL filtering logic as HomeScreen
    const { filteredTables, visibleCount } = filterAndSortTables(tables, currentFilters);
    
    // Paginate: only show the number of tables we've "loaded"
    const displayTables = filteredTables.slice(0, loadedCount);
    const rowsWithAds = generateRowsWithAds(displayTables);
    
    setDisplayRows(rowsWithAds);
    
    // CRITICAL: Set the count to total filtered tables, not just displayed ones
    // This ensures the header shows the same count as HomeScreen
    setVisibleTableCount(visibleCount);
    
    // Announce count change for accessibility
    if (typeof window !== 'undefined') {
      const message = `${visibleCount} tables scheduled`;
      // Use aria-live region for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  };

  const loadTables = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, refresh ? 800 : 1200));
    
    // Generate exactly 10 poker game cards for this day
    const generatedTables = generateDayScheduleTables(selectedDate);
    setAllTables(generatedTables);
    
    // Reset loaded count and update display
    loadedCountRef.current = pageSize;
    updateDisplayRows(generatedTables, filters, loadedCountRef.current);
    
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const loadMoreTables = async () => {
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Increase loaded count and update display
    loadedCountRef.current += pageSize;
    updateDisplayRows(allTables, filters, loadedCountRef.current);
    
    setLoadingMore(false);
  };

  const applyFilters = (newFilters: TableFilters) => {
    setFilters(newFilters);
    updateDisplayRows(allTables, newFilters, loadedCountRef.current);
    
    // Notify parent of filter changes so HomeScreen can update its counts
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  useEffect(() => {
    loadTables();
  }, [selectedDate]);

  useEffect(() => {
    if (allTables.length > 0) {
      updateDisplayRows(allTables, filters, loadedCountRef.current);
    }
  }, [filters, allTables]);

  const handleRefresh = () => {
    loadTables(true);
  };

  const handleTableClick = (table: TableRecord) => {
    console.log('Table clicked in DaySchedule:', table);
    
    // For generated tables, create fallback data in the store with complete information
    if (table.id.includes(selectedDate.toISOString().split('T')[0])) {
      console.log('Creating fallback data for generated table:', table.id);
      getTableByIdWithFallback(
        table.id, 
        table.type, 
        table.name,
        table.gameType,
        table.stakes,
        new Date(table.startTimeISO).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })
      );
    }
    
    onTableSelect(table.id);
  };

  const toggleGameVariant = (variant: string) => {
    const newFilters = {
      ...filters,
      gameVariants: filters.gameVariants.includes(variant)
        ? filters.gameVariants.filter(v => v !== variant)
        : [...filters.gameVariants, variant]
    };
    applyFilters(newFilters);
  };

  const toggleTableSize = (size: string) => {
    const newFilters = {
      ...filters,
      tableSizes: filters.tableSizes.includes(size)
        ? filters.tableSizes.filter(s => s !== size)
        : [...filters.tableSizes, size]
    };
    applyFilters(newFilters);
  };

  const toggleBuyinRange = (range: string) => {
    const newFilters = {
      ...filters,
      buyinRanges: filters.buyinRanges.includes(range)
        ? filters.buyinRanges.filter(r => r !== range)
        : [...filters.buyinRanges, range]
    };
    applyFilters(newFilters);
  };

  const renderTableCard = (row: Row, index: number) => {
    // Handle regular ads - they are NEVER counted in table count
    if (row.kind === 'ad') {
      return (
        <div key={row.id} className="bg-accent/50 border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">Sponsored Content</p>
        </div>
      );
    }

    // Handle sponsored table posters - they look like real tables but are ads
    if (row.kind === 'sponsored-table-poster') {
      const sponsoredPoster = row as SponsoredTablePosterData;
      return (
        <SponsoredTablePoster
          key={sponsoredPoster.id}
          table={sponsoredPoster.tableData}
          onClick={() => handleTableClick(sponsoredPoster.tableData)}
          onReservationClick={() => {
            // Handle sponsored table reservation (could be different logic)
            console.log('Sponsored table poster clicked:', sponsoredPoster.id);
          }}
          sponsorBackgroundImage={sponsoredPoster.sponsorBackgroundImage}
          sponsorOverlayOpacity={sponsoredPoster.sponsorOverlayOpacity}
        />
      );
    }

    // Only render table cards - check if this should be the first table (sponsored)
    const table = row as TableRecord;
    
    // Convert the very first table in the day to a sponsored table poster ONLY for specified days
    const isFirstTable = displayRows.filter(r => r.kind === 'table').indexOf(row) === 0;
    const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 1=Monday, 2=Tuesday, etc.
    const sponsoredConfig = getSponsoredConfigForDay(dayOfWeek);
    
    if (isFirstTable && sponsoredConfig) {
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

  const renderSkeleton = (index: number) => (
    <div key={`skeleton-${index}-${Date.now()}`} className="bg-card border border-border rounded-lg p-4">
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

  const currentSortOption = sortOptions.find(option => option.id === filters.sortBy);

  // Calculate how many tables are actually displayed (excluding ads)
  const displayedTableCount = displayRows.filter(row => row.kind === 'table').length;
  const canLoadMore = displayedTableCount < visibleTableCount;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Fixed Header with Safe Area */}
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
              {formatDate(selectedDate)}
            </h1>
            <div className="flex items-center space-x-1 mt-1">
              <Calendar className="w-3 h-3 text-primary-foreground/80" />
              <span className="text-sm text-primary-foreground/80">
                {visibleTableCount} table{visibleTableCount !== 1 ? 's' : ''} scheduled
              </span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors duration-200 min-h-[44px] min-w-[44px]"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center space-x-3">
          {/* Filter Button */}
          <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 min-h-[44px]"
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
                      onClick={() => applyFilters({ ...filters, gameType: 'all' })}
                      className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all min-h-[44px] ${
                        filters.gameType === 'all'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => applyFilters({ ...filters, gameType: 'cash' })}
                      className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all min-h-[44px] ${
                        filters.gameType === 'cash'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => applyFilters({ ...filters, gameType: 'tournament' })}
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
                        onClick={() => toggleGameVariant(variant.id)}
                        className={`p-3 rounded-lg border text-left transition-colors min-h-[44px] ${
                          filters.gameVariants.includes(variant.id)
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
                        onClick={() => toggleTableSize(size.id)}
                        className={`p-3 rounded-lg border text-center transition-colors min-h-[44px] ${
                          filters.tableSizes.includes(size.id)
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
                        onClick={() => toggleBuyinRange(range.id)}
                        className={`p-3 rounded-lg border text-left transition-colors min-h-[44px] ${
                          filters.buyinRanges.includes(range.id)
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

          {/* Sort Button */}
          <div className="relative">
            <Button
              onClick={() => setSortOpen(!sortOpen)}
              variant="outline"
              className="bg-primary-foreground/10 border-primary-foreground/30 hover:bg-primary-foreground/20 min-h-[44px]"
            >
              <ArrowUpDown className="w-4 h-4 mr-2 text-primary-foreground" />
              <span className="text-white">{currentSortOption?.name.split(' ')[0]}</span>
              <ChevronDown className="w-4 h-4 ml-2 text-primary-foreground" />
            </Button>
            
            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg min-w-[220px] max-w-[90vw] z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      applyFilters({ ...filters, sortBy: option.id as any });
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

      {/* Scrollable Content Area with Full Height */}
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
          {/* Pull to refresh indicator */}
          {isRefreshing && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="w-5 h-5 animate-spin text-primary mr-2" />
              <span className="text-sm text-muted-foreground">Refreshing...</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 6 }, (_, i) => renderSkeleton(i))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && visibleTableCount === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-card-foreground mb-2">No Tables Scheduled</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                No poker tables match your current filters for {formatDate(selectedDate).toLowerCase()}.
              </p>
              <Button
                onClick={() => applyFilters(defaultFilters)}
                variant="outline"
                className="bg-card hover:bg-accent border-border min-h-[44px]"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Tables List */}
          {!isLoading && visibleTableCount > 0 && (
            <div className="space-y-4">
              {displayRows.map((row, index) => renderTableCard(row, index))}
              
              {/* Load More Button - only show if there are more tables to load */}
              {canLoadMore && (
                <div className="flex justify-center py-4">
                  <Button
                    onClick={loadMoreTables}
                    disabled={loadingMore}
                    variant="outline"
                    className="bg-card hover:bg-accent border-border min-h-[44px]"
                  >
                    {loadingMore ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Loading More...
                      </>
                    ) : (
                      `Load More Tables (${displayedTableCount} of ${visibleTableCount})`
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}