import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { AdBanner } from './AdBanner';
import { 
  Trophy, 
  Star,
  MessageCircle,
  Crown,
  BarChart3,
  XCircle,
  UserPlus,
  Clock,
  X,
  ArrowLeft
} from 'lucide-react';
import { UserStatusPill } from './UserStatusPill';
import { getUserById, getCommentsForUser, getAverageRating, UserProfile, UserReview } from './UserDataStore';

interface ProfileViewerScreenProps {
  userId: string;
  onBack: () => void;
  isCurrentUserProfile?: boolean;
}

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

export function ProfileViewerScreen({ userId, onBack, isCurrentUserProfile = false }: ProfileViewerScreenProps) {
  const user = getUserById(userId);
  const [comments, setComments] = useState(getCommentsForUser(userId));
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const averageRating = getAverageRating(comments);

  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* AdBanner at very top */}
        <div 
          className="flex-shrink-0"
          style={{
            paddingTop: `env(safe-area-inset-top, 0px)`
          }}
        >
          <AdBanner type="header" className="w-full" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 bg-primary px-4 py-3 min-h-[48px]">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg text-primary-foreground">Profile Not Found</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-card-foreground text-xl mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested user profile could not be found.</p>
            <Button onClick={onBack} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate tier based on user stats
  const totalActivity = user.stats.tablesJoined + user.stats.tablesCreated + (user.stats.totalActiveDays * 2);
  const currentTier = tiers.reverse().find(tier => tier.level === getTierLevel(user.tier)) || tiers[0];
  const nextTier = tiers.find(tier => tier.level === currentTier.level + 1);

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

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* AdBanner at very top */}
      <div 
        className="flex-shrink-0"
        style={{
          paddingTop: `env(safe-area-inset-top, 0px)`
        }}
      >
        <AdBanner type="header" className="w-full" />
      </div>

      {/* Blue Header with Profile Info */}
      <div className="flex-shrink-0 bg-primary px-4 py-3 min-h-[48px]">
        {/* Back button and title */}
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg text-primary-foreground">Player Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-chart-1 text-background text-2xl">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-baseline space-x-2 mb-1">
              <h2 className="text-xl text-primary-foreground">{user.name}</h2>
              <UserStatusPill isCorporate={user.isCorporate || false} />
            </div>
            <p className="text-primary-foreground/80 text-sm mb-2">Member since {user.memberSince}</p>
            
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
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
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
                  <div className="text-2xl text-chart-1">{user.stats.tablesJoined}</div>
                  <div className="text-sm text-muted-foreground">Tables Joined</div>
                </div>
                
                <div className="text-center p-3 bg-chart-2/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-chart-2 mx-auto mb-2" />
                  <div className="text-2xl text-chart-2">{user.stats.tablesCreated}</div>
                  <div className="text-sm text-muted-foreground">Tables Created</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-chart-3/10 rounded-lg">
                  <Clock className="w-6 h-6 text-chart-3 mx-auto mb-2" />
                  <div className="text-2xl text-chart-3">{user.stats.totalActiveDays}</div>
                  <div className="text-sm text-muted-foreground">Active Days</div>
                </div>
                
                <div className="text-center p-3 bg-destructive/10 rounded-lg">
                  <X className="w-6 h-6 text-destructive mx-auto mb-2" />
                  <div className="text-2xl text-destructive">{user.stats.cancellations}</div>
                  <div className="text-sm text-muted-foreground">Cancellations</div>
                </div>
              </div>
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
                          Share your experience playing poker with this player.
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
                    This player hasn't received any comments yet.
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-chart-1 text-background">
                          {comment.reviewerAvatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex items-baseline space-x-2">
                            <h4 className="text-card-foreground text-sm">{comment.reviewerName}</h4>
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

// Helper function to convert tier name to level number
function getTierLevel(tierName: string): number {
  const tierMap: Record<string, number> = {
    'Bronze': 1,
    'Bronze+': 2,
    'Silver': 3,
    'Silver+': 4,
    'Gold': 5,
    'Gold+': 6,
    'Platinum': 7,
    'Platinum+': 8,
    'Diamond': 9,
    'Legend': 10
  };
  return tierMap[tierName] || 1;
}