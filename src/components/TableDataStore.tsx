import { TableRecord } from './TableFilteringSystem';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  isOnline: boolean;
  joinTime?: string;
  registrationTime?: string;
}

export interface ExtendedTableDetails {
  // Base TableRecord fields
  id: string;
  name: string;
  type: 'cash' | 'tournament';
  venue: string;
  distanceMiles: number;
  stakes: string;
  startTimeISO: string;
  totalSeats?: number;
  seatedCount?: number;
  playersRegistered?: number;
  playerCap?: number;
  buyInMin?: number;
  buyInMax?: number;
  entry?: number;
  fee?: number;
  currency: "$" | "€" | "£";
  gameType: string;
  isSponsored: boolean;
  isLive: boolean;
  
  // Extended details for screens
  gameTypeFull: string;
  location: string;
  address: string;
  distance: number;
  rating: number;
  description: string;
  players: Player[];
  
  // Cash game specific
  rules?: string[];
  
  // Tournament specific
  seatsAvailable?: number;
  duration?: string;
  schedule?: {
    startTime: string;
    expectedDuration: string;
    registrationDeadline: string;
    buyIn: string;
  };
  structure?: {
    levelDuration: string;
    timeBank: string;
    blindLevels: Array<{
      level: number;
      smallBlind: number;
      bigBlind: number;
      ante?: number;
    }>;
  };
}

export type CashTableDetails = ExtendedTableDetails & { type: 'cash'; rules: string[] };
export type TournamentDetails = ExtendedTableDetails & { 
  type: 'tournament'; 
  duration: string;
  schedule: NonNullable<ExtendedTableDetails['schedule']>;
  structure: NonNullable<ExtendedTableDetails['structure']>;
};

export type TableDetails = CashTableDetails | TournamentDetails;

// Comprehensive table data store with realistic poker games
export const tableDataStore: Record<string, ExtendedTableDetails> = {
  // Cash Games
  '1': {
    id: '1',
    name: 'Midnight Express',
    type: 'cash',
    gameType: 'NLH',
    gameTypeFull: 'No Limit Hold\'em',
    stakes: '$2/$5 NLH',
    venue: 'The Bicycle Casino',
    location: 'The Bicycle Casino',
    address: '7301 Eastern Ave, Bell Gardens, CA',
    distanceMiles: 0.8,
    distance: 0.8,
    totalSeats: 9,
    seatedCount: 7,
    buyInMin: 200,
    buyInMax: 1000,
    currency: '$',
    isLive: true,
    isSponsored: false,
    startTimeISO: new Date().toISOString(),
    rating: 4.7,
    description: 'Late night action with mixed stakes players. This table sees regular action from 10 PM to 6 AM with experienced dealers and comfortable atmosphere. Perfect for night owls looking for solid poker action.',
    rules: [
      'No electronic devices during hands',
      'English only at the table',
      'One player per hand strictly enforced',
      'String betting prohibited',
      'Minimum 4-hour session commitment',
      'Professional conduct required'
    ],
    players: [
      { id: '1', name: 'Jennifer Chang', avatar: 'JC', rating: 4.6, isOnline: true, joinTime: '10:30 PM' },
      { id: '2', name: 'Marcus Williams', avatar: 'MW', rating: 4.3, isOnline: true, joinTime: '11:15 PM' },
      { id: '3', name: 'David Liu', avatar: 'DL', rating: 4.8, isOnline: false, joinTime: '11:45 PM' },
      { id: '4', name: 'Rachel Martinez', avatar: 'RM', rating: 4.2, isOnline: true, joinTime: '12:00 AM' }
    ]
  },

  '3': {
    id: '3',
    name: 'Omaha Mayhem',
    type: 'cash',
    gameType: 'PLO',
    gameTypeFull: 'Pot Limit Omaha',
    stakes: '$10/$20 PLO',
    venue: 'Commerce Club & Casino',
    location: 'Commerce Club & Casino',
    address: '6131 Telegraph Rd, Commerce, CA',
    distanceMiles: 1.4,
    distance: 1.4,
    totalSeats: 8,
    seatedCount: 6,
    buyInMin: 2000,
    buyInMax: 8000,
    currency: '$',
    isLive: true,
    isSponsored: false,
    startTimeISO: new Date().toISOString(),
    rating: 4.9,
    description: 'Premium PLO action with deep stacks and aggressive play. This game attracts serious professionals and high-stakes players. Excellent service with dedicated dealers and floor management.',
    rules: [
      'Minimum buy-in strictly enforced at $2000',
      'No insurance or side bets allowed',
      'English only communication',
      'Professional conduct mandatory',
      'No coaching or advice during hands',
      '30-second shot clock on difficult decisions'
    ],
    players: [
      { id: '11', name: 'Antonio Silva', avatar: 'AS', rating: 4.9, isOnline: true, joinTime: '3:00 PM' },
      { id: '12', name: 'Natasha Volkov', avatar: 'NV', rating: 4.8, isOnline: true, joinTime: '3:30 PM' },
      { id: '13', name: 'Kevin Park', avatar: 'KP', rating: 4.7, isOnline: false, joinTime: '4:15 PM' }
    ]
  },

  '4': {
    id: '4',
    name: 'Daily Grind Cash Game',
    type: 'cash',
    gameType: 'NLH',
    gameTypeFull: 'No Limit Hold\'em',
    stakes: '$1/$3 NLH',
    venue: 'Hollywood Park Casino',
    location: 'Hollywood Park Casino',
    address: '3883 W Century Blvd, Inglewood, CA',
    distanceMiles: 2.3,
    distance: 2.3,
    totalSeats: 10,
    seatedCount: 8,
    buyInMin: 100,
    buyInMax: 500,
    currency: '$',
    isLive: true,
    isSponsored: false,
    startTimeISO: new Date().toISOString(),
    rating: 4.4,
    description: 'Friendly daily cash game perfect for players of all skill levels. Regular game with familiar faces and welcoming atmosphere. Great for beginners and intermediate players looking to improve.',
    rules: [
      'Respectful table talk encouraged',
      'No aggressive behavior tolerated',
      'Dealers rotate every 30 minutes',
      'Food and drinks allowed at table',
      'Minimum 2-hour session recommended',
      'Proper poker etiquette expected'
    ],
    players: [
      { id: '21', name: 'Tommy Chen', avatar: 'TC', rating: 4.1, isOnline: true, joinTime: '1:00 PM' },
      { id: '22', name: 'Lisa Thompson', avatar: 'LT', rating: 4.3, isOnline: true, joinTime: '1:30 PM' },
      { id: '23', name: 'Robert Kim', avatar: 'RK', rating: 4.5, isOnline: true, joinTime: '2:00 PM' },
      { id: '24', name: 'Amanda Foster', avatar: 'AF', rating: 4.0, isOnline: false, joinTime: '2:15 PM' }
    ]
  },

  // Tournaments
  '2': {
    id: '2',
    name: 'Championship Circuit Main Event',
    type: 'tournament',
    gameType: 'NLH',
    gameTypeFull: 'No Limit Hold\'em',
    stakes: 'Deepstack NLH',
    venue: 'Hustler Casino',
    location: 'Hustler Casino',
    address: '1000 W Redondo Beach Blvd, Gardena, CA',
    distanceMiles: 1.7,
    distance: 1.7,
    playerCap: 500,
    playersRegistered: 347,
    seatsAvailable: 153,
    entry: 1500,
    fee: 150,
    currency: '$',
    startTimeISO: new Date().toISOString(),
    duration: '8-12 hours',
    isLive: false,
    isSponsored: false,
    rating: 4.9,
    description: 'Premier tournament featuring $500K guaranteed prize pool. This championship event attracts top professionals and serious players from across the region. Deep stack structure with excellent support staff.',
    players: [
      { id: '31', name: 'Alexandra Rodriguez', avatar: 'AR', rating: 4.7, isOnline: true, registrationTime: '11:00 AM' },
      { id: '32', name: 'Michael Johnson', avatar: 'MJ', rating: 4.5, isOnline: true, registrationTime: '11:30 AM' },
      { id: '33', name: 'Chen Wei', avatar: 'CW', rating: 4.8, isOnline: false, registrationTime: '12:00 PM' },
      { id: '34', name: 'Emma Wilson', avatar: 'EW', rating: 4.4, isOnline: true, registrationTime: '12:15 PM' },
      { id: '35', name: 'James Rodriguez', avatar: 'JR', rating: 4.6, isOnline: true, registrationTime: '12:30 PM' }
    ],
    schedule: {
      startTime: 'Saturday 2:00 PM PST',
      expectedDuration: '8-12 hours',
      registrationDeadline: 'Saturday 1:45 PM PST',
      buyIn: '$1,650'
    },
    structure: {
      levelDuration: '40 minutes',
      timeBank: '60 seconds per difficult decision',
      blindLevels: [
        { level: 1, smallBlind: 100, bigBlind: 200 },
        { level: 2, smallBlind: 150, bigBlind: 300 },
        { level: 3, smallBlind: 200, bigBlind: 400 },
        { level: 4, smallBlind: 250, bigBlind: 500, ante: 50 },
        { level: 5, smallBlind: 300, bigBlind: 600, ante: 75 },
        { level: 6, smallBlind: 400, bigBlind: 800, ante: 100 },
        { level: 7, smallBlind: 500, bigBlind: 1000, ante: 100 },
        { level: 8, smallBlind: 600, bigBlind: 1200, ante: 150 }
      ]
    }
  },

  '5': {
    id: '5',
    name: 'Bounty Hunter Tournament',
    type: 'tournament',
    gameType: 'NLH',
    gameTypeFull: 'No Limit Hold\'em',
    stakes: 'Progressive KO',
    venue: 'Hawaiian Gardens Casino',
    location: 'Hawaiian Gardens Casino',
    address: '21500 S Vermont Ave, Hawaiian Gardens, CA',
    distanceMiles: 3.2,
    distance: 3.2,
    playerCap: 200,
    playersRegistered: 156,
    seatsAvailable: 44,
    entry: 300,
    fee: 50,
    currency: '$',
    startTimeISO: new Date().toISOString(),
    duration: '6-8 hours',
    isLive: false,
    isSponsored: false,
    rating: 4.6,
    description: 'Exciting progressive knockout tournament where bounties increase with each elimination. Fast-paced action with immediate cash rewards for eliminations. Perfect format for aggressive players.',
    players: [
      { id: '41', name: 'Daniel Torres', avatar: 'DT', rating: 4.5, isOnline: true, registrationTime: '5:00 PM' },
      { id: '42', name: 'Sofia Petrova', avatar: 'SP', rating: 4.7, isOnline: true, registrationTime: '5:15 PM' },
      { id: '43', name: 'Carlos Mendez', avatar: 'CM', rating: 4.3, isOnline: false, registrationTime: '5:30 PM' },
      { id: '44', name: 'Grace Kim', avatar: 'GK', rating: 4.4, isOnline: true, registrationTime: '5:45 PM' }
    ],
    schedule: {
      startTime: 'Friday 7:00 PM PST',
      expectedDuration: '6-8 hours',
      registrationDeadline: 'Friday 6:45 PM PST',
      buyIn: '$350'
    },
    structure: {
      levelDuration: '25 minutes',
      timeBank: '45 seconds per decision',
      blindLevels: [
        { level: 1, smallBlind: 25, bigBlind: 50 },
        { level: 2, smallBlind: 50, bigBlind: 100 },
        { level: 3, smallBlind: 75, bigBlind: 150 },
        { level: 4, smallBlind: 100, bigBlind: 200, ante: 25 },
        { level: 5, smallBlind: 150, bigBlind: 300, ante: 50 },
        { level: 6, smallBlind: 200, bigBlind: 400, ante: 50 },
        { level: 7, smallBlind: 300, bigBlind: 600, ante: 75 }
      ]
    }
  }
};

// Convert TableRecord to ExtendedTableDetails with fallback data
export function createExtendedTableDetails(record: TableRecord): ExtendedTableDetails {
  const baseDetails: ExtendedTableDetails = {
    // Copy all TableRecord fields
    ...record,
    
    // Add extended fields with defaults
    gameTypeFull: getGameTypeFull(record.gameType),
    location: record.venue,
    address: getRealisticAddress(record.venue),
    distance: record.distanceMiles,
    rating: Math.round((3.8 + Math.random() * 1.0) * 10) / 10, // 3.8 - 4.8 range
    description: record.type === 'cash' 
      ? generateCashGameDescription(record)
      : generateTournamentDescription(record),
    players: generatePlayers(record.type)
  };

  if (record.type === 'cash') {
    baseDetails.rules = generateCashGameRules();
  } else {
    baseDetails.seatsAvailable = (record.playerCap || 100) - (record.playersRegistered || 0);
    baseDetails.duration = getTournamentDuration(record.entry || 50);
    baseDetails.schedule = {
      startTime: new Date(record.startTimeISO).toLocaleDateString('en-US', { 
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) + ' PST',
      expectedDuration: getTournamentDuration(record.entry || 50),
      registrationDeadline: getRegistrationDeadline(record.startTimeISO),
      buyIn: `${record.currency}${(record.entry || 0) + (record.fee || 0)}`
    };
    baseDetails.structure = generateTournamentStructure(record.entry || 50);
  }

  return baseDetails;
}

function getGameTypeFull(gameType: string): string {
  switch (gameType.toUpperCase()) {
    case 'NLH': return 'No Limit Hold\'em';
    case 'PLO': return 'Pot Limit Omaha';
    case 'LHE': return 'Limit Hold\'em';
    case 'MIXED': return 'Mixed Games';
    case 'STUD': return '7-Card Stud';
    case 'RAZZ': return 'Razz';
    default: return gameType;
  }
}

function getRealisticAddress(venue: string): string {
  const addresses = {
    'The Bicycle Casino': '7301 Eastern Ave, Bell Gardens, CA 90201',
    'Commerce Club & Casino': '6131 Telegraph Rd, Commerce, CA 90040',
    'Hollywood Park Casino': '3883 W Century Blvd, Inglewood, CA 90303',
    'Hustler Casino': '1000 W Redondo Beach Blvd, Gardena, CA 90247',
    'Hawaiian Gardens Casino': '21500 S Vermont Ave, Hawaiian Gardens, CA 90716',
    'Crystal Casino & Hotel': '123 E Artesia Blvd, Compton, CA 90220',
    'Normandie Casino': '1045 W Redondo Beach Blvd, Gardena, CA 90247',
    'Ocean Eleven Casino': '888 S Normandie Ave, Los Angeles, CA 90006'
  };
  return addresses[venue as keyof typeof addresses] || `${Math.floor(Math.random() * 9999)} Poker St, Los Angeles, CA`;
}

function generateCashGameDescription(record: TableRecord): string {
  const descriptions = [
    'Action-packed cash game with skilled players and friendly atmosphere. Professional dealers ensure smooth gameplay.',
    'Regular game with mixed skill levels. Great opportunity to improve your poker skills in a comfortable environment.',
    'High-quality cash game featuring experienced players. Excellent service and competitive action throughout the session.',
    'Premium poker experience with dedicated staff. Popular among both recreational and professional players.',
    'Well-established game known for its integrity and fair play. Attracts serious poker enthusiasts.'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateTournamentDescription(record: TableRecord): string {
  const prizePool = ((record.entry || 50) * (record.playersRegistered || 50) * 0.9).toLocaleString();
  const descriptions = [
    `Exciting tournament with $${prizePool} total prize pool. Professional structure and experienced tournament staff.`,
    `Competitive tournament featuring skilled players from the region. Excellent organization and fair play guaranteed.`,
    `Premier poker tournament with deep stack play. Attracts both recreational and professional players.`,
    `Well-structured tournament with generous blind levels. Perfect for players looking for serious competition.`,
    `Professional tournament series event. High-quality experience with dedicated tournament directors.`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateCashGameRules(): string[] {
  const allRules = [
    'English only at the table',
    'Players must act in turn',
    'No string bets allowed',
    'Proper poker etiquette required',
    'No electronic devices during hands',
    'One player per hand rule enforced',
    'Minimum session commitment applies',
    'Professional conduct expected',
    'No coaching during hands',
    'Dealers rotate every 30-45 minutes'
  ];
  
  // Return 4-6 random rules
  const ruleCount = Math.floor(Math.random() * 3) + 4;
  return allRules.sort(() => Math.random() - 0.5).slice(0, ruleCount);
}

function getTournamentDuration(entry: number): string {
  if (entry >= 1000) return '10-14 hours';
  if (entry >= 500) return '8-12 hours';
  if (entry >= 200) return '6-10 hours';
  if (entry >= 100) return '5-8 hours';
  return '4-6 hours';
}

function getRegistrationDeadline(startTimeISO: string): string {
  const startTime = new Date(startTimeISO);
  const deadline = new Date(startTime.getTime() - 15 * 60 * 1000); // 15 minutes before
  return deadline.toLocaleDateString('en-US', { 
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }) + ' PST';
}

function generateTournamentStructure(entry: number) {
  const levelDuration = entry >= 500 ? '40 minutes' : entry >= 200 ? '30 minutes' : '20 minutes';
  const timeBank = entry >= 500 ? '60 seconds' : '45 seconds';
  
  return {
    levelDuration,
    timeBank: `${timeBank} per decision`,
    blindLevels: [
      { level: 1, smallBlind: 25, bigBlind: 50 },
      { level: 2, smallBlind: 50, bigBlind: 100 },
      { level: 3, smallBlind: 75, bigBlind: 150 },
      { level: 4, smallBlind: 100, bigBlind: 200, ante: 25 },
      { level: 5, smallBlind: 150, bigBlind: 300, ante: 50 },
      { level: 6, smallBlind: 200, bigBlind: 400, ante: 50 },
      { level: 7, smallBlind: 300, bigBlind: 600, ante: 75 },
      { level: 8, smallBlind: 400, bigBlind: 800, ante: 100 }
    ]
  };
}

function generatePlayers(type: 'cash' | 'tournament'): Player[] {
  const names = [
    'Alexandra Chen', 'Marcus Rodriguez', 'Sophia Petrov', 'James Kim', 'Isabella Martinez',
    'Connor O\'Brien', 'Priya Patel', 'Ethan Williams', 'Zoe Thompson', 'Gabriel Silva',
    'Maya Singh', 'Lucas Foster', 'Aria Nakamura', 'Diego Gonzalez', 'Nora Zhang',
    'Kai Anderson', 'Layla Hassan', 'Owen Murphy', 'Chloe Johnson', 'Finn O\'Connor',
    'Luna Park', 'Jaxon Davis', 'Ivy Chang', 'River Smith', 'Nova Brown',
    'Tyler Brooks', 'Sage Wilson', 'Phoenix Lee', 'Aspen Taylor', 'Ryder Jones'
  ];
  
  const shuffledNames = names.sort(() => Math.random() - 0.5);
  const playerCount = type === 'cash' ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 4) + 4;
  
  return shuffledNames.slice(0, playerCount).map((name, i) => ({
    id: `${i + 1}`,
    name,
    avatar: name.split(' ').map(n => n[0]).join(''),
    rating: Math.round((3.5 + Math.random() * 1.3) * 10) / 10, // 3.5 - 4.8 rating range
    isOnline: Math.random() > 0.25,
    [type === 'cash' ? 'joinTime' : 'registrationTime']: 
      type === 'cash' 
        ? `${Math.floor(Math.random() * 4) + 6}:${Math.random() > 0.5 ? '00' : '30'} PM`
        : `${Math.floor(Math.random() * 6) + 10}:${Math.random() > 0.5 ? '00' : '30'} AM`
  }));
}

// Utility function to get table by ID
export function getTableById(tableId: string): ExtendedTableDetails | null {
  return tableDataStore[tableId] || null;
}

// Enhanced utility function to get table by ID with fallbacks
export function getTableByIdWithFallback(
  tableId: string, 
  tableType?: 'cash' | 'tournament', 
  name?: string,
  gameType?: string,
  stakes?: string,
  startTime?: string
): ExtendedTableDetails | null {
  const existingTable = getTableById(tableId);
  if (existingTable) {
    return existingTable;
  }

  // For generated table IDs from day schedule, create fallback data
  if (tableId.includes('-') && tableType && name) {
    console.log('Creating fallback data for:', tableId, tableType, name);
    
    // Create a basic TableRecord first
    const record: TableRecord = {
      id: tableId,
      name: name || 'Generated Table',
      type: tableType,
      venue: getRandomVenue(),
      distanceMiles: Math.round((Math.random() * 5 + 0.5) * 10) / 10,
      stakes: stakes || (tableType === 'cash' ? '$2/$5 NLH' : 'Tournament NLH'),
      gameType: gameType || 'NLH',
      startTimeISO: new Date().toISOString(),
      currency: '$',
      isSponsored: Math.random() > 0.8,
      isLive: Math.random() > 0.4,
      kind: 'table',
      
      // Type-specific defaults
      ...(tableType === 'cash' ? {
        totalSeats: Math.floor(Math.random() * 3) + 7, // 7-9 seats
        seatedCount: Math.floor(Math.random() * 5) + 3, // 3-7 seated
        buyInMin: Math.floor(Math.random() * 300) + 100,
        buyInMax: Math.floor(Math.random() * 1000) + 500
      } : {
        playerCap: Math.floor(Math.random() * 200) + 100,
        playersRegistered: Math.floor(Math.random() * 80) + 30,
        entry: Math.floor(Math.random() * 400) + 50,
        fee: Math.floor(Math.random() * 50) + 10
      })
    };
    
    const fallbackData = createExtendedTableDetails(record);
    // Store it temporarily for future access
    tableDataStore[tableId] = fallbackData;
    return fallbackData;
  }

  return null;
}

function getRandomVenue(): string {
  const venues = [
    'The Bicycle Casino', 'Commerce Club & Casino', 'Hollywood Park Casino', 
    'Hustler Casino', 'Hawaiian Gardens Casino', 'Crystal Casino & Hotel',
    'Normandie Casino', 'Ocean Eleven Casino', 'Bay 101 Casino',
    'Lucky Chances Casino', 'Artichoke Joe\'s Casino'
  ];
  return venues[Math.floor(Math.random() * venues.length)];
}

// Utility function to check if table is cash game
export function isCashTable(table: ExtendedTableDetails): table is CashTableDetails {
  return table.type === 'cash';
}

// Utility function to check if table is tournament
export function isTournamentTable(table: ExtendedTableDetails): table is TournamentDetails {
  return table.type === 'tournament';
}