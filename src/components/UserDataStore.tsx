export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  memberSince: string;
  isCorporate?: boolean;
  tier: 'Bronze' | 'Bronze+' | 'Silver' | 'Silver+' | 'Gold' | 'Gold+' | 'Platinum' | 'Platinum+' | 'Diamond' | 'Legend';
  stats: {
    tablesJoined: number;
    tablesCreated: number;
    totalActiveDays: number;
    cancellations: number;
  };
  hasReviews?: boolean;
  reviews?: UserReview[];
}

export interface UserReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  comment: string;
  rating: number;
  timestamp: Date;
  isCorporate?: boolean;
}

// Complete user database with real accounts from the app
export const userDatabase: Record<string, UserProfile> = {
  // Users from table data store
  'jennifer-chang': {
    id: 'jennifer-chang',
    name: 'Jennifer Chang',
    avatar: 'JC',
    rating: 4.6,
    memberSince: 'Jan 2023',
    isCorporate: true,
    tier: 'Platinum',
    stats: {
      tablesJoined: 85,
      tablesCreated: 23,
      totalActiveDays: 245,
      cancellations: 1
    },
    hasReviews: true
  },
  
  'marcus-williams': {
    id: 'marcus-williams',
    name: 'Marcus Williams',
    avatar: 'MW',
    rating: 4.3,
    memberSince: 'Mar 2023',
    tier: 'Gold+',
    stats: {
      tablesJoined: 62,
      tablesCreated: 15,
      totalActiveDays: 178,
      cancellations: 3
    },
    hasReviews: true
  },
  
  'david-liu': {
    id: 'david-liu',
    name: 'David Liu',
    avatar: 'DL',
    rating: 4.8,
    memberSince: 'Sep 2022',
    isCorporate: true,
    tier: 'Diamond',
    stats: {
      tablesJoined: 127,
      tablesCreated: 34,
      totalActiveDays: 398,
      cancellations: 0
    },
    hasReviews: true
  },
  
  'rachel-martinez': {
    id: 'rachel-martinez',
    name: 'Rachel Martinez',
    avatar: 'RM',
    rating: 4.2,
    memberSince: 'Jun 2023',
    tier: 'Gold',
    stats: {
      tablesJoined: 48,
      tablesCreated: 12,
      totalActiveDays: 134,
      cancellations: 2
    },
    hasReviews: true
  },
  
  'antonio-silva': {
    id: 'antonio-silva',
    name: 'Antonio Silva',
    avatar: 'AS',
    rating: 4.9,
    memberSince: 'Feb 2022',
    isCorporate: true,
    tier: 'Legend',
    stats: {
      tablesJoined: 234,
      tablesCreated: 67,
      totalActiveDays: 521,
      cancellations: 1
    },
    hasReviews: true
  },
  
  'natasha-volkov': {
    id: 'natasha-volkov',
    name: 'Natasha Volkov',
    avatar: 'NV',
    rating: 4.8,
    memberSince: 'Aug 2022',
    tier: 'Diamond',
    stats: {
      tablesJoined: 156,
      tablesCreated: 45,
      totalActiveDays: 412,
      cancellations: 0
    },
    hasReviews: true
  },
  
  'kevin-park': {
    id: 'kevin-park',
    name: 'Kevin Park',
    avatar: 'KP',
    rating: 4.7,
    memberSince: 'Nov 2022',
    tier: 'Platinum+',
    stats: {
      tablesJoined: 98,
      tablesCreated: 28,
      totalActiveDays: 289,
      cancellations: 1
    },
    hasReviews: true
  },
  
  'tommy-chen': {
    id: 'tommy-chen',
    name: 'Tommy Chen',
    avatar: 'TC',
    rating: 4.1,
    memberSince: 'Jul 2023',
    tier: 'Silver+',
    stats: {
      tablesJoined: 35,
      tablesCreated: 8,
      totalActiveDays: 98,
      cancellations: 4
    },
    hasReviews: false // No reviews, won't show in comments
  },
  
  'lisa-thompson': {
    id: 'lisa-thompson',
    name: 'Lisa Thompson',
    avatar: 'LT',
    rating: 4.3,
    memberSince: 'Apr 2023',
    tier: 'Gold',
    stats: {
      tablesJoined: 52,
      tablesCreated: 14,
      totalActiveDays: 167,
      cancellations: 2
    },
    hasReviews: true
  },
  
  'robert-kim': {
    id: 'robert-kim',
    name: 'Robert Kim',
    avatar: 'RK',
    rating: 4.5,
    memberSince: 'Dec 2022',
    tier: 'Platinum',
    stats: {
      tablesJoined: 74,
      tablesCreated: 19,
      totalActiveDays: 234,
      cancellations: 1
    },
    hasReviews: true
  },
  
  'amanda-foster': {
    id: 'amanda-foster',
    name: 'Amanda Foster',
    avatar: 'AF',
    rating: 4.0,
    memberSince: 'Aug 2023',
    tier: 'Silver',
    stats: {
      tablesJoined: 28,
      tablesCreated: 6,
      totalActiveDays: 87,
      cancellations: 3
    },
    hasReviews: false // No reviews, won't show in comments
  },
  
  'alexandra-rodriguez': {
    id: 'alexandra-rodriguez',
    name: 'Alexandra Rodriguez',
    avatar: 'AR',
    rating: 4.7,
    memberSince: 'Oct 2022',
    isCorporate: true,
    tier: 'Diamond',
    stats: {
      tablesJoined: 143,
      tablesCreated: 38,
      totalActiveDays: 365,
      cancellations: 0
    },
    hasReviews: true
  },
  
  'michael-johnson': {
    id: 'michael-johnson',
    name: 'Michael Johnson',
    avatar: 'MJ',
    rating: 4.5,
    memberSince: 'Jan 2023',
    tier: 'Platinum',
    stats: {
      tablesJoined: 81,
      tablesCreated: 22,
      totalActiveDays: 201,
      cancellations: 2
    },
    hasReviews: true
  },
  
  'chen-wei': {
    id: 'chen-wei',
    name: 'Chen Wei',
    avatar: 'CW',
    rating: 4.8,
    memberSince: 'May 2022',
    tier: 'Diamond',
    stats: {
      tablesJoined: 167,
      tablesCreated: 42,
      totalActiveDays: 445,
      cancellations: 1
    },
    hasReviews: true
  },
  
  'emma-wilson': {
    id: 'emma-wilson',
    name: 'Emma Wilson',
    avatar: 'EW',
    rating: 4.4,
    memberSince: 'Feb 2023',
    tier: 'Gold+',
    stats: {
      tablesJoined: 59,
      tablesCreated: 16,
      totalActiveDays: 189,
      cancellations: 1
    },
    hasReviews: true
  },
  
  'james-rodriguez': {
    id: 'james-rodriguez',
    name: 'James Rodriguez',
    avatar: 'JR',
    rating: 4.6,
    memberSince: 'Dec 2022',
    tier: 'Platinum',
    stats: {
      tablesJoined: 92,
      tablesCreated: 25,
      totalActiveDays: 267,
      cancellations: 0
    },
    hasReviews: true
  },
  
  'daniel-torres': {
    id: 'daniel-torres',
    name: 'Daniel Torres',
    avatar: 'DT',
    rating: 4.5,
    memberSince: 'Mar 2023',
    tier: 'Gold+',
    stats: {
      tablesJoined: 67,
      tablesCreated: 18,
      totalActiveDays: 156,
      cancellations: 2
    },
    hasReviews: true
  },
  
  'sofia-petrova': {
    id: 'sofia-petrova',
    name: 'Sofia Petrova',
    avatar: 'SP',
    rating: 4.7,
    memberSince: 'Sep 2022',
    isCorporate: true,
    tier: 'Platinum+',
    stats: {
      tablesJoined: 112,
      tablesCreated: 31,
      totalActiveDays: 334,
      cancellations: 1
    },
    hasReviews: true
  },
  
  'carlos-mendez': {
    id: 'carlos-mendez',
    name: 'Carlos Mendez',
    avatar: 'CM',
    rating: 4.3,
    memberSince: 'Jun 2023',
    tier: 'Gold',
    stats: {
      tablesJoined: 44,
      tablesCreated: 11,
      totalActiveDays: 123,
      cancellations: 3
    },
    hasReviews: false // No reviews, won't show in comments
  },
  
  'grace-kim': {
    id: 'grace-kim',
    name: 'Grace Kim',
    avatar: 'GK',
    rating: 4.4,
    memberSince: 'Apr 2023',
    tier: 'Gold+',
    stats: {
      tablesJoined: 56,
      tablesCreated: 15,
      totalActiveDays: 145,
      cancellations: 2
    },
    hasReviews: true
  }
};

// Reviews for the main user profile (John Doe) from real app users
export const realUserComments: UserReview[] = [
  {
    id: '1',
    reviewerId: 'alexandra-rodriguez',
    reviewerName: 'Alexandra Rodriguez',
    reviewerAvatar: 'AR',
    comment: 'Excellent poker player with great table presence. Always professional and makes strategic decisions. Would definitely recommend for serious games.',
    rating: 5,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isCorporate: true
  },
  {
    id: '2',
    reviewerId: 'david-liu',
    reviewerName: 'David Liu',
    reviewerAvatar: 'DL',
    comment: 'Solid player with excellent sportsmanship. Very respectful at the table and pays promptly. Great addition to any game.',
    rating: 5,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isCorporate: true
  },
  {
    id: '3',
    reviewerId: 'sofia-petrova',
    reviewerName: 'Sofia Petrova',
    reviewerAvatar: 'SP',
    comment: 'Professional and courteous player. Shows up on time and follows proper etiquette. Makes the game enjoyable for everyone.',
    rating: 4,
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    isCorporate: true
  },
  {
    id: '4',
    reviewerId: 'antonio-silva',
    reviewerName: 'Antonio Silva',
    reviewerAvatar: 'AS',
    comment: 'Great poker mind and fair player. Always brings good energy to the table. Looking forward to more games together.',
    rating: 5,
    timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    isCorporate: true
  },
  {
    id: '5',
    reviewerId: 'kevin-park',
    reviewerName: 'Kevin Park',
    reviewerAvatar: 'KP',
    comment: 'Reliable and skilled player with good table awareness. Handles both wins and losses with class. Recommended.',
    rating: 4,
    timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
  },
  {
    id: '6',
    reviewerId: 'natasha-volkov',
    reviewerName: 'Natasha Volkov',
    reviewerAvatar: 'NV',
    comment: 'Outstanding player who brings professionalism to every session. Great strategic thinking and very respectful.',
    rating: 5,
    timestamp: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
  }
];

// Utility functions
export function getUserById(userId: string): UserProfile | null {
  return userDatabase[userId] || null;
}

export function getUsersWithReviews(): UserProfile[] {
  return Object.values(userDatabase).filter(user => user.hasReviews);
}

export function getCommentsForUser(userId: string): UserReview[] {
  if (userId === 'john-doe') {
    return realUserComments;
  }
  
  // For other users, generate some realistic comments from other users
  const users = getUsersWithReviews().filter(u => u.id !== userId);
  const numComments = Math.floor(Math.random() * 4) + 2; // 2-5 comments
  const selectedUsers = users.sort(() => Math.random() - 0.5).slice(0, numComments);
  
  const commentTemplates = [
    'Great player with excellent table etiquette. Always professional and fair.',
    'Solid poker skills and good sportsmanship. Recommended player.',
    'Professional conduct and strategic play. Makes the game enjoyable.',
    'Reliable player who shows up on time and plays with integrity.',
    'Excellent poker player with great attitude. Would play again.',
    'Fair player with good decision-making skills. Very respectful.'
  ];
  
  return selectedUsers.map((user, index) => ({
    id: `${userId}-comment-${index + 1}`,
    reviewerId: user.id,
    reviewerName: user.name,
    reviewerAvatar: user.avatar,
    comment: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    timestamp: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000),
    isCorporate: user.isCorporate
  }));
}

export function getAverageRating(comments: UserReview[]): number {
  if (comments.length === 0) return 0;
  return comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length;
}