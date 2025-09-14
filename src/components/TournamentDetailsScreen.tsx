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
  Star,
  MessageSquare,
  Navigation,
  Share2,
  ChevronDown,
  Copy,
  Facebook,
  MessageCircle,
  Instagram,
  Check,
  Calendar,
  Trophy,
  Timer,
  DollarSign
} from 'lucide-react';
import { getTableByIdWithFallback, isTournamentTable, type TournamentDetails } from './TableDataStore';

interface TournamentDetailsScreenProps {
  tableId: string | null;
  onBack: () => void;
  onJoinChat: (tableId: string) => void;
}

export function TournamentDetailsScreen({ tableId, onBack, onJoinChat }: TournamentDetailsScreenProps) {
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Get table data from store with fallback for generated tables
  const tableData = tableId ? getTableByIdWithFallback(tableId, 'tournament', 'Tournament') : null;
  const table = tableData && isTournamentTable(tableData) ? tableData : null;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If no table data found and no fallback possible, show error state
  if (!table) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="bg-primary px-4 pt-12 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg text-primary-foreground">Tournament Not Found</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl text-card-foreground mb-2">Tournament Not Available</h2>
            <p className="text-muted-foreground mb-4">This tournament is no longer available.</p>
            <Button onClick={onBack} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Tables
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    const tableUrl = `${window.location.origin}/tournament/${table.id}`;
    navigator.clipboard.writeText(tableUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleSocialShare = (platform: string) => {
    const tableUrl = `${window.location.origin}/tournament/${table.id}`;
    const text = `Join me at ${table.name} - ${table.gameTypeFull} tournament!`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tableUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${tableUrl}`)}`,
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

  // Format buy-in consistently with TableCard (total of entry + fee)
  const formatBuyIn = () => {
    const total = (table.entry || 0) + (table.fee || 0);
    return `${table.currency}${total}`;
  };

  // Format players consistently with TableCard
  const formatPlayers = () => {
    return `${table.playersRegistered}/${table.playerCap}`;
  };

  // Format start time consistently with TableCard
  const formatStartTime = () => {
    return new Date(table.startTimeISO).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const visiblePlayers = showAllPlayers ? table.players : table.players.slice(0, 4);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-4 flex-shrink-0">
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
            <h1 className="text-lg text-primary-foreground truncate">
              {table.name}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                Tournament
              </Badge>
              {table.isLive && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-pulse">
                  LIVE
                </Badge>
              )}
              

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
                <DialogTitle className="text-card-foreground">Share Tournament</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Share this tournament with friends via link or social media.
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
                    onClick={() => handleSocialShare('whatsapp')}
                    variant="outline"
                    className="w-full bg-card hover:bg-accent border-border justify-start"
                  >
                    <MessageCircle className="w-4 h-4 mr-3" style={{ color: '#25D366' }} />
                    Share on WhatsApp
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

      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto"
        style={{ 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          className="px-4 py-4 space-y-4"
          style={{
            paddingBottom: `max(104px, calc(80px + env(safe-area-inset-bottom) + 24px))` // Fixed bottom actions + safe area
          }}
        >
          {/* Info Grid - IDENTICAL VALUES TO CARD */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 text-chart-1 mx-auto mb-2" />
                <div className="text-lg text-card-foreground">{table.gameTypeFull}</div>
                <div className="text-xs text-muted-foreground">Game Type</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-chart-2 mx-auto mb-2" />
                <div className="text-lg text-card-foreground">
                  {formatPlayers()}
                </div>
                <div className="text-xs text-muted-foreground">Players</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 text-chart-5 mx-auto mb-2" />
                <div className="text-lg text-card-foreground">
                  {formatBuyIn()}
                </div>
                <div className="text-xs text-muted-foreground">Buy-in</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-chart-3 mx-auto mb-2" />
                <div className="text-lg text-card-foreground">{formatStartTime()}</div>
                <div className="text-xs text-muted-foreground">Start Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Tournament Schedule */}
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
                <span className="text-sm text-card-foreground">{table.schedule.startTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expected Duration</span>
                <span className="text-sm text-card-foreground">{table.schedule.expectedDuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registration Deadline</span>
                <span className="text-sm text-card-foreground">{table.schedule.registrationDeadline}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Buy-in</span>
                <span className="text-sm text-card-foreground">{table.schedule.buyIn}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tournament Structure */}
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
                <span className="text-sm text-card-foreground">{table.structure.levelDuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time Bank</span>
                <span className="text-sm text-card-foreground">{table.structure.timeBank}</span>
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
                    {table.structure.blindLevels.map((level) => (
                      <div key={level.level} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Level {level.level}</span>
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

          {/* Location */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-card-foreground flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-chart-1" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-card-foreground">{table.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {table.address} • {table.distanceMiles.toFixed(1)} mi away
                  </p>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-card hover:bg-accent border-border"
                  onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=22.2819,114.1589&travelmode=driving', '_blank')}
                >
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
                    <h4 className="text-card-foreground text-sm">{player.name}</h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div className="flex space-x-0.5">
                        {renderStars(player.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">{player.rating}</span>
                      {player.registrationTime && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">Registered {player.registrationTime}</span>
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
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex-shrink-0 z-10"
        style={{
          paddingBottom: `max(16px, env(safe-area-inset-bottom))`
        }}
      >
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
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={(table.playersRegistered || 0) >= (table.playerCap || 0)}
          >
            {(table.playersRegistered || 0) >= (table.playerCap || 0) ? 'Tournament Full' : 'Make a Reservation'}
          </Button>
        </div>
      </div>
    </div>
  );
}