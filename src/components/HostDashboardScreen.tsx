import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Crown, 
  Plus, 
  Calendar, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { validateDate, formatDateSafe, formatTimeSafe, safeToISOString } from '../utils/dateValidation';

interface HostDashboardScreenProps {
  onBack: () => void;
  onCreateTable: () => void;
  newTable?: any;  // New table data to add to local state
}

interface HostTable {
  id: string;
  name: string;
  gameType: string;
  stakes: string;
  buyIn: string;
  players: number;
  maxPlayers: number;
  startTime: string;
  date: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  revenue?: number;
  starts_at?: string;
}

// Backend table row structure
interface TableRow {
  id: string;
  host_id: string;
  type: 'cash' | 'tournament';
  name: string;
  game_type: string;
  table_size: string;
  min_buy_in: number;
  max_buy_in: number;
  date: string;
  time: string;
  starts_at: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  players?: number;
  maxPlayers?: number;
  stakes?: string;
  buyIn?: number;
  revenue?: number;
  // Legacy fields for backward compatibility
  gameType?: string;
  tableSize?: string;
  buyInMin?: number;
  buyInMax?: number;
  startTime?: string;
}

export function HostDashboardScreen({ onBack, onCreateTable, newTable }: HostDashboardScreenProps) {
  const [activeTables, setActiveTables] = useState<HostTable[]>([]);
  const [scheduledTables, setScheduledTables] = useState<HostTable[]>([]);
  const [historyTables, setHistoryTables] = useState<HostTable[]>([]);
  const [selectedTab, setSelectedTab] = useState<'active' | 'scheduled' | 'history'>('scheduled');
  const [isLoading, setIsLoading] = useState(true);

  // Get current tables for the selected tab
  const getCurrentTables = () => {
    switch (selectedTab) {
      case 'active':
        return activeTables;
      case 'scheduled':
        return scheduledTables;
      case 'history':
        return historyTables;
      default:
        return scheduledTables;
    }
  };

  const allTables = [...activeTables, ...scheduledTables, ...historyTables];

  // Host statistics
  const hostStats = {
    tablesHosted: allTables.length
  };

  // Transform backend table data to HostTable format with safe date handling
  const transformTable = (table: TableRow): HostTable => {
    // Safely format the start date and time
    let formattedDate = 'TBD';
    let formattedTime = 'TBD';
    
    // Try to parse from starts_at field first (ISO format)
    if (table.starts_at) {
      const validDate = validateDate(table.starts_at);
      if (validDate) {
        formattedDate = formatDateSafe(validDate, { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
        formattedTime = formatTimeSafe(validDate);
      } else {
        console.warn('Invalid starts_at date for table:', table.id, table.starts_at);
      }
    }
    // Fallback to separate date/time fields
    else if (table.date && table.time) {
      // Try to parse the separate date field
      const validDate = validateDate(table.date);
      if (validDate) {
        formattedDate = formatDateSafe(validDate, { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      }
      formattedTime = table.time || 'TBD';
    }
    // Legacy startTime field
    else if (table.startTime) {
      formattedTime = table.startTime;
    }
    // Legacy date field
    else if (table.date) {
      const validDate = validateDate(table.date);
      if (validDate) {
        formattedDate = formatDateSafe(validDate, { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      } else {
        formattedDate = table.date || 'TBD';
      }
    }

    return {
      id: table.id,
      name: table.name,
      gameType: (table.game_type || table.gameType) === 'nlh' ? 'No Limit Hold\'em' : 
               (table.game_type || table.gameType) === 'plo' ? 'Pot Limit Omaha' : 
               'Limit Hold\'em',
      stakes: table.stakes || (table.type === 'tournament' ? 'Tournament' : '$1/$2 NL'),
      buyIn: table.type === 'cash' ? `${table.min_buy_in || table.buyInMin || 0}-${table.max_buy_in || table.buyInMax || 0}` : `${table.buyIn || 0}`,
      players: table.players || 0,
      maxPlayers: table.maxPlayers || (table.table_size === '6max' ? 6 : 9),
      startTime: formattedTime,
      date: formattedDate,
      status: table.status as 'scheduled' | 'active' | 'completed' | 'cancelled',
      revenue: table.revenue,
      starts_at: table.starts_at
    };
  };

  // Fetch tables for a specific status
  const fetchTablesByStatus = async (status: 'scheduled' | 'active' | 'history') => {
    try {
      console.log(`Fetching ${status} tables from backend...`);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-488d2e05/tables/host?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        const validTables = Array.isArray(result.tables) ? result.tables.filter(table => 
          table && table.id && table.name && table.status
        ) : [];
        
        const transformedTables: HostTable[] = validTables.map(transformTable);
        
        console.log(`Fetched ${transformedTables.length} ${status} tables:`, transformedTables);
        return transformedTables;
      } else {
        console.error(`Failed to fetch ${status} tables:`, result.error);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching ${status} tables:`, error);
      return [];
    }
  };

  // Fetch all tables
  const fetchAllTables = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching all host tables...');
      
      // Fetch all status types in parallel
      const [active, scheduled, history] = await Promise.all([
        fetchTablesByStatus('active'),
        fetchTablesByStatus('scheduled'),
        fetchTablesByStatus('history')
      ]);
      
      setActiveTables(active);
      setScheduledTables(scheduled);
      setHistoryTables(history);
      
      console.log('All tables fetched:', { active: active.length, scheduled: scheduled.length, history: history.length });
    } catch (error) {
      console.error('Error fetching all tables:', error);
      setActiveTables([]);
      setScheduledTables([]);
      setHistoryTables([]);
      
      toast.error('Connection error', {
        description: 'Unable to connect to server. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load tables on component mount
  useEffect(() => {
    fetchAllTables();
  }, []);

  // Optimistically add new table when one is created
  const upsertLocalTable = (table: HostTable) => {
    console.log('Optimistically adding new table to scheduled list:', table);
    
    // Add to the scheduled list (new tables are always scheduled)
    setScheduledTables(prev => {
      // Check if table already exists to avoid duplicates
      const exists = prev.some(t => t.id === table.id);
      if (exists) {
        return prev;
      }
      // Prepend new table to scheduled list
      return [table, ...prev];
    });
    
    // Switch to scheduled tab to show the new table
    setSelectedTab('scheduled');
  };

  // Add new table when one is created
  useEffect(() => {
    if (newTable) {
      console.log('Adding new table to list:', newTable);
      
      const transformedTable = transformTable(newTable);
      upsertLocalTable(transformedTable);
      
      // Also trigger a refresh to make sure we're in sync
      setTimeout(() => {
        fetchAllTables();
      }, 1000); // Delay to allow backend to process
    }
  }, [newTable]);

  const handleCancelTable = async (tableId: string) => {
    try {
      console.log('Cancelling table:', tableId);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-488d2e05/tables/${tableId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update local state across all status lists
        const updateTableStatus = (tables: HostTable[]) => 
          tables.map(table => 
            table.id === tableId 
              ? { ...table, status: 'cancelled' as const }
              : table
          );
        
        setActiveTables(updateTableStatus);
        setScheduledTables(prev => {
          const updated = updateTableStatus(prev);
          // Move cancelled table to history
          const cancelledTable = updated.find(t => t.id === tableId);
          const remaining = updated.filter(t => t.id !== tableId);
          if (cancelledTable) {
            setHistoryTables(prev => [cancelledTable, ...prev]);
          }
          return remaining;
        });
        
        toast.success('Table cancelled successfully');
      } else {
        throw new Error(result.error || 'Failed to cancel table');
      }
    } catch (error) {
      console.error('Error cancelling table:', error);
      toast.error('Failed to cancel table', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    }
  };

  const getStatusBadge = (status: HostTable['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const filteredTables = getCurrentTables();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="bg-yellow-500 px-4 pt-12 pb-6">
        <div className="flex items-center space-x-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-yellow-900 hover:bg-yellow-400/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-900" />
            <h1 className="text-xl font-bold text-yellow-900">Host Dashboard</h1>
          </div>
        </div>

        {/* Host Stats */}
        <div className="flex justify-center">
          <div className="bg-yellow-400/20 rounded-lg p-3 text-center w-40">
            <TrendingUp className="w-5 h-5 text-yellow-900 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-900">{hostStats.tablesHosted}</div>
            <div className="text-xs text-yellow-900/80">Tables Hosted</div>
          </div>
        </div>
      </div>

      {/* Create Table Button */}
      <div className="px-4 py-4 border-b border-border">
        <Button 
          onClick={onCreateTable}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Table</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setSelectedTab('active')}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all ${
              selectedTab === 'active'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Active ({activeTables.length})
          </button>
          <button
            onClick={() => setSelectedTab('scheduled')}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all ${
              selectedTab === 'scheduled'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Scheduled ({scheduledTables.length})
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm transition-all ${
              selectedTab === 'history'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            History ({historyTables.length})
          </button>
        </div>
      </div>

      {/* Tables List */}
      <div className="flex-1 px-4 py-4 space-y-3 pb-24">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-card-foreground mb-2">Loading Tables</h3>
            <p className="text-sm text-muted-foreground">Fetching your hosted tables...</p>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-card-foreground mb-2">No Tables Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedTab === 'active' && 'You don\'t have any active tables running.'}
              {selectedTab === 'scheduled' && 'You don\'t have any scheduled tables.'}
              {selectedTab === 'history' && 'You don\'t have any completed tables yet.'}
            </p>
            {selectedTab !== 'history' && (
              <Button onClick={onCreateTable} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Table
              </Button>
            )}
          </div>
        ) : (
          filteredTables.map((table) => (
            <Card key={table.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-card-foreground">{table.name}</h3>
                      {getStatusBadge(table.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{table.gameType}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {table.status === 'active' && (
                      <Button size="sm" variant="outline" className="bg-card hover:bg-accent border-border">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                    
                    {table.status === 'scheduled' && (
                      <>
                        <Button size="sm" variant="outline" className="bg-card hover:bg-accent border-border">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-card-foreground">Cancel Table</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to cancel "{table.name}"? This action cannot be undone and players will be notified.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-card hover:bg-accent border-border">
                                Keep Table
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleCancelTable(table.id)}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                Cancel Table
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Stakes:</span>
                    <span className="text-card-foreground ml-1">{table.stakes}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Buy-in:</span>
                    <span className="text-card-foreground ml-1">{table.buyIn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Players:</span>
                    <span className="text-card-foreground ml-1">{table.players}/{table.maxPlayers}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <span className="text-card-foreground ml-1">{table.startTime}</span>
                  </div>
                </div>

                {table.status === 'active' && table.revenue && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Table Revenue:</span>
                      <span className="text-sm text-green-400 font-medium">+${table.revenue}</span>
                    </div>
                  </div>
                )}

                {table.status === 'completed' && table.revenue && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Final Revenue:</span>
                      <span className="text-sm text-green-400 font-medium">${table.revenue}</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{table.date}</span>
                    <div className="flex items-center space-x-1">
                      {table.status === 'active' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      {table.status === 'scheduled' && (
                        <Clock className="w-3 h-3 text-blue-400" />
                      )}
                      {table.status === 'completed' && (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      )}
                      {table.status === 'cancelled' && (
                        <XCircle className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}