import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { PhoneNumberInput } from './PhoneNumberInput';

import { 
  ArrowLeft, 
  User, 
  Users,
  Bell, 
  LogOut, 
  ChevronRight,
  Check,
  Trash2,
  Crown,
  Calendar,
  Edit,
  Mail,
  MessageSquare,
  Shield,
  Trophy,
  Gift,
  AlertTriangle,
  TrendingUp,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  onHostModeChange?: (enabled: boolean) => void;
  onNavigateToHostDashboard?: () => void;
  onLogout: () => void;
}

type SettingsPage = 'main' | 'account' | 'notifications' | 'hostMode';

export function SettingsScreen({ onBack, onHostModeChange, onNavigateToHostDashboard, onLogout }: SettingsScreenProps) {
  const [currentPage, setCurrentPage] = useState<SettingsPage>('main');
  const [hostModeEnabled, setHostModeEnabled] = useState(false);
  
  // Profile field states with editing modes
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });
  
  const [editingStates, setEditingStates] = useState({
    fullName: false,
    email: false,
    phone: false
  });
  
  const [tempValues, setTempValues] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  
  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  // Account management modal states
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Settings states
  const [settings, setSettings] = useState({
    // Notification channels
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Notification types
    gameInvitations: true,
    tournamentUpdates: true,
    promotionalOffers: false,
    weeklyDigest: true,
    securityAlerts: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: SettingsPage) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    if (currentPage === 'main') {
      onBack();
    } else {
      setCurrentPage('main');
    }
  };

  const handleHostModeToggle = (enabled: boolean) => {
    setHostModeEnabled(enabled);
    if (onHostModeChange) {
      onHostModeChange(enabled);
    }
  };

  // Profile field editing handlers
  const startEditing = (field: 'fullName' | 'email' | 'phone') => {
    setEditingStates(prev => ({ ...prev, [field]: true }));
    setTempValues(prev => ({ ...prev, [field]: profileData[field] }));
    
    // Focus the input after state update
    setTimeout(() => {
      const input = document.getElementById(field);
      if (input) {
        input.focus();
      }
    }, 0);
  };

  const cancelEditing = (field: 'fullName' | 'email' | 'phone') => {
    setEditingStates(prev => ({ ...prev, [field]: false }));
    setTempValues(prev => ({ ...prev, [field]: '' }));
  };

  const saveField = (field: 'fullName' | 'email' | 'phone') => {
    if (tempValues[field].trim()) {
      setProfileData(prev => ({ ...prev, [field]: tempValues[field] }));
      setEditingStates(prev => ({ ...prev, [field]: false }));
      setTempValues(prev => ({ ...prev, [field]: '' }));
      
      // Show success toast
      toast.success('✅ Profile updated successfully', {
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none'
        },
        duration: 3000,
      });
    }
  };

  // Password modal handlers
  const handlePasswordSave = () => {
    if (passwords.current && passwords.new && passwords.confirm) {
      if (passwords.new === passwords.confirm) {
        setShowPasswordModal(false);
        setPasswords({ current: '', new: '', confirm: '' });
        
        // Show success toast
        toast.success('✅ Password changed successfully', {
          style: {
            background: '#10b981',
            color: 'white',
            border: 'none'
          },
          duration: 3000,
        });
      } else {
        toast.error('New passwords do not match', {
          duration: 3000,
        });
      }
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // Account management handlers
  const handleDeactivateAccount = () => {
    setShowDeactivateModal(false);
    
    // Show warning toast
    toast.warning('⚠️ Account deactivated. You can reactivate anytime.', {
      style: {
        background: '#f59e0b',
        color: 'white',
        border: 'none'
      },
      duration: 3000,
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    
    // Show error toast (for account deletion)
    toast.error('❌ Account permanently deleted', {
      style: {
        background: '#dc2626',
        color: 'white',
        border: 'none'
      },
      duration: 3000,
    });
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'account': return 'Account Settings';
      case 'notifications': return 'Notifications';
      case 'hostMode': return 'Host Mode';
      default: return 'Settings';
    }
  };

  // Main Settings Menu
  if (currentPage === 'main') {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Fixed Header with Safe Area */}
        <div 
          className="flex-shrink-0 bg-primary px-4 pb-6"
          style={{
            paddingTop: `max(48px, calc(12px + env(safe-area-inset-top)))`
          }}
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl text-primary-foreground">Settings</h1>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="px-4 py-6 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-chart-1 text-background text-xl">
                JD
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-lg text-card-foreground">John Doe</h2>
              <p className="text-muted-foreground text-sm">Member since Jan 2024</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30 text-xs">
                  Silver Player
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Tier 4/10
                </Badge>
                {hostModeEnabled && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Host
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Settings Menu with Full Height */}
        <div 
          className="flex-1 overflow-y-auto overscroll-behavior-y-contain" 
          style={{ 
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="px-4 py-4 space-y-3"
            style={{
              paddingBottom: `max(24px, env(safe-area-inset-bottom))`
            }}
          >
            {/* Account Settings */}
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => handlePageChange('account')}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors text-left min-h-[80px]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="text-card-foreground">Account</h3>
                      <p className="text-sm text-muted-foreground">Profile info, password, and account management</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => handlePageChange('notifications')}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors text-left min-h-[80px]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-chart-3" />
                    </div>
                    <div>
                      <h3 className="text-card-foreground">Notifications</h3>
                      <p className="text-sm text-muted-foreground">Push, email, SMS preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>

            {/* Host Mode Toggle */}
            <Card className="bg-yellow-500/10 border-yellow-500/30 overflow-hidden mt-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-yellow-400">Host Mode</h3>
                      <p className="text-sm text-yellow-400/80">
                        {hostModeEnabled ? 'Manage your poker tables' : 'Create and manage poker tables'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={hostModeEnabled}
                      onCheckedChange={handleHostModeToggle}
                    />
                    <button
                      onClick={() => handlePageChange('hostMode')}
                      className="p-2 hover:bg-yellow-500/20 rounded transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-yellow-400" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Host Dashboard Button - Only show when Host Mode is enabled */}
            {hostModeEnabled && onNavigateToHostDashboard && (
              <Card className="bg-yellow-500/5 border-yellow-500/20 overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={onNavigateToHostDashboard}
                    className="w-full p-4 flex items-center justify-between hover:bg-yellow-500/10 transition-colors text-left min-h-[80px]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-yellow-400">Host Dashboard</h3>
                        <p className="text-sm text-yellow-400/70">View and manage your tables</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Logout */}
            <Card className="bg-card border-border overflow-hidden mt-6">
              <CardContent className="p-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-destructive/10 transition-colors text-left min-h-[80px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                          <LogOut className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <h3 className="text-destructive">Sign Out</h3>
                          <p className="text-sm text-muted-foreground">Sign out of your account</p>
                        </div>
                      </div>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-card-foreground">Sign Out</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to sign out? You'll need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-card hover:bg-accent border-border min-h-[44px]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={onLogout}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground min-h-[44px]"
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Notifications Settings Page
  if (currentPage === 'notifications') {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Fixed Header with Safe Area */}
        <div 
          className="flex-shrink-0 bg-primary px-4 pb-6"
          style={{
            paddingTop: `max(48px, calc(12px + env(safe-area-inset-top)))`
          }}
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl text-primary-foreground">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Scrollable Content with Full Height */}
        <div 
          className="flex-1 overflow-y-auto overscroll-behavior-y-contain" 
          style={{ 
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="px-4 py-4 space-y-4"
            style={{
              paddingBottom: `max(24px, env(safe-area-inset-bottom))`
            }}
          >
            {/* Notification Channels */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Notification Channels</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Push Notifications */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-chart-1" />
                    <div>
                      <h4 className="text-card-foreground">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get notified on your device</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <Separator className="bg-border" />

                {/* Email Notifications */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-chart-2" />
                    <div>
                      <h4 className="text-card-foreground">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <Separator className="bg-border" />

                {/* SMS Notifications */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-chart-3" />
                    <div>
                      <h4 className="text-card-foreground">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get text message alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>What You'll Receive</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Game Invitations */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-chart-1" />
                    <div>
                      <h4 className="text-card-foreground">Game Invitations</h4>
                      <p className="text-sm text-muted-foreground">When friends invite you to games</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.gameInvitations}
                    onCheckedChange={(checked) => updateSetting('gameInvitations', checked)}
                  />
                </div>

                <Separator className="bg-border" />

                {/* Tournament Updates */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-chart-3" />
                    <div>
                      <h4 className="text-card-foreground">Tournament Updates</h4>
                      <p className="text-sm text-muted-foreground">Updates about tournaments you've joined</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.tournamentUpdates}
                    onCheckedChange={(checked) => updateSetting('tournamentUpdates', checked)}
                  />
                </div>

                <Separator className="bg-border" />

                {/* Promotional Offers */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Gift className="w-5 h-5 text-chart-4" />
                    <div>
                      <h4 className="text-card-foreground">Promotional Offers</h4>
                      <p className="text-sm text-muted-foreground">Special deals and promotions</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.promotionalOffers}
                    onCheckedChange={(checked) => updateSetting('promotionalOffers', checked)}
                  />
                </div>

                <Separator className="bg-border" />

                {/* Weekly Digest */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-chart-2" />
                    <div>
                      <h4 className="text-card-foreground">Weekly Digest</h4>
                      <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => updateSetting('weeklyDigest', checked)}
                  />
                </div>

                <Separator className="bg-border" />

                {/* Security Alerts */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-chart-5" />
                    <div>
                      <h4 className="text-card-foreground">Security Alerts</h4>
                      <p className="text-sm text-muted-foreground">Important account security notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => updateSetting('securityAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Account Settings Page
  if (currentPage === 'account') {
    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        {/* Fixed Header with Safe Area */}
        <div 
          className="flex-shrink-0 bg-primary px-4 pb-6"
          style={{
            paddingTop: `max(48px, calc(12px + env(safe-area-inset-top)))`
          }}
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl text-primary-foreground">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Scrollable Content with Full Height */}
        <div 
          className="flex-1 overflow-y-auto overscroll-behavior-y-contain" 
          style={{ 
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="px-4 py-4 space-y-4"
            style={{
              paddingBottom: `max(24px, env(safe-area-inset-bottom))`
            }}
          >
            {/* Profile Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-card-foreground">Full Name</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="fullName"
                      value={editingStates.fullName ? tempValues.fullName : profileData.fullName}
                      onChange={(e) => setTempValues(prev => ({ ...prev, fullName: e.target.value }))}
                      className={`flex-1 bg-input-background transition-colors ${
                        editingStates.fullName 
                          ? 'border-primary focus:border-primary ring-2 ring-primary/20' 
                          : 'border-border'
                      }`}
                      readOnly={!editingStates.fullName}
                    />
                    {!editingStates.fullName ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => startEditing('fullName')}
                        className="min-h-[40px] px-3"
                        aria-label="Edit full name"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => saveField('fullName')}
                          className="min-h-[40px] px-3"
                          aria-label="Save full name"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => cancelEditing('fullName')}
                          className="min-h-[40px] px-3"
                          aria-label="Cancel editing full name"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="email"
                      type="email"
                      value={editingStates.email ? tempValues.email : profileData.email}
                      onChange={(e) => setTempValues(prev => ({ ...prev, email: e.target.value }))}
                      className={`flex-1 bg-input-background transition-colors ${
                        editingStates.email 
                          ? 'border-primary focus:border-primary ring-2 ring-primary/20' 
                          : 'border-border'
                      }`}
                      readOnly={!editingStates.email}
                    />
                    {!editingStates.email ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => startEditing('email')}
                        className="min-h-[40px] px-3"
                        aria-label="Edit email address"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => saveField('email')}
                          className="min-h-[40px] px-3"
                          aria-label="Save email address"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => cancelEditing('email')}
                          className="min-h-[40px] px-3"
                          aria-label="Cancel editing email address"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-border" />

                {/* Phone Number with Country Code */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-card-foreground">Phone Number</Label>
                  <PhoneNumberInput
                    value={editingStates.phone ? tempValues.phone : profileData.phone}
                    onChange={(value) => setTempValues(prev => ({ ...prev, phone: value }))}
                    isEditing={editingStates.phone}
                    onStartEdit={() => startEditing('phone')}
                    onSave={() => saveField('phone')}
                    onCancel={() => cancelEditing('phone')}
                  />
                </div>

                <Separator className="bg-border" />

                {/* Change Password */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-chart-1/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-chart-1" />
                    </div>
                    <div>
                      <h4 className="text-card-foreground">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                  </div>
                  <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="min-h-[40px]">
                        Change
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border max-w-sm mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-card-foreground">Change Password</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Enter your current password and choose a new one.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-card-foreground">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwords.current}
                              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                              className="bg-input-background border-border pr-10"
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-card-foreground">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={passwords.new}
                              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                              className="bg-input-background border-border pr-10"
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-card-foreground">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwords.confirm}
                              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                              className="bg-input-background border-border pr-10"
                              placeholder="Confirm new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={handlePasswordCancel}
                          className="bg-card hover:bg-accent border-border min-h-[44px]"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePasswordSave}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]"
                          disabled={!passwords.current || !passwords.new || !passwords.confirm}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Account Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deactivate Account */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-card-foreground">Deactivate Account</h4>
                      <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
                    </div>
                  </div>
                  <AlertDialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="min-h-[40px] text-orange-600 border-orange-200 hover:bg-orange-50">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Deactivate
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-card-foreground flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          <span>Deactivate Account</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Your account will be temporarily disabled. You can reactivate it anytime by signing in again. 
                          Your data will remain safe and unchanged.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-card hover:bg-accent border-border min-h-[44px]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeactivateAccount}
                          className="bg-orange-500 hover:bg-orange-600 text-white min-h-[44px]"
                        >
                          Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Separator className="bg-border" />

                {/* Delete Account */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                      <h4 className="text-card-foreground">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                    </div>
                  </div>
                  <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="min-h-[40px] text-destructive border-destructive/30 hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-card-foreground flex items-center space-x-2">
                          <Trash2 className="w-5 h-5 text-destructive" />
                          <span>Delete Account</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          <strong className="text-destructive">This action cannot be undone.</strong> This will permanently delete your account and remove all your data from our servers. 
                          All your poker history, statistics, and profile information will be lost forever.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-card hover:bg-accent border-border min-h-[44px]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground min-h-[44px] font-bold"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}