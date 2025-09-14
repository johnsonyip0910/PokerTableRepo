# Poker Table App - Design Specifications

## 📱 Mobile App Design System

### Overview
This specification document provides comprehensive guidelines for implementing the Poker Table mobile application. The app uses a dark theme with a modern, clean interface optimized for poker players finding and joining games.

---

## 🎨 Color System

### Primary Colors
```css
/* Primary Brand Color */
--primary: #212A3E;           /* Main brand color for buttons, headers, accents */
--primary-foreground: #ffffff; /* Text on primary background */

/* Dark Theme Background */
--background: #0F1419;        /* Main app background */
--foreground: #E8E9EA;        /* Primary text color */
```

### Card & Surface Colors
```css
--card: #212A3E;              /* Card backgrounds, elevated surfaces */
--card-foreground: #E8E9EA;   /* Text on card backgrounds */
--secondary: #2A3441;         /* Secondary elements, inputs */
--secondary-foreground: #E8E9EA; /* Text on secondary elements */
```

### Accent & State Colors
```css
--muted: #2A3441;             /* Subtle backgrounds, disabled states */
--muted-foreground: #9BA1A6;  /* Secondary text, metadata */
--accent: #2A3441;            /* Hover states, subtle highlights */
--border: #2A3441;            /* Component borders, dividers */
--destructive: #E53935;       /* Error states, danger actions */
```

### Semantic Colors
```css
/* Status Colors */
.live-indicator { color: #4CAF50; }     /* Live tables */
.cash-game { color: #4FC3F7; }          /* Cash game badges */
.tournament { color: #FFB74D; }         /* Tournament badges */
.success { color: #81C784; }            /* Success states */
.warning { color: #FFB74D; }            /* Warning states */
.error { color: #E53935; }              /* Error states */
```

---

## 📝 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Scales & Weights
```css
/* Base font size */
html { font-size: 14px; }

/* Typography Scale */
--text-xs: 0.75rem;    /* 10.5px - Small labels, metadata */
--text-sm: 0.875rem;   /* 12.25px - Secondary text */
--text-base: 1rem;     /* 14px - Body text, buttons */
--text-lg: 1.125rem;   /* 15.75px - Card titles, form labels */
--text-xl: 1.25rem;    /* 17.5px - Section headers */
--text-2xl: 1.5rem;    /* 21px - Page titles */

/* Font Weights */
--font-weight-normal: 400;  /* Body text */
--font-weight-medium: 500;  /* Buttons, labels, emphasis */
```

### Text Hierarchy
```css
/* Page Titles */
h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  color: var(--foreground);
}

/* Section Headers */
h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

/* Card Titles */
h3 {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

/* Body Text */
p {
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
  color: var(--foreground);
}

/* Secondary Text */
.text-muted {
  color: var(--muted-foreground);
  font-size: var(--text-sm);
}
```

---

## 🔲 Spacing System

### Base Spacing Scale
```css
/* Spacing Scale (based on 4px grid) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Layout Spacing
```css
/* Screen Padding */
.screen-padding { padding: 1rem; }           /* 16px all sides */
.screen-padding-x { padding: 0 1rem; }       /* 16px horizontal */
.screen-padding-y { padding: 1rem 0; }       /* 16px vertical */

/* Component Spacing */
.card-padding { padding: 1rem; }             /* 16px inside cards */
.header-padding { padding: 1rem 1rem 2rem; } /* 16px + extra top for status bar */
.list-gap { gap: 1rem; }                     /* 16px between list items */

/* Element Spacing */
.button-padding { padding: 0.75rem 1rem; }   /* 12px vertical, 16px horizontal */
.input-padding { padding: 0.75rem; }         /* 12px all sides */
.icon-margin { margin-right: 0.5rem; }       /* 8px right margin for icons */
```

---

## 🔘 Button System

### Primary Button
```css
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  transition: all 0.2s ease;
}

/* States */
.btn-primary:hover { background-color: rgba(33, 42, 62, 0.9); }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { 
  background-color: var(--muted);
  color: var(--muted-foreground);
  opacity: 0.6;
}
```

### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 12px 16px;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
}

/* States */
.btn-secondary:hover {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

### Button Sizes
```css
.btn-sm { padding: 8px 12px; font-size: 12px; }
.btn-md { padding: 12px 16px; font-size: 14px; }
.btn-lg { padding: 16px 24px; font-size: 16px; }
```

---

## 📦 Card System

### Base Card
```css
.card {
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Card hover effect */
.card:hover {
  border-color: var(--primary);
  transition: border-color 0.2s ease;
}
```

### Table Card (Poker Table Listings)
```css
.table-card {
  /* Extends base card */
  padding: 16px;
  margin-bottom: 16px;
}

.table-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.table-card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--card-foreground);
  margin-bottom: 4px;
}

.table-card-location {
  font-size: 12px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
}

.table-card-footer {
  border-top: 1px solid var(--border);
  padding-top: 12px;
  margin-top: 12px;
}
```

---

## 🏷️ Badge System

### Game Type Badges
```css
.badge-cash {
  background-color: rgba(79, 195, 247, 0.2);
  color: #4FC3F7;
  border: 1px solid rgba(79, 195, 247, 0.3);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
}

.badge-tournament {
  background-color: rgba(255, 183, 77, 0.2);
  color: #FFB74D;
  border: 1px solid rgba(255, 183, 77, 0.3);
}

.badge-live {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
  animation: pulse 2s infinite;
}
```

### Filter Chips
```css
.filter-chip {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-chip:hover {
  background-color: var(--accent);
}

.filter-chip.active {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}
```

---

## 📱 Screen Layout Specifications

### Mobile Container
```css
.mobile-container {
  max-width: 375px;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--background);
}

/* Responsive breakpoint */
@media (min-width: 768px) {
  .mobile-container {
    max-width: 375px;
  }
}
```

### Header Layout
```css
.screen-header {
  background-color: var(--primary);
  padding: 32px 16px 16px; /* Extra top padding for status bar */
  color: var(--primary-foreground);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### Bottom Navigation
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--card);
  border-top: 1px solid var(--border);
  padding: 8px 0;
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;
}

.nav-item.active {
  color: var(--primary);
  background-color: rgba(33, 42, 62, 0.1);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
}
```

---

## 🔍 Input & Form Components

### Text Input
```css
.input {
  background-color: var(--input-background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: var(--foreground);
  width: 100%;
  transition: border-color 0.2s ease;
}

.input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(33, 42, 62, 0.1);
}

.input::placeholder {
  color: var(--muted-foreground);
}
```

### Search Input
```css
.search-input {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--muted-foreground);
}

.search-input input {
  padding-left: 40px;
}
```

### Form Labels
```css
.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 6px;
  display: block;
}
```

---

## 📊 Component States

### Loading States
```css
.skeleton {
  background: linear-gradient(90deg, var(--muted) 25%, var(--accent) 50%, var(--muted) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.spinner {
  border: 2px solid var(--muted);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Empty States
```css
.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-state-icon {
  width: 48px;
  height: 48px;
  color: var(--muted-foreground);
  margin: 0 auto 16px;
}

.empty-state-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 8px;
}

.empty-state-description {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.5;
}
```

---

## 🔄 Animations & Transitions

### Micro-interactions
```css
/* Button press animation */
.btn:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* Card hover animation */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

/* Pulse animation for live indicators */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse { animation: pulse 2s ease-in-out infinite; }
```

### Page Transitions
```css
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
```

---

## 📋 Screen-Specific Guidelines

### 1. Home Screen
- **Header height**: 120px (including status bar padding)
- **Search bar margin**: 16px from title, full width with 16px side margins
- **Filter chips**: Horizontal scroll, 8px gap between chips
- **Table cards**: 16px gap between cards, full width with 16px margins
- **Bottom padding**: 80px (for tab bar clearance)

### 2. Map Screen
- **Map area**: Full height minus header and tab bar
- **Location pins**: 32px touch target, blue primary color
- **Pin popup**: Slide up animation, max height 50% of screen
- **User location**: 16px blue dot with subtle pulse animation

### 3. Table Details Screen
- **Header**: Fixed header with back button and actions
- **Content sections**: 16px gap between cards
- **Action buttons**: Full width, 48px height, 12px gap between
- **Player avatars**: 40px size, -8px overlap in groups

### 4. Create Table Screen
- **Form sections**: Grouped in cards with 24px gap
- **Input fields**: 48px height, 12px gap between fields
- **Submit button**: Fixed at bottom with 16px margins

### 5. Chat Screen
- **Message bubbles**: Max width 280px, 8px margin between messages
- **Input area**: Fixed bottom, 16px padding, 48px height
- **Avatar size**: 32px in message list
- **Timestamp**: 12px font, muted color

---

## 🔌 Supabase Integration Points

### Data Structure Preparation
```typescript
// User Profile
interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  rating: number;
  games_played: number;
  win_rate: number;
  created_at: string;
  updated_at: string;
}

// Poker Table
interface PokerTable {
  id: string;
  host_id: string;
  name: string;
  description: string;
  type: 'cash' | 'tournament';
  stakes: string;
  buy_in_min: number;
  buy_in_max: number;
  max_seats: number;
  location_name: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  start_time: string;
  end_time?: string;
  is_recurring: boolean;
  recurring_days?: string[];
  rules: string[];
  amenities: string[];
  is_private: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Table Participant
interface TableParticipant {
  id: string;
  table_id: string;
  user_id: string;
  status: 'joined' | 'reserved' | 'waitlist';
  seat_number?: number;
  joined_at: string;
}

// Chat Message
interface ChatMessage {
  id: string;
  table_id: string;
  user_id: string;
  message: string;
  message_type: 'text' | 'system';
  created_at: string;
}
```

### Authentication Hooks
```typescript
// Auth state management ready for Supabase
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ready for Supabase auth integration
  const signIn = async (email: string, password: string) => {
    // Supabase sign in
  };
  
  const signUp = async (email: string, password: string) => {
    // Supabase sign up
  };
  
  const signOut = async () => {
    // Supabase sign out
  };
  
  return { user, loading, signIn, signUp, signOut };
};
```

### Real-time Features
```typescript
// Chat real-time subscription structure
const useChatSubscription = (tableId: string) => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Supabase real-time subscription
    const subscription = supabase
      .channel(`chat:${tableId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `table_id=eq.${tableId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [tableId]);
  
  return { messages };
};
```

---

## ✅ Implementation Checklist

### Phase 1: Core UI
- [ ] Set up dark theme with primary color #212A3E
- [ ] Implement mobile container with 375px max width
- [ ] Create header component with proper spacing
- [ ] Build bottom tab navigation
- [ ] Implement card system with hover states

### Phase 2: Screen Implementation
- [ ] Home screen with search and filters
- [ ] Map view with interactive pins
- [ ] Table details with comprehensive info
- [ ] Create table form with validation
- [ ] Notifications list with proper grouping
- [ ] Profile screen with stats
- [ ] Settings with toggles and navigation
- [ ] Chat interface with real-time ready structure

### Phase 3: Supabase Integration
- [ ] Set up authentication flow
- [ ] Connect user profiles
- [ ] Implement table CRUD operations
- [ ] Add real-time chat
- [ ] Set up push notifications
- [ ] Add geolocation services

### Phase 4: Polish & Testing
- [ ] Add loading states and skeletons
- [ ] Implement error handling
- [ ] Add micro-interactions
- [ ] Test on various screen sizes
- [ ] Performance optimization
- [ ] Accessibility improvements

---

## 📐 Measurement Tools

### Design Tokens Export
Use these CSS custom properties in your build system:

```css
:root {
  /* Colors */
  --poker-primary: #212A3E;
  --poker-background: #0F1419;
  --poker-card: #212A3E;
  --poker-muted: #9BA1A6;
  
  /* Spacing */
  --poker-space-xs: 4px;
  --poker-space-sm: 8px;
  --poker-space-md: 16px;
  --poker-space-lg: 24px;
  --poker-space-xl: 32px;
  
  /* Typography */
  --poker-text-xs: 10.5px;
  --poker-text-sm: 12.25px;
  --poker-text-base: 14px;
  --poker-text-lg: 15.75px;
  --poker-text-xl: 17.5px;
  
  /* Borders */
  --poker-radius: 10px;
  --poker-radius-sm: 6px;
  --poker-radius-lg: 16px;
}
```

---

This design specification provides comprehensive guidance for implementing the Poker Table app with consistent styling, proper spacing, and structure ready for Supabase integration. All measurements, colors, and component specifications are included for seamless development handoff.