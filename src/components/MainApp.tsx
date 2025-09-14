import React, { useState, useEffect } from 'react';
import { HomeScreen } from './HomeScreen';
import { MapScreen } from './MapScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { ProfileScreen } from './ProfileScreen';
import { CashTableDetailsScreen } from './CashTableDetailsScreen';
import { TournamentDetailsScreen } from './TournamentDetailsScreen';
import { CreateTableScreen } from './CreateTableScreen';
import { SettingsScreen } from './SettingsScreen';
import { ChatScreen } from './ChatScreen';
import { DayScheduleScreen } from './DayScheduleScreen';
import { HostDashboardScreen } from './HostDashboardScreen';
import { TableNotFoundScreen } from './TableNotFoundScreen';
import { AdPopup } from './AdPopup';
import { NotificationTester } from './NotificationTester';
import { getTableById, getTableByIdWithFallback, tableDataStore } from './TableDataStore';
import { type TableFilters, defaultFilters, generateTablesForDate, generateDayScheduleTables } from './TableFilteringSystem';

type Screen = 'home' | 'map' | 'notifications' | 'profile' | 'cash-table-details' | 'tournament-details' | 'create-table' | 'settings' | 'chat' | 'day-schedule' | 'host-dashboard' | 'table-not-found';

interface NavigationContext {
  previousScreen: Screen | null;
  selectedDate: Date | null;
  selectedTableId: string | null;
  filters: TableFilters;
  scrollPosition?: number;
}

interface MainAppProps {
  onLogout: () => void;
}

export function MainApp({ onLogout }: MainAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [navigationContext, setNavigationContext] = useState<NavigationContext>({
    previousScreen: null,
    selectedDate: null,
    selectedTableId: null,
    filters: defaultFilters
  });
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);
  const [hostModeEnabled, setHostModeEnabled] = useState(false);
  const [notificationTestEnabled, setNotificationTestEnabled] = useState(true);
  const [newCreatedTable, setNewCreatedTable] = useState<any>(null);

  // Show ad popup after login (simulate delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!adDismissed) {
        setShowAdPopup(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [adDismissed]);

  const handleTableSelect = (tableId: string, fromScreen?: Screen) => {
    console.log('Table selected:', tableId, 'from screen:', fromScreen);
    
    // Update navigation context
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: fromScreen || currentScreen,
      selectedTableId: tableId
    }));
    
    // First try to get table data from the static store
    let tableData = getTableById(tableId);
    
    // If not found in static store, check if it's a generated table ID
    if (!tableData && tableId.includes('-')) {
      const parts = tableId.split('-');
      
      // For generated table IDs like "2024-01-15-tournament-5", "2024-01-15-game-2", or "2024-01-15-cash-3"
      if (parts.length >= 4) {
        console.log('Processing generated table ID:', tableId, 'parts:', parts);
        
        // Generate the tables for the date to get the specific table data
        const dateString = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const date = new Date(dateString);
        
        // Try different generation methods to find the table
        // First try generateTablesForDate (used for weekly view)
        let generatedTables = generateTablesForDate(date, 100);
        let specificTable = generatedTables.find(table => table.id === tableId);
        
        // If not found, try generateDayScheduleTables (used for daily view)
        if (!specificTable) {
          const dayTables = generateDayScheduleTables(date);
          specificTable = dayTables.find(table => table.id === tableId);
          console.log('Searched in day schedule tables, found:', !!specificTable);
        }
        
        if (specificTable) {
          console.log('Found generated table:', specificTable.name, specificTable.type);
          // Create fallback data and store it temporarily
          const fallbackData = getTableByIdWithFallback(tableId, specificTable.type, specificTable.name, specificTable.gameType, specificTable.stakes);
          if (fallbackData) {
            // Store the fallback data in the store for future access
            tableDataStore[tableId] = fallbackData;
            tableData = fallbackData;
            console.log('Created and stored fallback data for:', tableId);
          }
        } else {
          console.log('Table not found in any generated tables for date:', dateString);
        }
      }
    }
    
    // Check if table exists and is valid
    if (!tableData && tableId !== 'invalid-table-id') {
      // For known invalid tables (like testing), or truly missing tables, show not found screen
      console.log('Table not found, showing error screen for ID:', tableId);
      setCurrentScreen('table-not-found');
      return;
    }
    
    // Determine screen based on table type
    if (tableData?.type === 'tournament') {
      console.log('Navigating to tournament details for:', tableData.name);
      setCurrentScreen('tournament-details');
    } else if (tableData?.type === 'cash') {
      console.log('Navigating to cash table details for:', tableData.name);
      setCurrentScreen('cash-table-details');
    } else {
      // Fallback logic for unknown table types or testing invalid tables
      console.log('Unknown/invalid table type, checking fallback logic for ID:', tableId);
      
      // Special handling for intentionally invalid table IDs (testing)
      if (tableId === 'invalid-table-id') {
        console.log('Intentionally invalid table ID - showing not found screen');
        setCurrentScreen('table-not-found');
        return;
      }
      
      if (tableId.includes('tournament') || tableId === '2') {
        console.log('Fallback: Navigating to tournament details');
        setCurrentScreen('tournament-details');
      } else {
        console.log('Fallback: Navigating to cash table details');
        setCurrentScreen('cash-table-details');
      }
    }
  };

  const handleCreateTable = () => {
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: currentScreen
    }));
    setCurrentScreen('create-table');
  };

  const handleBackNavigation = () => {
    const { previousScreen, selectedDate } = navigationContext;
    console.log('Back navigation - previous screen:', previousScreen, 'selected date:', selectedDate);
    
    // CRITICAL FIX: Always return to day-schedule if we came from there
    if (previousScreen === 'day-schedule' && selectedDate) {
      console.log('Returning to day schedule');
      setCurrentScreen('day-schedule');
    } else if (previousScreen === 'host-dashboard') {
      // Return to host dashboard
      setCurrentScreen('host-dashboard');
    } else if (previousScreen && ['home', 'map', 'notifications'].includes(previousScreen)) {
      // Return to the specific main screen
      console.log('Returning to main screen:', previousScreen);
      setCurrentScreen(previousScreen);
    } else {
      // Default to home
      console.log('Defaulting to home');
      setCurrentScreen('home');
      setNavigationContext(prev => ({
        ...prev,
        previousScreen: null,
        selectedTableId: null
      }));
    }
  };

  const handleNavigateToSettings = () => {
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: currentScreen
    }));
    setCurrentScreen('settings');
  };

  const handleNavigateToHostDashboard = () => {
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: currentScreen
    }));
    setCurrentScreen('host-dashboard');
  };

  const handleNavigateToChat = (tableId: string) => {
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: currentScreen,
      selectedTableId: tableId
    }));
    setCurrentScreen('chat');
  };

  const handleDaySelect = (date: Date, filters: TableFilters) => {
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: currentScreen,
      selectedDate: date,
      filters: filters
    }));
    setCurrentScreen('day-schedule');
  };

  const handleFiltersUpdate = (newFilters: TableFilters) => {
    setNavigationContext(prev => ({
      ...prev,
      filters: newFilters
    }));
  };

  const handleHostModeChange = (enabled: boolean) => {
    setHostModeEnabled(enabled);
  };

  const handleCloseAdPopup = () => {
    setShowAdPopup(false);
  };

  const handleDismissAdPopup = () => {
    setShowAdPopup(false);
    setAdDismissed(true);
  };

  const handleBackFromDaySchedule = () => {
    setCurrentScreen('home');
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: null,
      selectedDate: null
    }));
  };

  const handleBackFromSettings = () => {
    const { previousScreen } = navigationContext;
    if (previousScreen && previousScreen !== 'settings') {
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('profile');
    }
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: null
    }));
  };

  const handleBackFromHostDashboard = () => {
    setCurrentScreen('settings');
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: null
    }));
    // Clear new table data when leaving host dashboard
    setNewCreatedTable(null);
  };

  // Navigation handlers for notifications
  const handleNavigateToTable = (tableId: string) => {
    handleTableSelect(tableId, currentScreen);
  };

  const handleJoinTable = (tableId: string) => {
    // For join actions, we navigate to the table and simulate joining
    console.log('Joining table:', tableId);
    handleTableSelect(tableId, currentScreen);
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: null,
      selectedTableId: null
    }));
  };

  const handleBrowseTables = () => {
    setCurrentScreen('home');
    setNavigationContext(prev => ({
      ...prev,
      previousScreen: null,
      selectedTableId: null
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            onTableSelect={(tableId) => handleTableSelect(tableId, 'home')}
            onDaySelect={handleDaySelect}
          />
        );
      case 'map':
        return (
          <MapScreen 
            onTableSelect={(tableId) => handleTableSelect(tableId, 'map')}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen 
            onTableSelect={(tableId) => handleTableSelect(tableId, 'notifications')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            onNavigateToSettings={handleNavigateToSettings}
            isCurrentUserProfile={true}
          />
        );
      case 'cash-table-details':
        return (
          <CashTableDetailsScreen 
            tableId={navigationContext.selectedTableId}
            onBack={handleBackNavigation}
            onJoinChat={handleNavigateToChat}
          />
        );
      case 'tournament-details':
        return (
          <TournamentDetailsScreen 
            tableId={navigationContext.selectedTableId}
            onBack={handleBackNavigation}
            onJoinChat={handleNavigateToChat}
          />
        );
      case 'create-table':
        return (
          <CreateTableScreen 
            onBack={handleBackNavigation}
            onTableCreated={(tableId: string, table?: any) => {
              console.log('Table created, navigating back to host dashboard');
              // Store the new table data
              setNewCreatedTable(table);
              // Navigate back to host dashboard
              setCurrentScreen('host-dashboard');
            }}
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            onBack={handleBackFromSettings}
            onHostModeChange={handleHostModeChange}
            onNavigateToHostDashboard={hostModeEnabled ? handleNavigateToHostDashboard : undefined}
            onLogout={onLogout}
          />
        );
      case 'host-dashboard':
        return (
          <HostDashboardScreen 
            onBack={handleBackFromHostDashboard}
            onCreateTable={handleCreateTable}
            newTable={newCreatedTable}
          />
        );
      case 'chat':
        return (
          <ChatScreen 
            tableId={navigationContext.selectedTableId}
            onBack={() => {
              // Return to the correct details screen based on table type
              const tableData = getTableById(navigationContext.selectedTableId || '');
              if (tableData?.type === 'tournament') {
                setCurrentScreen('tournament-details');
              } else {
                setCurrentScreen('cash-table-details');
              }
            }}
          />
        );
      case 'day-schedule':
        return (
          <DayScheduleScreen 
            selectedDate={navigationContext.selectedDate!}
            initialFilters={navigationContext.filters}
            onBack={handleBackFromDaySchedule}
            onTableSelect={(tableId) => handleTableSelect(tableId, 'day-schedule')}
            onFiltersChange={handleFiltersUpdate}
          />
        );
      case 'table-not-found':
        return (
          <TableNotFoundScreen 
            tableId={navigationContext.selectedTableId || undefined}
            onBack={handleBackNavigation}
            onGoHome={handleGoHome}
            onBrowseTables={handleBrowseTables}
          />
        );
      default:
        return (
          <HomeScreen 
            onTableSelect={(tableId) => handleTableSelect(tableId, 'home')}
            onDaySelect={handleDaySelect}
          />
        );
    }
  };

  const showBottomTabs = ['home', 'map', 'notifications', 'profile'].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderScreen()}
      </div>

      {/* Ad Popup Modal */}
      <AdPopup 
        isOpen={showAdPopup}
        onClose={handleCloseAdPopup}
        onDismiss={handleDismissAdPopup}
      />

      {/* Notification Tester */}
      <NotificationTester 
        enabled={notificationTestEnabled}
        onNavigateToTable={handleNavigateToTable}
        onJoinTable={handleJoinTable}
        onNavigateToHome={handleGoHome}
      />

      {/* Bottom Navigation (only on main screens) */}
      {showBottomTabs && (
        <div 
          className="bg-card border-t border-border z-50"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: `env(safe-area-inset-bottom)`
          }}
        >
          <div className="flex items-center justify-around py-3 max-w-md mx-auto">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors min-h-[44px] min-w-[44px] ${
                currentScreen === 'home' 
                  ? 'text-chart-1 bg-chart-1/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs">Home</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('map')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors min-h-[44px] min-w-[44px] ${
                currentScreen === 'map' 
                  ? 'text-chart-1 bg-chart-1/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5z"/>
              </svg>
              <span className="text-xs">Map</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('notifications')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors relative min-h-[44px] min-w-[44px] ${
                currentScreen === 'notifications' 
                  ? 'text-chart-1 bg-chart-1/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <span className="text-xs">Alerts</span>
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
            </button>

            <button 
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors min-h-[44px] min-w-[44px] ${
                currentScreen === 'profile' 
                  ? 'text-chart-1 bg-chart-1/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="text-xs">Profile</span>
              {/* Host Mode Indicator */}
              {hostModeEnabled && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}