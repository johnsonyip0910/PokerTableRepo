import React from 'react';
import { Building } from 'lucide-react';

interface UserStatusPillProps {
  /** Whether to show the corporate status pill */
  isCorporate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UserStatusPill displays a "Corporate" status indicator next to user names
 * 
 * Variants:
 * - corporate: Shows the pill with building icon and "Corporate" text
 * - hidden: Does not render (when isCorporate is false)
 * 
 * Specs:
 * - Size: auto width × 20px height
 * - Padding: 8px horizontal, 6px border radius
 * - Style: light brand background (#E8F1FF) with brand text (#1D4ED8)
 * - Icon: 12px building icon with 4px gap before text
 * - Text: 12px bold "Corporate" label
 */
export function UserStatusPill({ 
  isCorporate = true, 
  className = '' 
}: UserStatusPillProps) {
  // Hidden state - do not render
  if (!isCorporate) {
    return null;
  }

  // Corporate state - render the pill
  return (
    <div 
      className={`inline-flex items-center h-5 px-2 rounded-md bg-[#E8F1FF] ${className}`}
      style={{ borderRadius: '6px' }}
    >
      <Building 
        className="w-3 h-3 text-[#1D4ED8]" 
        style={{ width: '12px', height: '12px' }}
      />
      <span 
        className="text-[#1D4ED8] ml-1 leading-none"
        style={{ 
          fontSize: '12px', 
          fontWeight: 'bold',
          marginLeft: '4px'
        }}
      >
        Corporate
      </span>
    </div>
  );
}