import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Bell, 
  Users, 
  Trophy, 
  Gift, 
  Clock, 
  X,
  Gamepad2,
  MapPin,
  DollarSign,
  Star
} from 'lucide-react';

interface TestNotification {
  id: string;
  type: 'game_invitation' | 'tournament_update' | 'promotional_offer' | 'seat_available' | 'starting_soon';
  title: string;
  message: string;
  avatar?: string;
  tableName?: string;
  location?: string;
  time: string;
  tableId?: string;
  tableType?: 'cash' | 'tournament';
  actionButtons?: Array<{
    text: string;
    variant: 'primary' | 'secondary';
    action: 'join' | 'view' | 'dismiss';
  }>;
}

interface NotificationTesterProps {
  enabled: boolean;
  onNavigateToTable?: (tableId: string) => void;
  onJoinTable?: (tableId: string) => void;
  onNavigateToHome?: () => void;
}

const notificationTemplates: Omit<TestNotification, 'id' | 'time'>[] = [
  {
    type: 'game_invitation',
    title: 'Game Invitation',
    message: 'Alex invited you to join a $1/$2 NLH',
    avatar: 'A',
    tableName: 'Friday Night Cash',
    location: 'Downtown Poker Club',
    tableId: '1',
    tableType: 'cash',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    type: 'tournament_update',
    title: 'Tournament Starting Soon',
    message: 'Your registered tournament starts in 15 minutes',
    tableName: 'Weekend Championship Tournament',
    location: 'Riverside Casino',
    tableId: '2',
    tableType: 'tournament',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  },
  {
    type: 'promotional_offer',
    title: 'Special Offer',
    message: 'Get 30% off premium poker training courses',
    tableName: 'Limited Time',
    location: 'This Week Only',
    actionButtons: [
      { text: 'Claim Offer', variant: 'primary', action: 'dismiss' },
      { text: 'Learn More', variant: 'secondary', action: 'dismiss' }
    ]
  },
  {
    type: 'seat_available',
    title: 'Seat Available',
    message: 'A seat opened at the high stakes PLO table',
    tableName: 'High Stakes PLO',
    location: 'Elite Poker Room',
    tableId: '3',
    tableType: 'cash',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Table', variant: 'secondary', action: 'view' }
    ]
  },
  {
    type: 'starting_soon',
    title: 'Game Starting',
    message: 'Your poker game is starting in 5 minutes',
    tableName: 'Invalid Test Table',
    location: 'Test Location',
    tableId: 'invalid-table-id',
    tableType: 'cash',
    actionButtons: [
      { text: 'Join Now', variant: 'primary', action: 'join' },
      { text: 'View Details', variant: 'secondary', action: 'view' }
    ]
  }
];

export function NotificationTester({ 
  enabled, 
  onNavigateToTable, 
  onJoinTable, 
  onNavigateToHome 
}: NotificationTesterProps) {
  const [notifications, setNotifications] = useState<TestNotification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setNotifications([]);
      return;
    }

    // Create notification every 30 seconds (for testing - change to 300000 for 5 minutes)
    const interval = setInterval(() => {
      const template = notificationTemplates[currentIndex];
      const newNotification: TestNotification = {
        ...template,
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 2)]); // Keep max 3 notifications
      setCurrentIndex(prev => (prev + 1) % notificationTemplates.length);
    }, 30000); // 30 seconds for testing

    // Show first notification immediately for testing
    const template = notificationTemplates[0];
    const initialNotification: TestNotification = {
      ...template,
      id: 'initial',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
    setNotifications([initialNotification]);
    setCurrentIndex(1);

    return () => clearInterval(interval);
  }, [enabled, currentIndex]);

  const handleNotificationAction = (notification: TestNotification, action: string) => {
    switch (action) {
      case 'join':
        if (notification.tableId && onJoinTable) {
          console.log('Joining table:', notification.tableId);
          onJoinTable(notification.tableId);
        } else if (notification.tableId && onNavigateToTable) {
          // Fallback to view table if join handler not provided
          onNavigateToTable(notification.tableId);
        }
        break;
      case 'view':
        if (notification.tableId && onNavigateToTable) {
          console.log('Viewing table:', notification.tableId);
          onNavigateToTable(notification.tableId);
        }
        break;
      case 'dismiss':
        // For promotional offers or other non-table notifications
        if (onNavigateToHome) {
          onNavigateToHome();
        }
        break;
    }
    // Remove notification after action
    removeNotification(notification.id);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'game_invitation':
        return <Users className="w-4 h-4 text-chart-1" />;
      case 'tournament_update':
        return <Trophy className="w-4 h-4 text-chart-3" />;
      case 'promotional_offer':
        return <Gift className="w-4 h-4 text-chart-4" />;
      case 'seat_available':
        return <Bell className="w-4 h-4 text-chart-2" />;
      case 'starting_soon':
        return <Clock className="w-4 h-4 text-chart-5" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (!enabled || notifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" />
      
      {/* Centered Notification Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-sm space-y-3">
          {notifications.map((notification, index) => (
            <Card 
              key={notification.id}
              className={`bg-card border-border shadow-lg animate-in slide-in-from-bottom-5 duration-300 ${
                index > 0 ? 'opacity-90 scale-95' : ''
              }`}
              style={{
                transform: `translateY(${index * -8}px) scale(${1 - index * 0.05})`,
                zIndex: 50 - index
              }}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header with Icon and Close */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {notification.avatar ? (
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-chart-1 text-background text-xs">
                            {notification.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-chart-1/20 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      <h4 className="text-card-foreground text-sm font-medium">
                        {notification.title}
                      </h4>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notification.message}
                  </p>

                  {/* Location Info */}
                  {notification.tableName && notification.location && (
                    <div className="text-sm text-muted-foreground">
                      <span className="text-card-foreground">
                        {notification.tableName}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{notification.location}</span>
                    </div>
                  )}

                  {/* Time */}
                  <div className="text-xs text-muted-foreground">
                    {notification.time}
                  </div>

                  {/* Action Buttons */}
                  {notification.actionButtons && (
                    <div className="flex space-x-2 pt-2">
                      {notification.actionButtons.map((button, buttonIndex) => (
                        <Button
                          key={buttonIndex}
                          size="sm"
                          variant={button.variant === 'primary' ? 'default' : 'outline'}
                          className={`flex-1 text-xs min-h-[36px] ${
                            button.variant === 'primary'
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                              : 'bg-card hover:bg-accent border-border text-card-foreground'
                          }`}
                          onClick={() => handleNotificationAction(notification, button.action)}
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Developer Info - Bottom Corner */}
      <div className="fixed bottom-4 left-4 z-30">
        <div className="text-xs text-muted-foreground bg-muted/80 backdrop-blur rounded p-2 max-w-48">
          <div className="flex items-center space-x-1">
            <Bell className="w-3 h-3" />
            <span>Test: New notification every 30s</span>
          </div>
        </div>
      </div>
    </>
  );
}