import React from 'react';
import { SponsoredTablePoster } from './SponsoredTablePoster';
import { TableRecord } from './TableFilteringSystem';

// Example usage of the SponsoredTablePoster component
export function SponsoredTablePosterExample() {
  // Mock table data for demonstration
  const mockTable: TableRecord = {
    id: 'sponsored-example-1',
    name: 'Premium Tournament Series',
    type: 'tournament',
    venue: 'Grand Casino Resort',
    distanceMiles: 1.2,
    stakes: 'Tournament NLH',
    gameType: 'NLH',
    startTimeISO: new Date().toISOString(),
    playersRegistered: 45,
    playerCap: 200,
    entry: 500,
    fee: 50,
    currency: '$',
    isSponsored: true,
    isLive: false,
    kind: 'table'
  };

  const handleTableClick = (table: TableRecord) => {
    console.log('Sponsored table clicked:', table);
    // Handle navigation to table details or sponsor action
  };

  const handleReservationClick = () => {
    console.log('Sponsored reservation clicked');
    // Handle sponsored reservation - could redirect to sponsor's site or special flow
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-card-foreground">Sponsored Table Poster Examples</h2>
      
      {/* Example 1: High overlay opacity for dark/busy backgrounds */}
      <div className="space-y-2">
        <h3 className="text-sm text-muted-foreground">High Opacity Overlay (0.85)</h3>
        <SponsoredTablePoster
          table={mockTable}
          onClick={handleTableClick}
          onReservationClick={handleReservationClick}
          sponsorBackgroundImage="https://images.unsplash.com/photo-1670085734312-9e8362003c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMGNoaXBzJTIwY2FzaW5vJTIwZ2FtaW5nfGVufDF8fHx8MTc1NjM3NjA0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          sponsorOverlayOpacity={0.85}
        />
      </div>

      {/* Example 2: Medium overlay opacity */}
      <div className="space-y-2">
        <h3 className="text-sm text-muted-foreground">Medium Opacity Overlay (0.75)</h3>
        <SponsoredTablePoster
          table={{
            ...mockTable,
            id: 'sponsored-example-2',
            name: 'High Stakes Cash Game',
            type: 'cash',
            stakes: '$5/$10 NLH',
            totalSeats: 9,
            seatedCount: 6,
            buyInMin: 1000,
            buyInMax: 5000
          }}
          onClick={handleTableClick}
          onReservationClick={handleReservationClick}
          sponsorBackgroundImage="https://images.unsplash.com/photo-1655159428718-5d755eb867d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2tlciUyMHRvdXJuYW1lbnQlMjBwcm9mZXNzaW9uYWwlMjBjYXJkc3xlbnwxfHx8fDE3NTYzNzYwNDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          sponsorOverlayOpacity={0.75}
        />
      </div>

      {/* Example 3: Lower overlay opacity for lighter backgrounds */}
      <div className="space-y-2">
        <h3 className="text-sm text-muted-foreground">Lower Opacity Overlay (0.65)</h3>
        <SponsoredTablePoster
          table={{
            ...mockTable,
            id: 'sponsored-example-3',
            name: 'Luxury Poker Experience',
            venue: 'Royal Poker Club',
            distanceMiles: 0.8
          }}
          onClick={handleTableClick}
          onReservationClick={handleReservationClick}
          sponsorBackgroundImage="https://images.unsplash.com/photo-1633629544357-14223c9837d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjB0YWJsZSUyMGNhcmRzJTIwbHV4dXJ5fGVufDF8fHx8MTc1NjM3NjA1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          sponsorOverlayOpacity={0.65}
        />
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <h3 className="text-card-foreground mb-2">Usage Notes:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• The component mimics the exact layout and styling of TableCard</li>
          <li>• Custom background images fill the entire card area</li>
          <li>• Overlay opacity should be adjusted based on background image contrast</li>
          <li>• Subtle "Sponsored" label appears in top-right corner</li>
          <li>• "Make a Reservation" button is identical to normal tables</li>
          <li>• Users may not immediately recognize it as an advertisement</li>
          <li>• Perfect for seamless integration into table lists</li>
        </ul>
      </div>
    </div>
  );
}