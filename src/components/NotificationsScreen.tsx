import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AdBanner } from './AdBanner';
import { 
  Bell, 
  Users, 
  Clock, 
  MapPin, 
  CheckCheck,
  Star,
  TrendingUp,
  CalendarDays
} from 'lucide-react';

interface NotificationsScreenProps {
  onTableSelect: (tableId: string) => void;
}

interface Notification {
  id: string;
  type: 'invitation' | 'seat_available' | 'starting_soon' | 'update' | 'sponsored';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  tableId?: string;
  tableName?: string;
  location?: string;
  avatar?: string;
  actionButtons?: Array<{
    text: string;
    variant: 'primary' | 'secondary';
    action: string;
  }>;
  isSponsored?: boolean;
  sponsoredBadge?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '16',
    type: 'invitation',
    title: 'Saturday Night Special',
    message: 'Join us for this Saturday\'s big tournament. Great prize pool and professional atmosphere!',
    time: '30 min ago',
    isRead: false,
    tableId: (() => {
      const saturday = new Date();
      const daysUntilSaturday = (6 - saturday.getDay()) % 7;
      saturday.setDate(saturday.getDate() + daysUntilSaturday);
      return saturday.toISOString().split('T')[0] + '-tournament-8';
    })(), // Links to this Saturday's generated tournament
    tableName: 'Weekend Tournament',
    location: 'Premium Poker Room',
    actionButtons: [
      { text: 'Register', variant: 'primary', action: 'register' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '1',
    type: 'sponsored',
    title: 'New High Stakes Tournament',
    message: 'Grand Casino Resort is hosting a $100K guaranteed tournament this weekend. Early bird registration now open!',
    time: '2 min ago',
    isRead: false,
    tableId: '2', // Links to Championship Circuit Main Event in TableDataStore
    tableName: 'Championship Circuit Main Event',
    location: 'Hustler Casino',
    isSponsored: true,
    sponsoredBadge: 'Sponsored',
    actionButtons: [
      { text: 'Register Now', variant: 'primary', action: 'register' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '2',
    type: 'invitation',
    title: 'Game Invitation',
    message: 'Alex invited you to join a $2/$5 NL Hold\'em cash game at The Bicycle Casino.',
    time: '5 min ago',
    isRead: false,
    tableId: '1', // Links to Midnight Express in TableDataStore
    tableName: 'Midnight Express',
    location: 'The Bicycle Casino',
    avatar: 'A',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '3',
    type: 'seat_available',
    title: 'Seat Available',
    message: 'A seat just opened up at the table you were waiting for.',
    time: '8 min ago',
    isRead: false,
    tableId: '3', // Links to Omaha Mayhem in TableDataStore
    tableName: 'Omaha Mayhem',
    location: 'Commerce Club & Casino',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '4',
    type: 'starting_soon',
    title: 'Tournament Starting Soon',
    message: 'Your registered tournament starts in 15 minutes. Don\'t miss out!',
    time: '10 min ago',
    isRead: true,
    tableId: '5', // Links to Bounty Hunter Tournament in TableDataStore
    tableName: 'Bounty Hunter Tournament',
    location: 'Hawaiian Gardens Casino',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '5',
    type: 'seat_available',
    title: 'Cash Game Seat Open',
    message: 'A seat just became available in the cash game you were waiting for. Join now!',
    time: '1 hour ago',
    isRead: true,
    tableId: new Date().toISOString().split('T')[0] + '-game-2', // Links to today's generated cash game
    tableName: 'Lunch Break Special',
    location: 'Generated Venue',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '6',
    type: 'update',
    title: 'Game Update',
    message: 'Blinds increased to $3/$6. Current pot: $450',
    time: '2 hours ago',
    isRead: true,
    tableId: '4', // Links to Daily Grind Cash Game in TableDataStore
    tableName: 'Daily Grind Cash Game',
    location: 'Hollywood Park Casino',
    actionButtons: [
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '7',
    type: 'invitation',
    title: 'Weekly Game Invitation',
    message: 'Sarah invited you to the weekly home game. $1/$2 NL, friendly atmosphere.',
    time: '1 day ago',
    isRead: true,
    tableId: '4', // Links to Daily Grind Cash Game in TableDataStore
    tableName: 'Daily Grind Cash Game',
    location: 'Hollywood Park Casino',
    avatar: 'S',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '8',
    type: 'sponsored',
    title: 'VIP Poker Tournament',
    message: 'Exclusive VIP tournament with $250K guaranteed prize pool. Limited seats available.',
    time: '2 days ago',
    isRead: true,
    tableId: '2', // Links to Championship Circuit Main Event in TableDataStore
    tableName: 'Championship Circuit Main Event',
    location: 'Hustler Casino',
    isSponsored: true,
    sponsoredBadge: 'Sponsored',
    actionButtons: [
      { text: 'Register', variant: 'primary', action: 'register' },
      { text: 'Learn More', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '9',
    type: 'invitation',
    title: 'High Stakes PLO',
    message: 'Mike invited you to a $5/$10 PLO game. Action is heating up!',
    time: '2 days ago',
    isRead: true,
    tableId: '3', // Links to Omaha Mayhem in TableDataStore
    tableName: 'Omaha Mayhem',
    location: 'Commerce Club & Casino',
    avatar: 'M',
    actionButtons: [
      { text: 'Join Game', variant: 'primary', action: 'join' },
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '10',
    type: 'seat_available',
    title: 'Waitlist Update',
    message: 'You\'ve moved up to #2 on the waitlist for the tournament.',
    time: '3 days ago',
    isRead: true,
    tableId: '5', // Links to Bounty Hunter Tournament in TableDataStore
    tableName: 'Bounty Hunter Tournament',
    location: 'Hawaiian Gardens Casino',
    actionButtons: [
      { text: 'View Tournament', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '11',
    type: 'invitation',
    title: 'Micro Stakes Tournament',
    message: 'Emma invited you to a beginner-friendly tournament. Perfect for building your skills!',
    time: '3 days ago',
    isRead: true,
    tableId: '5', // Links to Bounty Hunter Tournament in TableDataStore
    tableName: 'Bounty Hunter Tournament',
    location: 'Hawaiian Gardens Casino',
    avatar: 'E',
    actionButtons: [
      { text: 'Join Tournament', variant: 'primary', action: 'join' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '12',
    type: 'invitation',
    title: 'Today\'s Tournament Reminder',
    message: 'Don\'t forget about the evening tournament you registered for. Starts in 2 hours!',
    time: '4 days ago',
    isRead: true,
    tableId: new Date().toISOString().split('T')[0] + '-tournament-7', // Links to today's generated tournament
    tableName: 'Evening Tournament',
    location: 'Generated Venue',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '13',
    type: 'update',
    title: 'Blinds Level Update',
    message: 'Tournament has reached level 8. Blinds are now 400/800 with 100 ante.',
    time: '5 days ago',
    isRead: true,
    tableId: '2', // Links to Championship Circuit Main Event in TableDataStore
    tableName: 'Championship Circuit Main Event',
    location: 'Hustler Casino',
    actionButtons: [
      { text: 'View Tournament', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '14',
    type: 'seat_available',
    title: 'Preferred Seat Available',
    message: 'Your preferred seat at the high stakes table is now available.',
    time: '6 days ago',
    isRead: true,
    tableId: '3', // Links to Omaha Mayhem in TableDataStore
    tableName: 'Omaha Mayhem',
    location: 'Commerce Club & Casino',
    actionButtons: [
      { text: 'Claim Seat', variant: 'primary', action: 'join' },
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    id: '15',
    type: 'invitation',
    title: 'Home Game Series',
    message: 'David invited you to join his monthly home game series. Next game is this Friday.',
    time: '1 week ago',
    isRead: true,
    tableId: '1', // Links to Midnight Express in TableDataStore
    tableName: 'Midnight Express',
    location: 'The Bicycle Casino',
    avatar: 'D',
    actionButtons: [
      { text: 'Accept Invite', variant: 'primary', action: 'join' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  }
];

export function NotificationsScreen({ onTableSelect }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleNotificationAction = (notification: Notification, action: string) => {
    markAsRead(notification.id);
    
    if (action === 'join' || action === 'view' || action === 'register') {
      if (notification.tableId) {
        console.log('Notification action triggered:', action, 'for table:', notification.tableId, 'table name:', notification.tableName);
        onTableSelect(notification.tableId);
      }
    }
    // Handle other actions (learn, etc.) - these don't navigate to tables
    if (action === 'learn') {
      // Navigate to external learning resources
      window.open('https://www.google.com', '_blank');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'invitation':
        return <Users className="w-5 h-5 text-chart-1" />;
      case 'seat_available':
        return <Bell className="w-5 h-5 text-chart-2" />;
      case 'starting_soon':
        return <Clock className="w-5 h-5 text-chart-3" />;
      case 'sponsored':
        return <Star className="w-5 h-5 text-chart-4" />;
      default:
        return <TrendingUp className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* AdBanner at very top - No spacing above, safe area handled within banner */}
      <div 
        className="flex-shrink-0"
        style={{
          paddingTop: `env(safe-area-inset-top, 0px)` // Only safe area, no extra padding
        }}
      >
        <AdBanner 
          type="header" 
          className="w-full" 
        />
      </div>

      {/* Blue Header - Directly touches bottom of ad banner */}
      <div className="flex-shrink-0 bg-primary px-4 py-3 shadow-sm border-b border-primary-foreground/10 min-h-[48px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg text-primary-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-primary-foreground/80 text-sm">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              size="sm"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 min-h-[44px]"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark All Read
            </Button>
          )}
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
          className="p-4 space-y-4"
          style={{
            paddingBottom: `calc(68px + env(safe-area-inset-bottom) + 16px)`
          }}
        >
          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-card-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`bg-card border-border overflow-hidden transition-all duration-200 hover:border-chart-1 hover:shadow-lg hover:shadow-chart-1/10 cursor-pointer ${
                  !notification.isRead ? 'ring-2 ring-chart-1/20 border-chart-1/30' : ''
                } ${
                  notification.isSponsored ? 'bg-gradient-to-r from-chart-4/5 to-transparent' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  {/* Sponsored Badge */}
                  {notification.isSponsored && notification.sponsoredBadge && (
                    <div className="mb-3">
                      <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30 text-xs px-2 py-0.5">
                        {notification.sponsoredBadge}
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start space-x-3 mb-3">
                    {notification.avatar ? (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-chart-1 text-background">
                          {notification.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="text-card-foreground leading-tight">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-chart-1 flex-shrink-0 mt-1 ml-2" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Table/Location Info */}
                      {notification.tableName && (
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">
                            {notification.tableName} • {notification.location}
                          </span>
                        </div>
                      )}

                      {/* Time */}
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        {notification.time}
                      </div>
                    </div>
                  </div>

                  {/* Full-width Divider (if action buttons present) */}
                  {notification.actionButtons && (
                    <div className="border-t border-border -mx-4 mb-4 mt-4"></div>
                  )}

                  {/* Action Buttons */}
                  {notification.actionButtons && (
                    <div className="flex space-x-2 px-4 -mx-4">
                      {notification.actionButtons.map((button, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={button.variant === 'primary' ? 'default' : 'outline'}
                          className={`min-h-[44px] ${
                            button.variant === 'primary'
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                              : 'bg-card hover:bg-accent border-border text-card-foreground'
                          } transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationAction(notification, button.action);
                          }}
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}