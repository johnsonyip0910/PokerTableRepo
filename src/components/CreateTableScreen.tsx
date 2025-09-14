import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Calendar as CalendarIcon,
  Plus,
  Minus,
  AlertCircle,
  Check,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { validateDate, combineDateAndTime, isDateTimeInFuture, getCurrentISOTimestamp } from '../utils/dateValidation';

interface CreateTableScreenProps {
  onBack: () => void;
  onTableCreated: (tableId: string, table?: any) => void;
}

interface Player {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  isOnline: boolean;
}

interface TableFormData {
  name: string;
  type: 'cash' | 'tournament';
  gameType: 'nlh' | 'plo' | 'lhe';
  tableSize: '6max' | '9max';
  location: string;
  address: string;
  description: string;
  isPrivate: boolean;
  
  // Date & Time
  selectedDate: Date | undefined;
  selectedTime: string;
  
  // Invited players
  invitedPlayers: Player[];
  
  // Cash game specific
  stakes: string;
  buyInMin: number;
  buyInMax: number;
  
  // Tournament specific
  buyIn: number;
  fee: number;
  startingChips: number;
  minPlayers: number;
  maxPlayers: number;
  startDate: string;
  startTime: string;
  registrationDeadline: string;
  blindLevelDuration: number;
  
  // Blind structure for tournaments
  blindLevels: Array<{
    level: number;
    smallBlind: number;
    bigBlind: number;
    ante?: number;
  }>;
}

// Mock player data
const mockPlayers: Player[] = [
  { id: '1', name: 'Alex Rodriguez', email: 'alex@example.com', avatar: 'AR', rating: 4.5, isOnline: true },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: 'SJ', rating: 4.2, isOnline: true },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', avatar: 'MC', rating: 4.7, isOnline: false },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', avatar: 'EW', rating: 4.1, isOnline: true },
  { id: '5', name: 'David Kim', email: 'david@example.com', avatar: 'DK', rating: 4.6, isOnline: false },
  { id: '6', name: 'Lisa Garcia', email: 'lisa@example.com', avatar: 'LG', rating: 4.4, isOnline: true },
  { id: '7', name: 'Tom Brown', email: 'tom@example.com', avatar: 'TB', rating: 4.0, isOnline: false },
  { id: '8', name: 'Amy Davis', email: 'amy@example.com', avatar: 'AD', rating: 4.3, isOnline: true },
];

const initialFormData: TableFormData = {
  name: '',
  type: 'cash',
  gameType: 'nlh',
  tableSize: '9max',
  location: '',
  address: '',
  description: '',
  isPrivate: false,
  selectedDate: undefined,
  selectedTime: '',
  invitedPlayers: [],
  stakes: '',
  buyInMin: 100,
  buyInMax: 500,
  buyIn: 50,
  fee: 5,
  startingChips: 5000,
  minPlayers: 6,
  maxPlayers: 120,
  startDate: '',
  startTime: '',
  registrationDeadline: '',
  blindLevelDuration: 20,
  blindLevels: [
    { level: 1, smallBlind: 25, bigBlind: 50 },
    { level: 2, smallBlind: 50, bigBlind: 100 },
    { level: 3, smallBlind: 75, bigBlind: 150 },
    { level: 4, smallBlind: 100, bigBlind: 200, ante: 25 },
  ]
};

export function CreateTableScreen({ onBack, onTableCreated }: CreateTableScreenProps) {
  const [formData, setFormData] = useState<TableFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteSectionOpen, setIsInviteSectionOpen] = useState(false);

  const updateFormData = (key: keyof TableFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  // Generate time options (24-hour format, converted to 12-hour display)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayTime = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
        times.push({ value: timeValue, display: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Filter players based on search query
  const filteredPlayers = mockPlayers.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addBlindLevel = () => {
    const newLevel = {
      level: formData.blindLevels.length + 1,
      smallBlind: formData.blindLevels[formData.blindLevels.length - 1]?.bigBlind || 100,
      bigBlind: (formData.blindLevels[formData.blindLevels.length - 1]?.bigBlind || 100) * 2,
      ante: formData.blindLevels.length >= 3 ? Math.floor(formData.blindLevels[formData.blindLevels.length - 1]?.bigBlind / 4) : undefined
    };
    
    setFormData(prev => ({
      ...prev,
      blindLevels: [...prev.blindLevels, newLevel]
    }));
  };

  const removeBlindLevel = (index: number) => {
    if (formData.blindLevels.length > 1) {
      setFormData(prev => ({
        ...prev,
        blindLevels: prev.blindLevels.filter((_, i) => i !== index)
      }));
    }
  };

  const updateBlindLevel = (index: number, field: keyof typeof formData.blindLevels[0], value: number) => {
    setFormData(prev => ({
      ...prev,
      blindLevels: prev.blindLevels.map((level, i) => 
        i === index ? { ...level, [field]: value } : level
      )
    }));
  };

  const togglePlayerInvite = (player: Player) => {
    const isAlreadyInvited = formData.invitedPlayers.some(p => p.id === player.id);
    
    if (isAlreadyInvited) {
      setFormData(prev => ({
        ...prev,
        invitedPlayers: prev.invitedPlayers.filter(p => p.id !== player.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        invitedPlayers: [...prev.invitedPlayers, player]
      }));
    }
  };

  const removeInvitedPlayer = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      invitedPlayers: prev.invitedPlayers.filter(p => p.id !== playerId)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Table name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Date & Time validation with proper validation
    if (!formData.selectedDate) {
      newErrors.selectedDate = 'Date is required';
    } else {
      // Validate the selected date is valid
      const validDate = validateDate(formData.selectedDate);
      if (!validDate) {
        newErrors.selectedDate = 'Invalid date selected';
      }
    }

    if (!formData.selectedTime) {
      newErrors.selectedTime = 'Time is required';
    }

    // Combined date/time validation
    if (formData.selectedDate && formData.selectedTime) {
      const combinedDateTime = combineDateAndTime(formData.selectedDate, formData.selectedTime);
      if (!combinedDateTime) {
        newErrors.selectedTime = 'Invalid date or time combination';
      } else {
        // Check if the datetime is in the future
        if (!isDateTimeInFuture(formData.selectedDate, formData.selectedTime)) {
          newErrors.selectedTime = 'Table start time must be in the future';
        }
      }
    }

    // Private table validation
    if (formData.isPrivate && formData.invitedPlayers.length === 0) {
      newErrors.invitedPlayers = 'Private tables must have at least 1 invited player';
    }

    if (formData.type === 'cash') {
      if (!formData.stakes.trim()) {
        newErrors.stakes = 'Stakes are required';
      }
      if (formData.buyInMin >= formData.buyInMax) {
        newErrors.buyInMin = 'Minimum buy-in must be less than maximum';
      }
    } else {
      if (formData.minPlayers >= formData.maxPlayers) {
        newErrors.minPlayers = 'Minimum players must be less than maximum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time into ISO format before sending
      const combinedDateTime = combineDateAndTime(formData.selectedDate, formData.selectedTime);
      
      if (!combinedDateTime) {
        toast.error('❌ Invalid date or time. Please check your inputs.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for backend with proper ISO datetime
      const tableData = {
        ...formData,
        starts_at: combinedDateTime, // Use ISO format for backend
        created_at: getCurrentISOTimestamp() // Add creation timestamp
      };

      console.log('Creating table with validated data:', tableData);
      
      // Send request to backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-488d2e05/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(tableData)
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create table');
      }
      
      console.log('Table created successfully:', result);
      
      // Show success toast
      toast.success('✅ Table created successfully');
      
      // Reset form
      setFormData(initialFormData);
      setErrors({});
      setSearchQuery('');
      setIsInviteSectionOpen(false);
      
      // Navigate back with the new table data
      onTableCreated(result.tableId, result.table);
    } catch (error) {
      console.error('Failed to create table:', error);
      
      // Show error toast with more specific message
      const errorMessage = error instanceof Error ? error.message : 'Failed to create table';
      if (errorMessage.toLowerCase().includes('date') || errorMessage.toLowerCase().includes('time')) {
        toast.error('❌ Invalid date or time. Please check your inputs.');
      } else {
        toast.error('⚠️ Failed to create table');
      }
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Fixed Header with Safe Area */}
      <div 
        className="flex-shrink-0 bg-primary px-4 pb-4 shadow-sm border-b border-primary-foreground/10"
        style={{
          paddingTop: `max(48px, calc(12px + env(safe-area-inset-top)))`
        }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors duration-200 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-primary-foreground">Create Table</h1>
        </div>
        
        <p className="text-primary-foreground/80 text-sm">
          Set up a new poker {formData.type === 'cash' ? 'cash game' : 'tournament'}
        </p>
      </div>

      {/* Scrollable Form Content with Full Height */}
      <div className="flex-1 flex flex-col min-h-0">
        <div 
          className="flex-1 overflow-y-auto overscroll-behavior-y-contain" 
          style={{ 
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="px-4 py-6 space-y-6"
            style={{
              paddingBottom: `max(104px, calc(80px + env(safe-area-inset-bottom) + 24px))`
            }}
          >
            {/* Table Type Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Table Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => updateFormData('type', 'cash')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm transition-all min-h-[44px] ${
                      formData.type === 'cash'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Cash Game
                  </button>
                  <button
                    onClick={() => updateFormData('type', 'tournament')}
                    className={`flex-1 py-3 px-4 rounded-md text-sm transition-all min-h-[44px] ${
                      formData.type === 'tournament'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Tournament
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="table-name" className="text-sm text-card-foreground">
                    Table Name *
                  </Label>
                  <Input
                    id="table-name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className={`bg-input-background border-border focus:border-primary min-h-[44px] ${
                      errors.name ? 'border-destructive' : ''
                    }`}
                    placeholder="Enter table name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center mt-1">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-card-foreground">
                      Game Type
                    </Label>
                    <Select value={formData.gameType} onValueChange={(value) => updateFormData('gameType', value)}>
                      <SelectTrigger className="bg-input-background border-border min-h-[44px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="nlh">NL Hold'em</SelectItem>
                        <SelectItem value="plo">PLO</SelectItem>
                        <SelectItem value="lhe">Limit Hold'em</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-card-foreground">
                      Table Size
                    </Label>
                    <Select value={formData.tableSize} onValueChange={(value) => updateFormData('tableSize', value)}>
                      <SelectTrigger className="bg-input-background border-border min-h-[44px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="6max">6-Max</SelectItem>
                        <SelectItem value="9max">9-Max</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm text-card-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    className="bg-input-background border-border focus:border-primary min-h-[80px]"
                    placeholder="Describe your table (optional)"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <Label htmlFor="private-table" className="text-sm text-card-foreground">
                      Private Table
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Only invited players can join
                    </p>
                  </div>
                  <Switch
                    id="private-table"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => {
                      updateFormData('isPrivate', checked);
                      // Open invite section when private is enabled
                      if (checked) {
                        setIsInviteSectionOpen(true);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Invite Players Section */}
            {formData.isPrivate && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <Collapsible open={isInviteSectionOpen} onOpenChange={setIsInviteSectionOpen}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between p-0 h-auto hover:bg-transparent min-h-[44px]"
                      >
                        <CardTitle className="text-card-foreground flex items-center space-x-2">
                          <Users className="w-5 h-5" />
                          <span>Invite Players</span>
                          {formData.invitedPlayers.length > 0 && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {formData.invitedPlayers.length}
                            </Badge>
                          )}
                        </CardTitle>
                        {isInviteSectionOpen ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="space-y-4 pt-4">
                        {/* Search Bar */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email"
                            className="pl-10 bg-input-background border-border focus:border-primary min-h-[44px]"
                          />
                        </div>

                        {/* Selected Players Preview */}
                        {formData.invitedPlayers.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm text-card-foreground">Selected Players</Label>
                            <div className="flex flex-wrap gap-2">
                              {formData.invitedPlayers.map((player) => (
                                <div
                                  key={player.id}
                                  className="flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1"
                                >
                                  <Avatar className="w-5 h-5">
                                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                      {player.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-card-foreground">{player.name}</span>
                                  <button
                                    onClick={() => removeInvitedPlayer(player.id)}
                                    className="w-4 h-4 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
                                  >
                                    <X className="w-2 h-2" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Player List */}
                        <div className="space-y-2">
                          <Label className="text-sm text-card-foreground">Available Players</Label>
                          <div 
                            className="max-h-48 overflow-y-auto space-y-2 border border-border rounded-lg p-2"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                          >
                            {filteredPlayers.map((player) => {
                              const isInvited = formData.invitedPlayers.some(p => p.id === player.id);
                              return (
                                <div
                                  key={player.id}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer min-h-[60px]"
                                  onClick={() => togglePlayerInvite(player)}
                                >
                                  <Checkbox
                                    checked={isInvited}
                                    onChange={() => togglePlayerInvite(player)}
                                    className="cursor-pointer"
                                  />
                                  
                                  <div className="relative">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="bg-chart-1 text-background text-sm">
                                        {player.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                                      player.isOnline ? 'bg-green-500' : 'bg-muted-foreground'
                                    }`} />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <h4 className="text-sm text-card-foreground">{player.name}</h4>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex space-x-0.5">
                                        {renderStars(player.rating)}
                                      </div>
                                      <span className="text-xs text-muted-foreground">{player.rating}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {filteredPlayers.length === 0 && (
                              <div className="text-center py-4 text-muted-foreground text-sm">
                                No players found
                              </div>
                            )}
                          </div>
                        </div>

                        {errors.invitedPlayers && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.invitedPlayers}
                          </p>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </CardHeader>
              </Card>
            )}

            {/* Location */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm text-card-foreground">
                    Venue Name *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className={`bg-input-background border-border focus:border-primary min-h-[44px] ${
                      errors.location ? 'border-destructive' : ''
                    }`}
                    placeholder="e.g., Downtown Poker Club"
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive flex items-center mt-1">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm text-card-foreground">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="bg-input-background border-border focus:border-primary min-h-[44px]"
                    placeholder="Street address (optional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Date & Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label className="text-sm text-card-foreground">
                      Date *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start bg-input-background border-border hover:bg-accent min-h-[44px] ${
                            errors.selectedDate ? 'border-destructive' : ''
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.selectedDate ? (
                            formData.selectedDate.toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.selectedDate}
                          onSelect={(date) => updateFormData('selectedDate', date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.selectedDate && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.selectedDate}
                      </p>
                    )}
                  </div>

                  {/* Time Picker */}
                  <div className="space-y-2">
                    <Label className="text-sm text-card-foreground">
                      Time *
                    </Label>
                    <Select 
                      value={formData.selectedTime} 
                      onValueChange={(value) => updateFormData('selectedTime', value)}
                    >
                      <SelectTrigger className={`bg-input-background border-border min-h-[44px] ${
                        errors.selectedTime ? 'border-destructive' : ''
                      }`}>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border max-h-60">
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.display}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.selectedTime && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.selectedTime}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Details - Cash Game */}
            {formData.type === 'cash' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Cash Game Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="stakes" className="text-sm text-card-foreground">
                      Stakes *
                    </Label>
                    <Input
                      id="stakes"
                      value={formData.stakes}
                      onChange={(e) => updateFormData('stakes', e.target.value)}
                      className={`bg-input-background border-border focus:border-primary min-h-[44px] ${
                        errors.stakes ? 'border-destructive' : ''
                      }`}
                      placeholder="e.g., $2/$5 NL"
                    />
                    {errors.stakes && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.stakes}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buy-in-min" className="text-sm text-card-foreground">
                        Min Buy-in ($)
                      </Label>
                      <Input
                        id="buy-in-min"
                        type="number"
                        value={formData.buyInMin}
                        onChange={(e) => updateFormData('buyInMin', parseInt(e.target.value) || 0)}
                        className={`bg-input-background border-border focus:border-primary min-h-[44px] ${
                          errors.buyInMin ? 'border-destructive' : ''
                        }`}
                        min="1"
                      />
                      {errors.buyInMin && (
                        <p className="text-sm text-destructive flex items-center mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.buyInMin}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buy-in-max" className="text-sm text-card-foreground">
                        Max Buy-in ($)
                      </Label>
                      <Input
                        id="buy-in-max"
                        type="number"
                        value={formData.buyInMax}
                        onChange={(e) => updateFormData('buyInMax', parseInt(e.target.value) || 0)}
                        className="bg-input-background border-border focus:border-primary min-h-[44px]"
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Game Details - Tournament */}
            {formData.type === 'tournament' && (
              <>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span>Tournament Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="buy-in" className="text-sm text-card-foreground">
                          Buy-in ($)
                        </Label>
                        <Input
                          id="buy-in"
                          type="number"
                          value={formData.buyIn}
                          onChange={(e) => updateFormData('buyIn', parseInt(e.target.value) || 0)}
                          className="bg-input-background border-border focus:border-primary min-h-[44px]"
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fee" className="text-sm text-card-foreground">
                          Fee ($)
                        </Label>
                        <Input
                          id="fee"
                          type="number"
                          value={formData.fee}
                          onChange={(e) => updateFormData('fee', parseInt(e.target.value) || 0)}
                          className="bg-input-background border-border focus:border-primary min-h-[44px]"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="starting-chips" className="text-sm text-card-foreground">
                        Starting Chips
                      </Label>
                      <Input
                        id="starting-chips"
                        type="number"
                        value={formData.startingChips}
                        onChange={(e) => updateFormData('startingChips', parseInt(e.target.value) || 0)}
                        className="bg-input-background border-border focus:border-primary min-h-[44px]"
                        min="100"
                        step="100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-players" className="text-sm text-card-foreground">
                          Min Players
                        </Label>
                        <Input
                          id="min-players"
                          type="number"
                          value={formData.minPlayers}
                          onChange={(e) => updateFormData('minPlayers', parseInt(e.target.value) || 0)}
                          className={`bg-input-background border-border focus:border-primary min-h-[44px] ${
                            errors.minPlayers ? 'border-destructive' : ''
                          }`}
                          min="2"
                        />
                        {errors.minPlayers && (
                          <p className="text-sm text-destructive flex items-center mt-1">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.minPlayers}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max-players" className="text-sm text-card-foreground">
                          Max Players
                        </Label>
                        <Input
                          id="max-players"
                          type="number"
                          value={formData.maxPlayers}
                          onChange={(e) => updateFormData('maxPlayers', parseInt(e.target.value) || 0)}
                          className="bg-input-background border-border focus:border-primary min-h-[44px]"
                          min="2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blind-duration" className="text-sm text-card-foreground">
                        Blind Level Duration (minutes)
                      </Label>
                      <Input
                        id="blind-duration"
                        type="number"
                        value={formData.blindLevelDuration}
                        onChange={(e) => updateFormData('blindLevelDuration', parseInt(e.target.value) || 0)}
                        className="bg-input-background border-border focus:border-primary min-h-[44px]"
                        min="1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Blind Structure */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Blind Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.blindLevels.map((level, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Level {level.level}</Label>
                            <div className="text-sm text-card-foreground">Small: ${level.smallBlind}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Big Blind</Label>
                            <div className="text-sm text-card-foreground">${level.bigBlind}</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Ante</Label>
                            <div className="text-sm text-card-foreground">${level.ante || 0}</div>
                          </div>
                        </div>
                        
                        {formData.blindLevels.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBlindLevel(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] min-w-[44px]"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={addBlindLevel}
                      className="w-full bg-card hover:bg-accent border-border min-h-[44px]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Blind Level
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div 
          className="flex-shrink-0 bg-background border-t border-border px-4 py-4"
          style={{
            paddingBottom: `max(16px, env(safe-area-inset-bottom))`
          }}
        >
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[56px]"
          >
            {isSubmitting ? 'Creating Table...' : 'Create Table'}
          </Button>
        </div>
      </div>
    </div>
  );
}