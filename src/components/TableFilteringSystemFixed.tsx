import { validateDate, formatTimeSafe, safeToISOString } from '../utils/dateValidation';

export interface TableFilters {
  gameType: 'all' | 'cash' | 'tournament';
  gameVariants: string[];
  tableSizes: string[];
  buyinRanges: string[];
  sortBy: 'distance' | 'buyinLowHigh' | 'buyinHighLow' | 'startTime';
}

export interface TableRecord {
  id: string;
  type: "cash" | "tournament";
  venue: string;
  distanceMiles: number;
  stakes: string;                 // e.g. "$1/$2 NLH" or "Tournament NLH"
  startTimeISO: string;
  // capacity / participants
  totalSeats?: number;            // cash: total seats (e.g. 9)
  seatedCount?: number;           // cash: currently seated (e.g. 6)
  playersRegistered?: number;     // tournament: registered players (e.g. 65)
  playerCap?: number;             // tournament: capacity (e.g. 144)
  // buy-in
  buyInMin?: number;              // cash min buy-in
  buyInMax?: number;              // cash max buy-in
  entry?: number;                 // tournament main buy-in (e.g. 100)
  fee?: number;                   // tournament fee (e.g. 20)
  currency: "$" | "€" | "£";
  // additional fields
  name: string;
  gameType: string;
  isSponsored: boolean;
  isLive: boolean;
  kind: 'table'; // Used to distinguish from ads - CRITICAL for counting
}

// Legacy interface for backwards compatibility
export interface TableRow {
  id: string;
  name: string;
  venue: string;
  distance: string;
  stakes: string;
  gameType: string;
  seats?: string;
  players?: string;
  buyInRange?: string;
  buyIn?: string;
  type: 'cash' | 'tournament';
  isSponsored: boolean;
  isLive: boolean;
  startTime: string;
  kind: 'table'; // Used to distinguish from ads - CRITICAL for counting
}

export interface AdRow {
  id: string;
  kind: 'ad';
  type: 'banner' | 'infeed' | 'sponsored-table-poster';
}

export interface SponsoredTablePosterData {
  id: string;
  kind: 'sponsored-table-poster';
  tableData: TableRecord;
  sponsorBackgroundImage: string;
  sponsorOverlayOpacity?: number;
}

export type Row = TableRecord | AdRow | SponsoredTablePosterData;

// Default filters
export const defaultFilters: TableFilters = {
  gameType: 'all',
  gameVariants: [],
  tableSizes: [],
  buyinRanges: [],
  sortBy: 'distance'
};

// Convert TableRecord to legacy TableRow format for display compatibility
export function tableRecordToTableRow(record: TableRecord): TableRow {
  // Safely format the start time
  let startTime = 'TBD';
  if (record.startTimeISO) {
    const validDate = validateDate(record.startTimeISO);
    if (validDate) {
      startTime = formatTimeSafe(validDate);
    } else {
      console.warn('⚠️ Invalid startTimeISO in table record:', record.id, record.startTimeISO);
    }
  }

  return {
    id: record.id,
    name: record.name,
    venue: record.venue,
    distance: `${record.distanceMiles.toFixed(1)} miles`,
    stakes: record.stakes,
    gameType: record.gameType,
    seats: record.type === 'cash' ? `${record.seatedCount}/${record.totalSeats}` : undefined,
    players: record.type === 'tournament' ? `${record.playersRegistered}/${record.playerCap}` : undefined,
    buyInRange: record.type === 'cash' ? `${record.currency}${record.buyInMin}-${record.buyInMax}` : undefined,
    buyIn: record.type === 'tournament' ? `${record.currency}${(record.entry || 0) + (record.fee || 0)}` : undefined,
    type: record.type,
    isSponsored: record.isSponsored,
    isLive: record.isLive,
    startTime,
    kind: 'table'
  };
}

// Compute visible table count (excludes ads) - CRITICAL FUNCTION
export function computeVisibleTableCount(rows: Row[], filters: TableFilters): number {
  return rows.filter(row => 
    row.kind === 'table' && matchesFilters(row as TableRecord, filters)
  ).length;
}

// Check if a table matches the current filters - MUST BE IDENTICAL LOGIC EVERYWHERE
export function matchesFilters(table: TableRecord, filters: TableFilters): boolean {
  // Game type filter
  if (filters.gameType !== 'all' && table.type !== filters.gameType) {
    return false;
  }

  // Game variant filter
  if (filters.gameVariants.length > 0) {
    const tableVariant = table.gameType.toLowerCase();
    if (!filters.gameVariants.includes(tableVariant)) {
      return false;
    }
  }

  // Table size filter (only applies to cash games)
  if (filters.tableSizes.length > 0 && table.type === 'cash' && table.totalSeats) {
    const is6Max = table.totalSeats <= 6;
    const is9Max = table.totalSeats > 6;
    
    const hasMatchingSize = filters.tableSizes.some(size => {
      if (size === '6max' && is6Max) return true;
      if (size === '9max' && is9Max) return true;
      return false;
    });
    
    if (!hasMatchingSize) {
      return false;
    }
  }

  // Buy-in range filter (only applies to cash games)
  if (filters.buyinRanges.length > 0 && table.type === 'cash' && table.buyInMin && table.buyInMax) {
    const hasMatchingRange = filters.buyinRanges.some(range => {
      switch (range) {
        case 'low': return table.buyInMax! <= 50;
        case 'medium': return table.buyInMin! >= 50 && table.buyInMax! <= 200;
        case 'high': return table.buyInMin! >= 200;
        default: return true;
      }
    });
    
    if (!hasMatchingRange) {
      return false;
    }
  }

  return true;
}

// Apply sorting to tables
export function sortTables(tables: TableRecord[], sortBy: TableFilters['sortBy']): TableRecord[] {
  const sorted = [...tables];
  
  switch (sortBy) {
    case 'distance':
      return sorted.sort((a, b) => a.distanceMiles - b.distanceMiles);
      
    case 'buyinLowHigh':
      return sorted.sort((a, b) => {
        const getBuyInMin = (table: TableRecord) => {
          if (table.type === 'cash') return table.buyInMin || 0;
          if (table.type === 'tournament') return (table.entry || 0) + (table.fee || 0);
          return 0;
        };
        return getBuyInMin(a) - getBuyInMin(b);
      });
      
    case 'buyinHighLow':
      return sorted.sort((a, b) => {
        const getBuyInMax = (table: TableRecord) => {
          if (table.type === 'cash') return table.buyInMax || 0;
          if (table.type === 'tournament') return (table.entry || 0) + (table.fee || 0);
          return 0;
        };
        return getBuyInMax(b) - getBuyInMax(a);
      });
      
    case 'startTime':
      return sorted.sort((a, b) => {
        const dateA = validateDate(a.startTimeISO);
        const dateB = validateDate(b.startTimeISO);
        
        // Handle invalid dates by putting them at the end
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return dateA.getTime() - dateB.getTime();
      });
      
    default:
      return sorted;
  }
}

// Filter and sort tables, return both filtered tables and count
export function filterAndSortTables(tables: TableRecord[], filters: TableFilters): {
  filteredTables: TableRecord[];
  visibleCount: number;
} {
  const filtered = tables.filter(table => matchesFilters(table, filters));
  const sorted = sortTables(filtered, filters.sortBy);
  
  return {
    filteredTables: sorted,
    visibleCount: filtered.length // This is the CRITICAL count that must match between screens
  };
}

// Premium sponsor data for sponsored table posters with professional poker imagery
const mockSponsorData = [
  {
    backgroundImage: 'https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwb2tlciUyMGNhcmRzJTIwY2FzaW5vJTIwcHJvZmVzc2lvbmFsJTIwdG91cm5hbWVudHxlbnwxfHx8fDE3NTY0ODYyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlayOpacity: 0.72,
    sponsorName: 'PokerStars Live',
    tagline: 'World\'s Largest Poker Site'
  },
  {
    backgroundImage: 'https://images.unsplash.com/photo-1567136445648-01b1b12734ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBjaGlwcyUyMGx1eHVyeSUyMHBva2VyJTIwdGFibGUlMjBncmVlbnxlbnwxfHx8fDE3NTY0ODYyNTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlayOpacity: 0.78,
    sponsorName: 'World Series of Poker',
    tagline: 'Official WSOP Events'
  },
  {
    backgroundImage: 'https://images.unsplash.com/photo-1674644674031-b49db824edbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwb2tlciUyMHJvb20lMjBjYXNpbm8lMjBhdG1vc3BoZXJlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NjQ4NjI2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlayOpacity: 0.75,
    sponsorName: 'RunGood Poker Series',
    tagline: 'Premier Tournament Experience'
  },
  {
    backgroundImage: 'https://images.unsplash.com/photo-1709540237814-824e053f1591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwbGF5aW5nJTIwY2FyZHMlMjBhY2UlMjBraW5nJTIwcG9rZXIlMjBoYW5kfGVufDF8fHx8MTc1NjQ4NjI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlayOpacity: 0.70,
    sponsorName: 'WPT Championship',
    tagline: 'Join the Legends'
  },
  {
    backgroundImage: 'https://images.unsplash.com/photo-1633629544357-14223c9837d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwb2tlciUyMGNoaXBzJTIwc3RhY2slMjBjYXNpbm8lMjBnYW1ibGluZ3xlbnwxfHx8fDE3NTY0ODYyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    overlayOpacity: 0.76,
    sponsorName: 'PartyPoker Live',
    tagline: 'Million Dollar Guarantees'
  }
];

// Generate rows with ads and sponsored table posters interleaved - ADS ARE NOT COUNTED IN TABLE COUNT
export function generateRowsWithAds(tables: TableRecord[]): Row[] {
  const rows: Row[] = [];
  
  tables.forEach((table, index) => {
    // Always add the table first
    rows.push(table);
    
    // Add sponsored table poster every 12 tables (looks like real table but is an ad)
    if ((index + 1) % 12 === 0 && table.isSponsored) {
      const sponsorData = mockSponsorData[index % mockSponsorData.length];
      rows.push({
        id: `sponsored-table-poster-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        kind: 'sponsored-table-poster',
        tableData: { ...table }, // Create a copy for the sponsored version
        sponsorBackgroundImage: sponsorData.backgroundImage,
        sponsorOverlayOpacity: sponsorData.overlayOpacity
      });
    }
    
    // Add regular in-feed ads every 7 tables (but these don't count toward table count)
    if ((index + 1) % 7 === 0) {
      rows.push({
        id: `ad-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        kind: 'ad',
        type: 'infeed'
      });
    }
  });
  
  return rows;
}

// Simple seeded random number generator for consistent results
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Create 7-day schedule data with exactly 10 poker game cards per day
export function generateDayScheduleTables(date: Date): TableRecord[] {
  // Validate input date first
  const validDate = validateDate(date);
  if (!validDate) {
    console.warn('⚠️ Invalid date provided to generateDayScheduleTables:', date);
    return [];
  }

  // Use date as seed for consistent generation
  const isoString = safeToISOString(validDate);
  if (!isoString) {
    console.warn('⚠️ Failed to convert date to ISO string:', validDate);
    return [];
  }
  
  const dateString = isoString.split('T')[0];
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  const rng = new SeededRandom(seed);
  
  // Realistic venue names for poker
  const venues = [
    'Royal Poker Club', 'Community Center', 'Downtown Poker Club',
    'Elite Gaming Lounge', 'Sunset Casino', 'Metropolitan Card Room',
    'Grand Tournament Hall', 'Lucky Strike Poker', 'Riverside Gaming',
    'Crown Plaza Casino', 'Golden Gate Cards', 'Diamond Poker Room'
  ];
  
  // Poker-focused game names
  const gameNames = [
    'Morning Grind', 'Lunch Break Special', 'Power Hour Cash', 'Evening Tournament',
    'Happy Hour Holdem', 'Prime Time PLO', 'Night Owl Game', 'Weekend Warrior',
    'Daily Double', 'Rush Hour Special', 'Afternoon Delight', 'Midnight Express',
    'Early Bird Special', 'Main Event Satellite', 'Bounty Hunter', 'Deep Stack Challenge'
  ];

  const tables: TableRecord[] = [];
  
  // Generate exactly 10 tables: 7 cash games (70%) + 3 tournaments (30%)
  const timeSlots = [
    { hour: 10, minute: 0 },   // 10:00 AM
    { hour: 11, minute: 30 },  // 11:30 AM  
    { hour: 13, minute: 0 },   // 1:00 PM
    { hour: 14, minute: 30 },  // 2:30 PM
    { hour: 16, minute: 0 },   // 4:00 PM
    { hour: 17, minute: 30 },  // 5:30 PM
    { hour: 19, minute: 0 },   // 7:00 PM
    { hour: 20, minute: 0 },   // 8:00 PM
    { hour: 21, minute: 30 },  // 9:30 PM
    { hour: 22, minute: 0 }    // 10:00 PM
  ];
  
  for (let i = 0; i < 10; i++) {
    const venue = venues[Math.floor(rng.next() * venues.length)];
    const timeSlot = timeSlots[i];
    
    // Create stable ID that includes date for consistency
    const uniqueId = `${dateString}-game-${i}`;
    
    // Create start time for this slot safely
    const startDateTime = new Date(validDate);
    startDateTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
    
    // Determine if tournament or cash game (70% cash, 30% tournament)
    const isTournament = i >= 7; // First 7 are cash games, last 3 are tournaments
    
    if (isTournament) {
      // Tournament data
      const tournamentEntryFees = [109, 215, 330, 530];
      const entry = tournamentEntryFees[Math.floor(rng.next() * tournamentEntryFees.length)];
      const fee = Math.floor(entry * 0.1); // 10% fee
      
      const playerCaps = [50, 100, 144, 200];
      const playerCap = playerCaps[Math.floor(rng.next() * playerCaps.length)];
      const playersRegistered = Math.floor(rng.next() * (playerCap * 0.6)) + Math.floor(playerCap * 0.2);
      
      const tournamentTypes = ['Tournament NLH', 'Deepstack NLH', 'Turbo NLH', 'Mystery Bounty', 'Progressive KO'];
      const stakes = tournamentTypes[Math.floor(rng.next() * tournamentTypes.length)];
      
      tables.push({
        id: uniqueId,
        name: gameNames[Math.floor(rng.next() * gameNames.length)],
        type: 'tournament',
        venue,
        distanceMiles: Math.round((rng.next() * 12 + 0.1) * 10) / 10,
        stakes,
        gameType: stakes.includes('PLO') ? 'PLO' : 'NLH',
        startTimeISO: safeToISOString(startDateTime) || new Date().toISOString(),
        playersRegistered,
        playerCap,
        entry,
        fee,
        currency: '$',
        isSponsored: false,
        isLive: rng.next() > 0.5,
        kind: 'table'
      });
    } else {
      // Cash game data
      const cashStakes = [
        '$1/$3 NLH', '$2/$5 NLH', '$5/$10 NLH', '$1/$2 NLH', '$3/$6 NLH',
        '$2/$5 PLO', '$5/$10 PLO', '$1/$2 PLO'
      ];
      
      const stakes = cashStakes[Math.floor(rng.next() * cashStakes.length)];
      const totalSeats = [6, 8, 9][Math.floor(rng.next() * 3)]; // 6, 8, or 9 max
      const seatedCount = Math.floor(rng.next() * (totalSeats - 1)) + 2; // 2 to (totalSeats-1)
      
      // Buy-in ranges based on stakes
      let buyInMin, buyInMax;
      if (stakes.includes('$1/$2') || stakes.includes('$1/$3')) {
        buyInMin = Math.floor(rng.next() * 50) + 50;   // $50-100
        buyInMax = Math.floor(rng.next() * 200) + 200; // $200-400
      } else if (stakes.includes('$2/$5') || stakes.includes('$3/$6')) {
        buyInMin = Math.floor(rng.next() * 150) + 100;  // $100-250
        buyInMax = Math.floor(rng.next() * 500) + 500;  // $500-1000
      } else {
        buyInMin = Math.floor(rng.next() * 300) + 200;  // $200-500
        buyInMax = Math.floor(rng.next() * 1000) + 800; // $800-1800
      }
      
      tables.push({
        id: uniqueId,
        name: gameNames[Math.floor(rng.next() * gameNames.length)],
        type: 'cash',
        venue,
        distanceMiles: Math.round((rng.next() * 12 + 0.1) * 10) / 10,
        stakes,
        gameType: stakes.includes('PLO') ? 'PLO' : 'NLH',
        startTimeISO: safeToISOString(startDateTime) || new Date().toISOString(),
        totalSeats,
        seatedCount,
        buyInMin,
        buyInMax,
        currency: '$',
        isSponsored: false,
        isLive: rng.next() > 0.3,
        kind: 'table'
      });
    }
  }
  
  return tables;
}

// Create consistent table data for a given date - MUST BE IDENTICAL EVERY TIME
export function generateTablesForDate(date: Date, count: number = 100): TableRecord[] {
  // Validate input date first
  const validDate = validateDate(date);
  if (!validDate) {
    console.warn('⚠️ Invalid date provided to generateTablesForDate:', date);
    return [];
  }

  // Use date as seed for consistent generation
  const isoString = safeToISOString(validDate);
  if (!isoString) {
    console.warn('⚠️ Failed to convert date to ISO string:', validDate);
    return [];
  }

  const dateString = isoString.split('T')[0];
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  const rng = new SeededRandom(seed);
  
  const venues = [
    'The Bicycle Casino', 'Commerce Club & Casino', 'Hollywood Park Casino', 
    'Hustler Casino', 'Hawaiian Gardens Casino', 'Crystal Casino & Hotel',
    'Normandie Casino', 'Ocean Eleven Casino', 'Playground Poker Club',
    'Rivers Casino', 'Borgata Hotel Casino', 'Bellagio Poker Room',
    'ARIA Resort & Casino', 'Venetian Poker Room', 'Wynn Las Vegas',
    'Texas Station Casino', 'Red Rock Casino Resort', 'Green Valley Ranch',
    'Hard Rock Hotel Casino', 'Foxwoods Resort Casino', 'Mohegan Sun',
    'Maryland Live! Casino', 'Live! Casino Philadelphia', 'Parx Casino',
    'SugarHouse Casino', 'Thunder Valley Casino', 'Bay 101 Casino',
    'Artichoke Joe\'s Casino', 'Lucky Chances Casino', 'Capitol Casino'
  ];
  
  const gameNames = [
    'Midnight Express', 'Main Event Qualifier', 'High Roller Special',
    'Daily Grind Cash Game', 'Tournament of Champions', 'Morning Glory',
    'Power Hour', 'Big Stack Bounty', 'Turbo Madness',
    'Satellite Supreme', 'Mystery Bounty Bonanza', 'Progressive Knockout',
    'Heads-Up Showdown', 'Six-Max Thunder', 'Mixed Game Masters',
    'Championship Circuit', 'Ladies Tournament', 'Senior Spectacular',
    'College Night Special', 'Happy Hour Hustle', 'Weekend Warrior',
    'Professional Series', 'Deep Stack Destroyer', 'Speed Demon Turbo',
    'Omaha Mayhem', 'Hold\'em Heroes', 'Poker Legends', 'Battle Royale',
    'Cash Cow Classic', 'No Limit Nightmare', 'Pot Limit Paradise',
    'Limit Lightning', 'Dealer\'s Choice Deluxe', 'All-In Adventure'
  ];

  const cashStakes = [
    '$1/$2 NLH', '$1/$3 NLH', '$2/$5 NLH', '$3/$6 NLH', '$5/$10 NLH', '$10/$20 NLH', '$25/$50 NLH',
    '$0.50/$1 NLH', '$2/$3 NLH', '$5/$5 NLH', '$10/$25 NLH', '$50/$100 NLH',
    '$1/$2 PLO', '$2/$5 PLO', '$5/$10 PLO', '$10/$20 PLO', '$25/$50 PLO',
    '$2/$4 LHE', '$4/$8 LHE', '$6/$12 LHE', '$10/$20 LHE', '$20/$40 LHE',
    '$1/$2 Mixed', '$2/$5 Mixed', '$5/$10 Mixed'
  ];
  
  const tournamentStakes = [
    'Tournament NLH', 'Deepstack NLH', 'Turbo NLH', 'Hyper Turbo NLH',
    'Satellite NLH', 'Bounty Tournament', 'Progressive KO', 'Mystery Bounty',
    'Tournament PLO', 'Deepstack PLO', 'Mixed Game Tournament',
    'Heads-Up Tournament', 'Six-Max Tournament', 'Shootout Tournament',
    'Rebuy Tournament', 'Freezeout Tournament', 'Guaranteed Tournament'
  ];
  
  const gameTypes = ['NLH', 'PLO', 'LHE', 'Mixed', 'Stud', 'Razz'];

  const tables: TableRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const isSponsored = rng.next() > 0.7;
    const isLive = rng.next() > 0.4;
    const isTournament = rng.next() > 0.6;
    const venue = venues[Math.floor(rng.next() * venues.length)];
    
    // Create stable ID that includes date for consistency
    const uniqueId = `${dateString}-${isTournament ? 'tournament' : 'cash'}-${i}`;
    
    // Generate consistent time (hours from date seed + index)
    const baseHour = (seed + i) % 12 + 6; // Hours between 6-17 (6 AM - 5 PM)
    const minutes = (i % 2) * 30; // Either :00 or :30
    
    // Create ISO time string for the given date safely
    const startDateTime = new Date(validDate);
    startDateTime.setHours(baseHour, minutes, 0, 0);
    
    if (isTournament) {
      // Tournament data with more realistic ranges
      const tournamentSizes = [
        { players: 50, cap: 90 },     // Small tournament
        { players: 120, cap: 200 },   // Medium tournament  
        { players: 350, cap: 500 },   // Large tournament
        { players: 800, cap: 1200 },  // Major tournament
        { players: 25, cap: 50 }      // Sit & Go style
      ];
      
      const sizeData = tournamentSizes[Math.floor(rng.next() * tournamentSizes.length)];
      const playersRegistered = Math.floor(rng.next() * (sizeData.players - 15)) + 15;
      const playerCap = sizeData.cap;
      
      // Entry fees based on tournament size and time
      const entryFees = [25, 50, 75, 100, 150, 200, 300, 500, 1000, 1500, 2500, 5000];
      const entry = entryFees[Math.floor(rng.next() * entryFees.length)];
      const fee = Math.floor(entry * (0.08 + rng.next() * 0.04)); // 8-12% fee
      
      tables.push({
        id: uniqueId,
        name: gameNames[Math.floor(rng.next() * gameNames.length)],
        type: 'tournament',
        venue,
        distanceMiles: Math.round((rng.next() * 8 + 0.2) * 10) / 10,
        stakes: tournamentStakes[Math.floor(rng.next() * tournamentStakes.length)],
        gameType: gameTypes[Math.floor(rng.next() * gameTypes.length)],
        startTimeISO: safeToISOString(startDateTime) || new Date().toISOString(),
        playersRegistered,
        playerCap,
        entry,
        fee,
        currency: '$',
        isSponsored,
        isLive,
        kind: 'table'
      });
    } else {
      // Cash game data with realistic buy-in ranges
      const cashGameSizes = [6, 7, 8, 9, 10]; // Table sizes
      const totalSeats = cashGameSizes[Math.floor(rng.next() * cashGameSizes.length)];
      const seatedCount = Math.max(2, Math.floor(rng.next() * (totalSeats - 1)) + 1);
      
      // Buy-in ranges based on stakes level
      const buyInRanges = [
        { min: 20, max: 100 },    // Micro stakes
        { min: 40, max: 200 },    // Low stakes
        { min: 100, max: 500 },   // Medium stakes
        { min: 200, max: 1000 },  // Higher stakes
        { min: 500, max: 2000 },  // High stakes
        { min: 1000, max: 5000 }, // Very high stakes
        { min: 2500, max: 10000 } // Nosebleed stakes
      ];
      
      const buyInData = buyInRanges[Math.floor(rng.next() * buyInRanges.length)];
      const buyInMin = buyInData.min + Math.floor(rng.next() * 50);
      const buyInMax = buyInData.max + Math.floor(rng.next() * 500);
      
      tables.push({
        id: uniqueId,
        name: gameNames[Math.floor(rng.next() * gameNames.length)],
        type: 'cash',
        venue,
        distanceMiles: Math.round((rng.next() * 8 + 0.2) * 10) / 10,
        stakes: cashStakes[Math.floor(rng.next() * cashStakes.length)],
        gameType: gameTypes[Math.floor(rng.next() * gameTypes.length)],
        startTimeISO: safeToISOString(startDateTime) || new Date().toISOString(),
        totalSeats,
        seatedCount,
        buyInMin,
        buyInMax,
        currency: '$',
        isSponsored,
        isLive,
        kind: 'table'
      });
    }
  }
  
  return tables;
}

// Legacy function for backwards compatibility
export function generateTablesForDateLegacy(date: Date, count: number = 100): TableRow[] {
  const records = generateTablesForDate(date, count);
  return records.map(tableRecordToTableRow);
}