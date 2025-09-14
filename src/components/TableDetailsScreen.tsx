import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  Star,
  MessageSquare,
  Navigation,
  Share2,
  ChevronDown,
  Trophy,
  Timer,
  Target,
  TrendingUp,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Check
} from 'lucide-react';

interface TableDetailsScreenProps {
  tableId: string | null;
  onBack: () => void;
  onJoinChat: (tableId: string) => void;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  isOnline: boolean;
  joinTime?: string;
}

interface TableDetails {
  id: string;
  name: string;
  type: 'cash' | 'tournament';
  gameType: 'nlh' | 'plo' | 'lhe';
  stakes: string;
  buyIn: string;
  buyInMin?: number;
  buyInMax?: number;
  location: string;
  address: string;
  distance: number;
  seatsAvailable: number;
  totalSeats: number;
  isLive: boolean;
  startTime?: string;
  rating: number;
  description: string;
  rules: string[];
  players: Player[];
  
  // Tournament-specific fields
  tournamentStructure?: {
    blindLevelDuration: string;
    timeBank: string;
    levels: Array<{
      level: number;
      smallBlind: number;
      bigBlind: number;
      ante?: number;
    }>;
  };
  schedule?: {
    startTime: string;
    expectedDuration: string;
    registrationDeadline: string;
  };
}

const mockTableDetails: TableDetails = {
  id: '1',
  name: 'Weekend Championship Tournament',
  type: 'tournament',
  gameType: 'nlh',
  stakes: 'No Limit Hold\'em',
  buyIn: '$500 + $50',
  buyInMin: 550,
  buyInMax: 550,
  location: 'Grand Casino Resort',
  address: '123 Casino Blvd, Downtown',
  distance: 1.2,
  seatsAvailable: 45,
  totalSeats: 200,
  isLive: false,
  startTime: '8:00 PM',
  rating: 4.8,
  description: 'Join our premier weekend tournament featuring a $100K guaranteed prize pool. This tournament attracts skilled players from across the region and offers an excellent opportunity to test your skills in a competitive environment.',
  rules: [
    'No cell phones at the table during play',
    'English only at the table',
    'Players must act in turn',
    'String bets are not allowed',
    'One player per hand rule enforced',
    'Proper poker etiquette required'
  ],
  players: [
    { id: '1', name: 'Alex Rodriguez', avatar: 'AR', rating: 4.5, isOnline: true, joinTime: '7:30 PM' },
    { id: '2', name: 'Sarah Johnson', avatar: 'SJ', rating: 4.2, isOnline: true, joinTime: '7:45 PM' },
    { id: '3', name: 'Mike Chen', avatar: 'MC', rating: 4.7, isOnline: false, joinTime: '8:00 PM' },
    { id: '4', name: 'Emma Wilson', avatar: 'EW', rating: 4.1, isOnline: true, joinTime: '8:15 PM' },
    { id: '5', name: 'David Kim', avatar: 'DK', rating: 4.6, isOnline: true, joinTime: '8:30 PM' },
    { id: '6', name: 'Lisa Brown', avatar: 'LB', rating: 4.3, isOnline: false, joinTime: '8:45 PM' },
    { id: '7', name: 'Tom Anderson', avatar: 'TA', rating: 4.4, isOnline: true, joinTime: '9:00 PM' },
    { id: '8', name: 'Rachel Green', avatar: 'RG', rating: 4.0, isOnline: true, joinTime: '9:15 PM' }
  ],
  tournamentStructure: {
    blindLevelDuration: '20 minutes',
    timeBank: '30 seconds per decision',
    levels: [
      { level: 1, smallBlind: 25, bigBlind: 50 },
      { level: 2, smallBlind: 50, bigBlind: 100 },
      { level: 3, smallBlind: 75, bigBlind: 150 },
      { level: 4, smallBlind: 100, bigBlind: 200, ante: 25 },
      { level: 5, smallBlind: 150, bigBlind: 300, ante: 25 },
      { level: 6, smallBlind: 200, bigBlind: 400, ante: 50 },
    ]
  },
  schedule: {
    startTime: 'Saturday 8:00 PM EST',
    expectedDuration: '6-8 hours',
    registrationDeadline: 'Saturday 7:45 PM EST'
  }
};

export function TableDetailsScreen({ tableId, onBack, onJoinChat }: TableDetailsScreenProps) {
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // In a real app, fetch table details by tableId
  const table = mockTableDetails;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyLink = () => {
    const tableUrl = `${window.location.origin}/table/${table.id}`;
    navigator.clipboard.writeText(tableUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleSocialShare = (platform: string) => {
    const tableUrl = `${window.location.origin}/table/${table.id}`;
    const text = `Join me at ${table.name} - ${table.stakes} poker game!`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tableUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(tableUrl)}`,
      instagram: tableUrl // Instagram doesn't support direct sharing URLs
    };
    
    if (platform !== 'instagram') {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'fill-chart-3 text-chart-3' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const visiblePlayers = showAllPlayers ? table.players : table.players.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-primary-foreground truncate">
              {table.name}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              {table.isLive ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-pulse">
                  LIVE
                </Badge>
              ) : (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    table.type === 'tournament' 
                      ? 'border-orange-500/30 text-orange-400' 
                      : 'border-chart-1/30 text-chart-1'
                  }`}
                >
                  {table.type === 'tournament' ? 'Tournament' : 'Cash Game'}
                </Badge>
              )}
              
              <div className="flex items-center space-x-1">
                {renderStars(table.rating)}
                <span className="text-xs text-primary-foreground/80">{table.rating}</span>
              </div>
            </div>
          </div>
          
          <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Share Table</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Share this poker table with friends via link or social media.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Copy Link */}
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full bg-card hover:bg-accent border-border justify-start"
                >
                  {linkCopied ? (
                    <Check className="w-4 h-4 mr-3 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-3" />
                  )}
                  {linkCopied ? 'Link Copied!' : 'Copy Link'}
                </Button>

                <Separator className="bg-border" />

                {/* Social Share Options */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Share on social media</p>
                  
                  <Button
                    onClick={() => handleSocialShare('facebook')}
                    variant="outline"
                    className="w-full bg-card hover:bg-accent border-border justify-start"
                  >
                    <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                    Share on Facebook
                  </Button>
                  
                  <Button
                    onClick={() => handleSocialShare('twitter')}
                    variant="outline"
                    className="w-full bg-card hover:bg-accent border-border justify-start"
                  >
                    <Twitter className="w-4 h-4 mr-3 text-blue-400" />
                    Share on Twitter
                  </Button>
                  
                  <Button
                    onClick={() => handleSocialShare('instagram')}
                    variant="outline"
                    className="w-full bg-card hover:bg-accent border-border justify-start"
                  >
                    <Instagram className="w-4 h-4 mr-3 text-pink-500" />
                    Share on Instagram
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 pb-20">
        {/* Summary Tiles */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-chart-1 mx-auto mb-2" />
              <div className="text-lg font-bold text-card-foreground">{table.stakes}</div>
              <div className="text-xs text-muted-foreground">Game Type</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-chart-2 mx-auto mb-2" />
              <div className="text-lg font-bold text-card-foreground">
                {table.seatsAvailable}/{table.totalSeats}
              </div>
              <div className="text-xs text-muted-foreground">Seats Available</div>
            </CardContent>
          </Card>
          
          {table.type === 'tournament' && table.schedule && (
            <>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-chart-3 mx-auto mb-2" />
                  <div className="text-lg font-bold text-card-foreground">{table.schedule.startTime.split(' ')[1]}</div>
                  <div className="text-xs text-muted-foreground">Start Time</div>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Timer className="w-6 h-6 text-chart-4 mx-auto mb-2" />
                  <div className="text-lg font-bold text-card-foreground">{table.schedule.expectedDuration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </CardContent>
              </Card>
            </>
          )}
          
          {table.type === 'cash' && (
            <Card className="bg-card border-border col-span-2">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 text-chart-5 mx-auto mb-2" />
                <div className="text-lg font-bold text-card-foreground">{table.buyIn}</div>
                <div className="text-xs text-muted-foreground">Buy-in Range</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tournament Schedule (Tournament only) */}
        {table.type === 'tournament' && table.schedule && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-chart-3" />
                <span>Tournament Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Start Time</span>
                <span className="text-sm font-medium text-card-foreground">{table.schedule.startTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expected Duration</span>
                <span className="text-sm font-medium text-card-foreground">{table.schedule.expectedDuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registration Deadline</span>
                <span className="text-sm font-medium text-card-foreground">{table.schedule.registrationDeadline}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Buy-in</span>
                <span className="text-sm font-medium text-card-foreground">{table.buyIn}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tournament Structure (Tournament only) */}
        {table.type === 'tournament' && table.tournamentStructure && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-chart-4" />
                <span>Tournament Structure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Level Duration</span>
                <span className="text-sm font-medium text-card-foreground">{table.tournamentStructure.blindLevelDuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time Bank</span>
                <span className="text-sm font-medium text-card-foreground">{table.tournamentStructure.timeBank}</span>
              </div>

              <Collapsible open={showStructure} onOpenChange={setShowStructure}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full bg-card hover:bg-accent border-border">
                    <span>Blind Level Structure</span>
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showStructure ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-3">
                  <div className="space-y-2">
                    {table.tournamentStructure.levels.map((level) => (
                      <div key={level.level} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm font-medium">Level {level.level}</span>
                        <span className="text-sm text-muted-foreground">
                          {level.smallBlind}/{level.bigBlind}
                          {level.ante && ` (${level.ante})`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-card-foreground">{table.location}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {table.address} • {table.distance} mi away
                </p>
              </div>
              
              <Button size="sm" variant="outline" className="bg-card hover:bg-accent border-border">
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-card-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {table.description}
            </p>
          </CardContent>
        </Card>

        {/* Players List - Expandable */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-card-foreground flex items-center space-x-2">
              <Users className="w-5 h-5 text-chart-2" />
              <span>Players ({table.players.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visiblePlayers.map((player) => (
              <div key={player.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-chart-1 text-background">
                      {player.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                    player.isOnline ? 'bg-green-500' : 'bg-muted-foreground'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-card-foreground text-sm">{player.name}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className="flex space-x-0.5">
                      {renderStars(player.rating)}
                    </div>
                    <span className="text-xs text-muted-foreground">{player.rating}</span>
                    {player.joinTime && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">Joined {player.joinTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {table.players.length > 4 && (
              <Button 
                variant="outline" 
                className="w-full bg-card hover:bg-accent border-border"
                onClick={() => setShowAllPlayers(!showAllPlayers)}
              >
                {showAllPlayers ? 'Show Less' : `Show ${table.players.length - 4} More Players`}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Rules */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-card-foreground">Table Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {table.rules.map((rule, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-chart-1 mr-2 mt-1">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-area-pb">
        <div className="flex space-x-3 max-w-md mx-auto">
          <Button
            variant="outline"
            className="flex-1 bg-card hover:bg-accent border-border"
            onClick={() => onJoinChat(table.id)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
          
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={table.seatsAvailable === 0}
          >
            {table.seatsAvailable === 0 ? 'Table Full' : 'Make a Reservation'}
          </Button>
        </div>
      </div>
    </div>
  );
}