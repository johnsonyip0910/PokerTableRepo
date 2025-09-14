import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-488d2e05/health", (c) => {
  return c.json({ status: "ok" });
});

// Create a new table
app.post("/make-server-488d2e05/tables", async (c) => {
  try {
    const tableData = await c.req.json();
    console.log('Creating table:', tableData);
    
    // Generate a unique table ID
    const tableId = `table_${Date.now()}`;
    
    // Build starts_at timestamp with proper validation
    let starts_at = null;
    
    // Check if we received a pre-combined ISO datetime (from updated frontend)
    if (tableData.starts_at) {
      // Validate the provided ISO datetime
      const testDate = new Date(tableData.starts_at);
      if (!isNaN(testDate.getTime())) {
        starts_at = testDate.toISOString();
        console.log('Using provided starts_at:', starts_at);
      } else {
        console.warn('Invalid starts_at provided:', tableData.starts_at);
      }
    }
    // Fallback to combining separate date and time fields
    else if (tableData.selectedDate && tableData.selectedTime) {
      try {
        // Parse the input date safely
        let dateStr: string;
        if (typeof tableData.selectedDate === 'string') {
          const parsed = new Date(tableData.selectedDate);
          if (!isNaN(parsed.getTime())) {
            dateStr = parsed.toISOString().split('T')[0];
          } else {
            throw new Error(`Invalid selectedDate: ${tableData.selectedDate}`);
          }
        } else if (tableData.selectedDate instanceof Date || (tableData.selectedDate && typeof tableData.selectedDate.toISOString === 'function')) {
          const parsed = new Date(tableData.selectedDate);
          if (!isNaN(parsed.getTime())) {
            dateStr = parsed.toISOString().split('T')[0];
          } else {
            throw new Error(`Invalid selectedDate object: ${tableData.selectedDate}`);
          }
        } else {
          throw new Error(`Invalid selectedDate type: ${typeof tableData.selectedDate}`);
        }
        
        // Validate time format (HH:mm)
        const timeStr = tableData.selectedTime;
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!timeRegex.test(timeStr)) {
          throw new Error(`Invalid time format: ${timeStr}`);
        }
        
        // Combine date and time into ISO string
        const dateTimeStr = `${dateStr}T${timeStr}:00.000Z`;
        const combined = new Date(dateTimeStr);
        
        if (!isNaN(combined.getTime())) {
          starts_at = combined.toISOString();
          console.log('Created starts_at:', starts_at, 'from date:', dateStr, 'time:', timeStr);
        } else {
          throw new Error(`Invalid combined datetime: ${dateTimeStr}`);
        }
      } catch (error) {
        console.error('Error parsing date/time:', error);
        return c.json({ 
          success: false, 
          error: 'Invalid date or time. Please check your inputs.' 
        }, 400);
      }
    }
    
    // Compute initial status based on date/time
    let initialStatus = 'scheduled';
    const now = new Date();
    
    if (starts_at) {
      const startsAtDate = new Date(starts_at);
      const diffMs = startsAtDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours < -6) {
        // Started more than 6 hours ago
        initialStatus = 'completed';
      } else if (diffHours <= 0) {
        // Started but within 6 hours
        initialStatus = 'active';  
      } else {
        // Starts in the future
        initialStatus = 'scheduled';
      }
    }
    
    // Prepare table data for storage
    const table = {
      id: tableId,
      host_id: 'mock_user_id', // In real app, get from auth
      name: tableData.name,
      type: tableData.type,
      game_type: tableData.gameType,
      table_size: tableData.tableSize,
      location: tableData.location,
      address: tableData.address || '',
      description: tableData.description || '',
      isPrivate: tableData.isPrivate || false,
      stakes: tableData.stakes || '',
      min_buy_in: tableData.buyInMin || 0,
      max_buy_in: tableData.buyInMax || 0,
      buyIn: tableData.buyIn || 0,
      fee: tableData.fee || 0,
      startingChips: tableData.startingChips || 0,
      minPlayers: tableData.minPlayers || 6,
      maxPlayers: tableData.maxPlayers || 9,
      players: 0,
      status: initialStatus,
      date: (() => {
        try {
          if (starts_at) {
            return new Date(starts_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric', 
              year: 'numeric'
            });
          } else if (tableData.selectedDate) {
            const parsed = new Date(tableData.selectedDate);
            if (!isNaN(parsed.getTime())) {
              return parsed.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            }
          }
          return 'TBD';
        } catch (error) {
          console.warn('Error formatting date:', error);
          return 'TBD';
        }
      })(),
      time: tableData.selectedTime || 'TBD',
      starts_at: starts_at,
      invitedPlayers: tableData.invitedPlayers || [],
      blindLevels: tableData.blindLevels || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Legacy fields for backward compatibility
      gameType: tableData.gameType,
      tableSize: tableData.tableSize,
      buyInMin: tableData.buyInMin || 0,
      buyInMax: tableData.buyInMax || 0,
      startTime: tableData.selectedTime || 'TBD'
    };
    
    // Store the table in KV store
    await kv.set(`table:${tableId}`, table);
    
    console.log('Table created successfully:', tableId);
    return c.json({ success: true, tableId, table });
  } catch (error) {
    console.error('Error creating table:', error);
    return c.json({ success: false, error: 'Failed to create table' }, 500);
  }
});

// Get tables filtered by status for host dashboard
app.get("/make-server-488d2e05/tables/host", async (c) => {
  try {
    const statusFilter = c.req.query('status');
    console.log('Fetching host tables with status filter:', statusFilter);
    
    // Get all tables from KV store
    const allTables = await kv.getByPrefix('table:');
    console.log('Raw tables data:', allTables?.length || 0, 'entries');
    
    // Handle different possible formats and filter out null values
    let tables = [];
    if (Array.isArray(allTables)) {
      tables = allTables
        .filter(item => item && item.value && item.value.id) // Filter out null/invalid entries
        .map(item => item.value)
        .filter(table => table.host_id === 'mock_user_id'); // Filter by current user (mock for now)
    }
    
    // Update table statuses based on time (status transition logic)
    const now = new Date();
    const updatedTables = [];
    
    for (const table of tables) {
      let updatedTable = { ...table };
      
      // Auto-transition tables based on their starts_at time with safe date parsing
      if (table.starts_at) {
        try {
          const startsAt = new Date(table.starts_at);
          
          // Validate the parsed date
          if (!isNaN(startsAt.getTime())) {
            const diffMs = startsAt.getTime() - now.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            
            let newStatus = table.status;
            
            // Determine correct status based on time
            if (diffHours < -6) {
              // Started more than 6 hours ago -> completed
              newStatus = 'completed';
            } else if (diffHours <= 0) {
              // Started but within 6 hours -> active
              newStatus = 'active';
            } else {
              // Starts in the future -> scheduled (only if not manually changed)
              if (table.status !== 'cancelled') {
                newStatus = 'scheduled';
              }
            }
            
            // Update if status changed
            if (newStatus !== table.status) {
              updatedTable.status = newStatus;
              updatedTable.updated_at = now.toISOString();
              // Update in KV store
              await kv.set(`table:${table.id}`, updatedTable);
              console.log(`Auto-transitioned table ${table.id} from ${table.status} to ${newStatus}`);
            }
          } else {
            console.warn(`Invalid starts_at date for table ${table.id}: ${table.starts_at}`);
          }
        } catch (error) {
          console.warn(`Error parsing starts_at for table ${table.id}:`, error, table.starts_at);
        }
      }
      
      updatedTables.push(updatedTable);
    }
    
    // Apply status filter if provided
    let filteredTables = updatedTables;
    if (statusFilter) {
      if (statusFilter === 'scheduled') {
        filteredTables = updatedTables.filter(table => table.status === 'scheduled');
      } else if (statusFilter === 'active') {
        filteredTables = updatedTables.filter(table => table.status === 'active');
      } else if (statusFilter === 'history') {
        filteredTables = updatedTables.filter(table => 
          table.status === 'completed' || table.status === 'cancelled'
        );
      }
    }
    
    // Sort tables appropriately with safe date parsing
    filteredTables.sort((a, b) => {
      try {
        if (statusFilter === 'history') {
          // History: most recent first (by starts_at desc)
          if (a.starts_at && b.starts_at) {
            const dateA = new Date(a.starts_at);
            const dateB = new Date(b.starts_at);
            
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              return dateB.getTime() - dateA.getTime();
            }
          }
        } else {
          // Active/Scheduled: earliest first (by starts_at asc)
          if (a.starts_at && b.starts_at) {
            const dateA = new Date(a.starts_at);
            const dateB = new Date(b.starts_at);
            
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              return dateA.getTime() - dateB.getTime();
            }
          }
        }
      } catch (error) {
        console.warn('Error sorting tables by date:', error);
      }
      return 0;
    });
    
    console.log(`Processed ${filteredTables.length} tables for status: ${statusFilter || 'all'}`);
    
    return c.json({ success: true, tables: filteredTables });
  } catch (error) {
    console.error('Error fetching host tables:', error);
    return c.json({ success: false, error: 'Failed to fetch tables' }, 500);
  }
});

// Get a single table
app.get("/make-server-488d2e05/tables/:id", async (c) => {
  try {
    const tableId = c.req.param('id');
    console.log('Fetching table:', tableId);
    
    const table = await kv.get(`table:${tableId}`);
    console.log('Found table:', table);
    
    if (!table) {
      return c.json({ success: false, error: 'Table not found' }, 404);
    }
    
    return c.json({ success: true, table });
  } catch (error) {
    console.error('Error fetching table:', error);
    return c.json({ success: false, error: 'Failed to fetch table' }, 500);
  }
});

// Update table status
app.put("/make-server-488d2e05/tables/:id/status", async (c) => {
  try {
    const tableId = c.req.param('id');
    const { status } = await c.req.json();
    
    console.log('Updating table status:', tableId, 'to:', status);
    
    // Get existing table
    const existingTable = await kv.get(`table:${tableId}`);
    console.log('Found existing table:', existingTable);
    
    if (!existingTable) {
      console.log('Table not found with key:', `table:${tableId}`);
      return c.json({ success: false, error: 'Table not found' }, 404);
    }
    
    // Update status
    const updatedTable = {
      ...existingTable,
      status,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Updating table with:', updatedTable);
    await kv.set(`table:${tableId}`, updatedTable);
    
    return c.json({ success: true, table: updatedTable });
  } catch (error) {
    console.error('Error updating table status:', error);
    return c.json({ success: false, error: 'Failed to update table status' }, 500);
  }
});

Deno.serve(app.fetch);