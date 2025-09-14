import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { AdBanner } from './AdBanner';
import { 
  Settings, 
  Trophy, 
  Calendar, 
  Star,
  MessageCircle,
  ChevronRight,
  Crown,
  BarChart3,
  UserPlus,
  Clock,
  X,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { UserStatusPill } from './UserStatusPill';
import { ProfileViewerScreen } from './ProfileViewerScreen';
import { realUserComments, getAverageRating, UserReview } from './UserDataStore';

interface ProfileScreenProps {
  onNavigateToSettings: () => void;
  isCurrentUserProfile?: boolean;
}

// Remove the local Comment interface - we'll use UserReview from UserDataStore

interface GameHistoryEntry {
  id: string;
  name: string;
  type: 'cash' | 'tournament';
  date: Date;
  duration: string;
  status: 'joined' | 'cancelled';
  location: string;
}

// Use real user comments from UserDataStore

const mockGameHistory: GameHistoryEntry[] = [
  {
    id: '1',
    name: 'Sunday Tournament',
    type: 'tournament',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: '4h 30m',
    status: 'joined',
    location: 'Royal Flush Lounge'
  },
  {
    id: '2',
    name: 'Cash Game Session',
    type: 'cash',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: '3h 15m',
    status: 'joined',
    location: 'Downtown Poker Club'
  },
  {
    id: '3',
    name: 'Thursday Night Tournament',
    type: 'tournament',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: '5h 45m',
    status: 'cancelled',
    location: 'Ace High Casino'
  },
  {
    id: '4',
    name: 'PLO Cash Game',
    type: 'cash',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: '2h 20m',
    status: 'joined',
    location: 'Riverside Casino'
  },
  {
    id: '5',
    name: 'Weekend Deep Stack',
    type: 'tournament',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: '6h 10m',
    status: 'cancelled',
    location: 'Silver Star Poker'
  }
];

// Tier system with 10 levels
const tiers = [
  { level: 1, name: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-600/20', minActivity: 0 },
  { level: 2, name: 'Bronze+', color: 'text-orange-500', bgColor: 'bg-orange-500/20', minActivity: 10 },
  { level: 3, name: 'Silver', color: 'text-gray-400', bgColor: 'bg-gray-400/20', minActivity: 25 },
  { level: 4, name: 'Silver+', color: 'text-gray-300', bgColor: 'bg-gray-300/20', minActivity: 50 },
  { level: 5, name: 'Gold', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', minActivity: 100 },
  { level: 6, name: 'Gold+', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', minActivity: 175 },
  { level: 7, name: 'Platinum', color: 'text-cyan-400', bgColor: 'bg-cyan-400/20', minActivity: 275 },
  { level: 8, name: 'Platinum+', color: 'text-cyan-300', bgColor: 'bg-cyan-300/20', minActivity: 400 },
  { level: 9, name: 'Diamond', color: 'text-blue-400', bgColor: 'bg-blue-400/20', minActivity: 600 },
  { level: 10, name: 'Legend', color: 'text-purple-400', bgColor: 'bg-purple-400/20', minActivity: 1000 }
];

type ProfileView = 'main' | 'game-history' | 'user-profile';

export function ProfileScreen({ onNavigateToSettings, isCurrentUserProfile = true }: ProfileScreenProps) {
  const [currentView, setCurrentView] = useState<ProfileView>('main');
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [comments, setComments] = useState<UserReview[]>(realUserComments);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [displayedHistoryCount, setDisplayedHistoryCount] = useState(5);

  // User stats - exactly as requested in master prompt
  const userStats = {
    tablesJoined: 45,
    tablesCreated: 12,
    totalActiveDays: 156, // Days user logged in / used app
    cancellations: 2
  };

  // Calculate current tier based on total activity
  const totalActivity = userStats.tablesJoined + userStats.tablesCreated + (userStats.totalActiveDays * 2);
  const currentTier = tiers.reverse().find(tier => totalActivity >= tier.minActivity) || tiers[0];
  const nextTier = tiers.find(tier => tier.level === currentTier.level + 1);
  
  // Calculate average rating using the utility function
  const averageRating = getAverageRating(comments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: UserReview = {
        id: Date.now().toString(),
        reviewerId: 'current',
        reviewerName: 'You',
        reviewerAvatar: 'Y',
        comment: newComment.trim(),
        rating: newRating,
        timestamp: new Date()
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setNewRating(5);
      setShowCommentDialog(false);
    }
  };

  const handleBack = () => {
    if (currentView === 'user-profile') {
      setCurrentView('main');
      setSelectedUserId('');
    } else {
      setCurrentView('main');
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('user-profile');
  };



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'joined':
        return <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30 text-xs">Joined</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="text-xs">Cancelled by Host</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Completed</Badge>;
    }
  };

  const handleLoadMoreHistory = async () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newCount = displayedHistoryCount + 5;
    setDisplayedHistoryCount(newCount);
    
    // If we've shown all history, hide the load more button
    if (newCount >= mockGameHistory.length + 5) {
      setHasMoreHistory(false);
    }
    
    setIsLoadingMore(false);
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  // Game History View
  if (currentView === 'game-history') {
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
        <div className="flex-shrink-0 bg-primary px-4 py-3 min-h-[48px]">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg text-primary-foreground">Game History</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          className="flex-1 overflow-y-auto overscroll-behavior-y-contain" 
          style={{ 
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="px-4 py-4 space-y-4"
            style={{
              paddingBottom: `calc(68px + env(safe-area-inset-bottom) + 16px)`
            }}
          >
            {mockGameHistory.slice(0, displayedHistoryCount).map((game) => (
              <Card key={game.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-card-foreground">{game.name}</h3>
                        {getStatusBadge(game.status)}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{game.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      {game.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{game.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Load More Button or No More Message */}
            {hasMoreHistory ? (
              <Button 
                onClick={handleLoadMoreHistory}
                disabled={isLoadingMore}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px] px-4 rounded-lg"
              >
                {isLoadingMore ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Load More History'
                )}
              </Button>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No more records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // User Profile View
  if (currentView === 'user-profile' && selectedUserId) {
    return (
      <ProfileViewerScreen 
        userId={selectedUserId} 
        onBack={handleBack}
        isCurrentUserProfile={false}
      />
    );
  }

  // Main Profile View
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

      {/* Blue Header with Profile Info - Directly touches bottom of ad banner */}
      <div className="flex-shrink-0 bg-primary px-4 py-3 min-h-[48px]">
        {/* Profile Info with Settings Button aligned to name */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-chart-1 text-background text-2xl">
              JD
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <h2 className="text-xl text-primary-foreground">John Doe</h2>
                <UserStatusPill isCorporate={true} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNavigateToSettings}
                className="text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors duration-200 min-h-[44px] min-w-[44px]"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-2">Member since Jan 2024</p>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(averageRating), 'lg')}
                <span className="text-primary-foreground ml-1">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-primary-foreground/60 text-sm">
                  ({comments.length} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Badge */}
        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full ${currentTier.bgColor} flex items-center space-x-2`}>
              <Crown className={`w-4 h-4 ${currentTier.color}`} />
              <span className={`${currentTier.color}`}>
                Tier {currentTier.level}: {currentTier.name}
              </span>
            </div>
            
            {nextTier && (
              <div className="text-primary-foreground/60 text-sm">
                {nextTier.minActivity - totalActivity} points to {nextTier.name}
              </div>
            )}
          </div>
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
          className="px-4 py-4 space-y-4"
          style={{
            paddingBottom: `calc(68px + env(safe-area-inset-bottom) + 16px)`
          }}
        >
          {/* Statistics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-chart-1/10 rounded-lg">
                  <UserPlus className="w-6 h-6 text-chart-1 mx-auto mb-2" />
                  <div className="text-2xl text-chart-1">{userStats.tablesJoined}</div>
                  <div className="text-sm text-muted-foreground">Tables Joined</div>
                </div>
                
                <div className="text-center p-3 bg-chart-2/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-chart-2 mx-auto mb-2" />
                  <div className="text-2xl text-chart-2">{userStats.tablesCreated}</div>
                  <div className="text-sm text-muted-foreground">Tables Created</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-chart-3/10 rounded-lg">
                  <Clock className="w-6 h-6 text-chart-3 mx-auto mb-2" />
                  <div className="text-2xl text-chart-3">{userStats.totalActiveDays}</div>
                  <div className="text-sm text-muted-foreground">Active Days</div>
                </div>
                
                <div className="text-center p-3 bg-destructive/10 rounded-lg">
                  <X className="w-6 h-6 text-destructive mx-auto mb-2" />
                  <div className="text-2xl text-destructive">{userStats.cancellations}</div>
                  <div className="text-sm text-muted-foreground">Cancellations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game History */}
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <button 
                onClick={() => setCurrentView('game-history')}
                className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors text-left min-h-[80px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="text-card-foreground">Game History</h3>
                    <p className="text-sm text-muted-foreground">Your completed poker games</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comments</span>
                </CardTitle>
                
                {!isCurrentUserProfile && (
                  <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
                        Add Comment
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-sm mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-card-foreground">Add Comment</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Share your experience playing poker with other players.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-card-foreground">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setNewRating(star)}
                              className="text-2xl transition-colors"
                            >
                              <Star 
                                className={`w-6 h-6 ${
                                  star <= newRating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-card-foreground">Comment</label>
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your experience..."
                          className="bg-input-background border-border min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          onClick={handleAddComment}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]"
                        >
                          Post Comment
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowCommentDialog(false)}
                          className="bg-card hover:bg-accent border-border min-h-[44px]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-card-foreground mb-2">No comments yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Be the first to share your experience playing with other players.
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => handleUserClick(comment.reviewerId)}
                        className="flex-shrink-0"
                      >
                        <Avatar className="w-10 h-10 hover:ring-2 hover:ring-primary transition-all">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-chart-1 text-background">
                            {comment.reviewerAvatar}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex items-baseline space-x-2">
                            <button
                              onClick={() => handleUserClick(comment.reviewerId)}
                              className="text-card-foreground text-sm hover:text-primary transition-colors"
                            >
                              {comment.reviewerName}
                            </button>
                            <UserStatusPill isCorporate={comment.isCorporate || false} />
                          </div>
                          {renderStars(comment.rating)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {comment.comment}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          {comment.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}