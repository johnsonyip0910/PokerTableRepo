/**
 * Configuration for sponsored table posters on specific days of the week
 * 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
 */
export const sponsoredDaysConfig = {
  1: { // Monday - Professional Tournament Theme
    backgroundImage: "https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb2tlciUyMHRvdXJuYW1lbnQlMjBjYXJkcyUyMGNoaXBzfGVufDF8fHx8MTc1NjQ5MTM1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    overlayOpacity: 0.75,
    description: "Professional Tournament"
  },
  3: { // Wednesday - Luxury Casino Theme
    backgroundImage: "https://images.unsplash.com/photo-1567136445648-01b1b12734ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBwb2tlciUyMHJvb20lMjBsdXh1cnklMjBncmVlbiUyMGZlbHR8ZW58MXx8fHwxNzU2NDkxMzYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    overlayOpacity: 0.8,
    description: "Luxury Casino"
  },
  6: { // Saturday - Championship Trophy Theme
    backgroundImage: "https://images.unsplash.com/photo-1754300681803-61eadeb79d10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMGNoYW1waW9uc2hpcCUyMHRyb3BoeSUyMGdvbGRlbnxlbnwxfHx8fDE3NTY0OTEzNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    overlayOpacity: 0.7,
    description: "Championship Trophy"
  }
} as const;

/**
 * Check if a given day of the week should have a sponsored table poster
 * @param dayOfWeek - Day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns The sponsored configuration if the day is sponsored, null otherwise
 */
export function getSponsoredConfigForDay(dayOfWeek: number) {
  return sponsoredDaysConfig[dayOfWeek as keyof typeof sponsoredDaysConfig] || null;
}

/**
 * Get the list of sponsored day names for display purposes
 * @returns Array of day names that have sponsored content
 */
export function getSponsoredDayNames(): string[] {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return Object.keys(sponsoredDaysConfig)
    .map(day => dayNames[parseInt(day)])
    .sort();
}