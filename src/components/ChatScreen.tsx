import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  Users, 
  Settings, 
  UserMinus,
  Flag,
  Volume2,
  VolumeX,
  Smile,
  Paperclip,
  Image,
  Mic,
  MicOff
} from 'lucide-react';

interface ChatScreenProps {
  tableId: string;
  tableName: string;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'action';
  isCurrentUser?: boolean;
}

interface ChatUser {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  isTyping?: boolean;
  isMuted?: boolean;
}

const mockUsers: ChatUser[] = [
  { id: '1', username: 'John Doe', avatar: 'JD', isOnline: true, isTyping: false },
  { id: '2', username: 'Alex Rodriguez', avatar: 'AR', isOnline: true, isTyping: true },
  { id: '3', username: 'Sarah Johnson', avatar: 'SJ', isOnline: true, isTyping: false },
  { id: '4', username: 'Mike Chen', avatar: 'MC', isOnline: false, isTyping: false },
  { id: '5', username: 'Emma Wilson', avatar: 'EW', isOnline: true, isTyping: false },
  { id: '6', username: 'David Kim', avatar: 'DK', isOnline: true, isTyping: false, isMuted: true },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'system',
    username: 'System',
    avatar: '',
    message: 'Welcome to Friday Night Cash table chat!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'system'
  },
  {
    id: '2',
    userId: 'system',
    username: 'System',
    avatar: '',
    message: 'Alex Rodriguez joined the table',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: 'system'
  },
  {
    id: '3',
    userId: '2',
    username: 'Alex Rodriguez',
    avatar: 'AR',
    message: 'Hey everyone! Good luck tonight 🤞',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'text'
  },
  {
    id: '4',
    userId: '3',
    username: 'Sarah Johnson',
    avatar: 'SJ',
    message: 'Thanks! Should be a fun game',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    type: 'text'
  },
  {
    id: '5',
    userId: '1',
    username: 'John Doe',
    avatar: 'JD',
    message: 'Anyone know if we\'re playing with a time bank?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'text',
    isCurrentUser: true
  },
  {
    id: '6',
    userId: '4',
    username: 'Mike Chen',
    avatar: 'MC',
    message: 'Yes, 30 seconds per decision',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    type: 'text'
  },
  {
    id: '7',
    userId: 'system',
    username: 'System',
    avatar: '',
    message: 'Emma Wilson joined the table',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'system'
  },
  {
    id: '8',
    userId: '5',
    username: 'Emma Wilson',
    avatar: 'EW',
    message: 'Hey all! Ready to play some poker? 🎰',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    type: 'text'
  },
  {
    id: '9',
    userId: '6',
    username: 'David Kim',
    avatar: 'DK',
    message: 'Nice hand Alex! Well played',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'text'
  },
  {
    id: '10',
    userId: '2',
    username: 'Alex Rodriguez',
    avatar: 'AR',
    message: 'Thanks! Got lucky on the river 😅',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    type: 'text'
  }
];

export function ChatScreen({ tableId, tableName, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [users] = useState<ChatUser[]>(mockUsers);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      username: 'John Doe',
      avatar: 'JD',
      message: currentMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      isCurrentUser: true
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setCurrentMessage(value);
    
    // Simulate typing indicator
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const onlineUsersCount = users.filter(user => user.isOnline).length;
  const typingUsers = users.filter(user => user.isTyping && user.id !== '1');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="font-bold text-primary-foreground">{tableName}</h1>
              <div className="flex items-center space-x-2 text-xs text-primary-foreground/80">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>{onlineUsersCount} online</span>
                </div>
                <span>•</span>
                <span>{users.length} total</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUserList(!showUserList)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Users className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                  <Settings className="w-4 h-4 mr-2" />
                  Chat Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-popover-foreground hover:bg-accent">
                  <Flag className="w-4 h-4 mr-2" />
                  Report Issue
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                  <UserMinus className="w-4 h-4 mr-2" />
                  Leave Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* User List (when expanded) */}
      {showUserList && (
        <div className="bg-card border-b border-border px-4 py-3">
          <h3 className="font-medium text-card-foreground mb-3">Players ({users.length})</h3>
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 bg-muted/50 rounded-full px-3 py-1">
                <div className="relative">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-chart-1 text-background text-xs">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-card ${
                    user.isOnline ? 'bg-green-400' : 'bg-muted-foreground'
                  }`} />
                </div>
                <span className="text-xs font-medium text-card-foreground">{user.username}</span>
                {user.isMuted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => {
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
          
          return (
            <div key={message.id}>
              {/* Date separator */}
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-muted px-3 py-1 rounded-full">
                    <span className="text-xs text-muted-foreground font-medium">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                </div>
              )}

              {/* System messages */}
              {message.type === 'system' ? (
                <div className="flex justify-center">
                  <div className="bg-muted/50 px-3 py-1 rounded-full">
                    <span className="text-xs text-muted-foreground">
                      {message.message}
                    </span>
                  </div>
                </div>
              ) : (
                /* Regular messages */
                <div className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex space-x-3 max-w-[80%] ${message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!message.isCurrentUser && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-chart-1 text-background text-xs">
                          {message.avatar}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`space-y-1 ${message.isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!message.isCurrentUser && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-card-foreground">
                            {message.username}
                          </span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            Player
                          </Badge>
                        </div>
                      )}
                      
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.isCurrentUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card border border-border text-card-foreground'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                      
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="bg-chart-2 text-background text-xs">
                  {typingUsers[0].avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="bg-card border border-border rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-20 bg-input-background border-border focus:border-primary resize-none"
              disabled={isMuted}
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <Image className="w-4 h-4" />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {currentMessage.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
              disabled={isMuted}
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="outline"
              className={`flex-shrink-0 ${isRecording ? 'bg-destructive text-destructive-foreground' : 'bg-card hover:bg-accent border-border'}`}
              onClick={() => setIsRecording(!isRecording)}
              disabled={isMuted}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {isMuted && (
          <div className="mt-2 text-center">
            <span className="text-xs text-muted-foreground">
              You are muted in this chat
            </span>
          </div>
        )}
      </div>
    </div>
  );
}