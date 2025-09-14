# Supabase Integration Guide for Poker Table App

## 🗄️ Database Schema

### Required Tables

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  games_played INTEGER DEFAULT 0,
  total_winnings DECIMAL(10,2) DEFAULT 0.0,
  win_rate DECIMAL(5,2) DEFAULT 0.0,
  favorite_game TEXT,
  rank TEXT DEFAULT 'Beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Poker tables
CREATE TABLE poker_tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('cash', 'tournament')) NOT NULL,
  stakes TEXT NOT NULL,
  buy_in_min INTEGER NOT NULL,
  buy_in_max INTEGER NOT NULL,
  max_seats INTEGER DEFAULT 9,
  current_seats INTEGER DEFAULT 0,
  location_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_days TEXT[], -- ['monday', 'friday']
  rules TEXT[],
  amenities TEXT[],
  is_private BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_live BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table participants
CREATE TABLE table_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID REFERENCES poker_tables(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('joined', 'reserved', 'waitlist', 'left')) DEFAULT 'joined',
  seat_number INTEGER,
  buy_in_amount INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(table_id, user_id),
  UNIQUE(table_id, seat_number)
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID REFERENCES poker_tables(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'system', 'action')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('invitation', 'reminder', 'seat_available', 'update', 'achievement')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  table_id UUID REFERENCES poker_tables(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings
CREATE TABLE user_settings (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  game_invitations BOOLEAN DEFAULT TRUE,
  seat_alerts BOOLEAN DEFAULT TRUE,
  email_updates BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  location_services BOOLEAN DEFAULT TRUE,
  dark_mode BOOLEAN DEFAULT TRUE,
  language TEXT DEFAULT 'en',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poker_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Poker tables policies
CREATE POLICY "Tables are viewable by everyone" 
ON poker_tables FOR SELECT USING (true);

CREATE POLICY "Users can create tables" 
ON poker_tables FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their tables" 
ON poker_tables FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their tables" 
ON poker_tables FOR DELETE USING (auth.uid() = host_id);

-- Table participants policies
CREATE POLICY "Participants viewable by table members" 
ON table_participants FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM table_participants WHERE table_id = table_participants.table_id
  ) OR 
  auth.uid() = (SELECT host_id FROM poker_tables WHERE id = table_participants.table_id)
);

CREATE POLICY "Users can join tables" 
ON table_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave tables" 
ON table_participants FOR UPDATE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Chat messages viewable by table participants" 
ON chat_messages FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM table_participants WHERE table_id = chat_messages.table_id
  )
);

CREATE POLICY "Table participants can send messages" 
ON chat_messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IN (
    SELECT user_id FROM table_participants WHERE table_id = chat_messages.table_id
  )
);

-- Notifications policies
CREATE POLICY "Users can view their notifications" 
ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" 
ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their settings" 
ON user_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their settings" 
ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their settings" 
ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Database Functions

```sql
-- Function to update table seat count
CREATE OR REPLACE FUNCTION update_table_seat_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE poker_tables 
    SET current_seats = (
      SELECT COUNT(*) 
      FROM table_participants 
      WHERE table_id = NEW.table_id 
      AND status = 'joined'
    )
    WHERE id = NEW.table_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poker_tables 
    SET current_seats = (
      SELECT COUNT(*) 
      FROM table_participants 
      WHERE table_id = OLD.table_id 
      AND status = 'joined'
    )
    WHERE id = OLD.table_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update seat counts
CREATE TRIGGER update_seat_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON table_participants
  FOR EACH ROW EXECUTE FUNCTION update_table_seat_count();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_table_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, table_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_table_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 Authentication Setup

### React Hook for Authentication

```typescript
// hooks/useAuth.ts
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithApple: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    // Create profile after signup
    if (data.user && !error) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          email,
        });
      
      if (profileError) console.error('Profile creation error:', profileError);
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signInWithApple = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## 📊 Data Fetching Hooks

### Tables Hook

```typescript
// hooks/useTables.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PokerTable } from '../types';

export function useTables(filters?: {
  type?: 'cash' | 'tournament';
  location?: string;
  search?: string;
}) {
  const [tables, setTables] = useState<PokerTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
  }, [filters]);

  const fetchTables = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('poker_tables')
        .select(`
          *,
          host:profiles!poker_tables_host_id_fkey(username, avatar_url),
          participants:table_participants(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,location_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const joinTable = async (tableId: string, buyInAmount?: number) => {
    try {
      const { error } = await supabase
        .from('table_participants')
        .insert({
          table_id: tableId,
          user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          buy_in_amount: buyInAmount,
        });

      if (error) throw error;
      
      // Refresh tables
      fetchTables();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to join table' 
      };
    }
  };

  const leaveTable = async (tableId: string) => {
    try {
      const { error } = await supabase
        .from('table_participants')
        .update({ status: 'left', left_at: new Date().toISOString() })
        .eq('table_id', tableId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      
      fetchTables();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to leave table' 
      };
    }
  };

  return {
    tables,
    loading,
    error,
    refetch: fetchTables,
    joinTable,
    leaveTable,
  };
}
```

### Chat Hook with Real-time

```typescript
// hooks/useChat.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ChatMessage } from '../types';

export function useChat(tableId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`chat:${tableId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `table_id=eq.${tableId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tableId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .eq('table_id', tableId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          table_id: tableId,
          user_id: user.data.user.id,
          message,
          message_type: 'text',
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send message' 
      };
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
```

---

## 🗺️ Geolocation Integration

```typescript
// hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

interface GeolocationState {
  coordinates: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        error: 'Geolocation is not supported',
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          coordinates: null,
          error: error.message,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return {
    ...state,
    calculateDistance,
  };
}
```

---

## 📱 Push Notifications Setup

```typescript
// lib/notifications.ts
import { supabase } from './supabase';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function subscribeToNotifications(userId: string) {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return false;

    // Register service worker for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Store subscription in Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          subscription: JSON.stringify(subscription),
        });

      if (error) throw error;
      return true;
    }
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return false;
  }
}

export function showLocalNotification(title: string, body: string, data?: any) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/logo-192.png',
      badge: '/logo-72.png',
      data,
    });
  }
}
```

---

## 🔄 Real-time Updates

```typescript
// hooks/useTableUpdates.ts
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTableUpdates(
  tableId: string,
  onParticipantChange?: () => void,
  onTableUpdate?: () => void
) {
  useEffect(() => {
    // Subscribe to participant changes
    const participantSubscription = supabase
      .channel(`participants:${tableId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'table_participants',
          filter: `table_id=eq.${tableId}`,
        },
        () => {
          onParticipantChange?.();
        }
      )
      .subscribe();

    // Subscribe to table updates
    const tableSubscription = supabase
      .channel(`table:${tableId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'poker_tables',
          filter: `id=eq.${tableId}`,
        },
        () => {
          onTableUpdate?.();
        }
      )
      .subscribe();

    return () => {
      participantSubscription.unsubscribe();
      tableSubscription.unsubscribe();
    };
  }, [tableId, onParticipantChange, onTableUpdate]);
}
```

---

## 🔒 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

---

## 🚀 Deployment Checklist

### Supabase Configuration
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Set up authentication providers (Google, Apple, Facebook)
- [ ] Configure RLS policies
- [ ] Set up storage buckets for avatars/images
- [ ] Configure email templates
- [ ] Set up webhooks for external services

### App Configuration
- [ ] Add environment variables
- [ ] Configure push notification service worker
- [ ] Set up analytics (optional)
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and SSL

### Testing
- [ ] Test authentication flows
- [ ] Test real-time features
- [ ] Test on various devices
- [ ] Test push notifications
- [ ] Load testing for concurrent users
- [ ] Security audit

This integration guide provides a complete roadmap for implementing Supabase with your Poker Table app, including database schema, authentication, real-time features, and deployment considerations.