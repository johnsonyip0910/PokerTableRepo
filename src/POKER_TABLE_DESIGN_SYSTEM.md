# Poker Table Mobile App - Complete Design System

## 🎨 Design Overview

The Poker Table mobile app features a sophisticated dark theme design optimized for poker players. The interface emphasizes readability, quick navigation, and immersive gaming atmosphere with carefully crafted color palettes and typography.

---

## 📱 Design Principles

### Visual Hierarchy
- **Primary Actions**: High contrast, bright colors (Primary #212A3E)
- **Secondary Actions**: Muted colors, outline styles
- **Information**: Clear typography with appropriate contrast ratios
- **Navigation**: Consistent iconography with active states

### Spacing Philosophy
- **8px Grid System**: All spacing multiples of 8px (8, 16, 24, 32, 40, 48)
- **Consistent Padding**: Cards (16px), Screens (16px horizontal)
- **Touch Targets**: Minimum 44px height for interactive elements
- **Visual Breathing**: Adequate whitespace between content blocks

---

## 🎨 Color Palette

### Core Brand Colors
```css
/* Primary Brand */
--primary: #212A3E;              /* Main brand color, buttons, headers */
--primary-foreground: #ffffff;    /* Text on primary backgrounds */

/* Background System */
--background: #0F1419;           /* Main app background */
--foreground: #E8E9EA;           /* Primary text color */
--card: #212A3E;                 /* Card/surface backgrounds */
--card-foreground: #E8E9EA;      /* Text on card surfaces */
```

### Semantic Colors
```css
/* Interactive Elements */
--muted: #2A3441;                /* Subtle backgrounds, inactive states */
--muted-foreground: #9BA1A6;     /* Secondary text, metadata */
--accent: #2A3441;               /* Hover states, highlights */
--border: #2A3441;               /* Component borders, dividers */

/* Status & Feedback */
--destructive: #E53935;          /* Errors, dangerous actions */
--chart-1: #4FC3F7;              /* Success, active states (blue) */
--chart-2: #81C784;              /* Positive feedback (green) */
--chart-3: #FFB74D;              /* Warnings, tournaments (orange) */
--chart-4: #F06292;              /* Notifications (pink) */
--chart-5: #BA68C8;              /* Premium features (purple) */
```

### Color Usage Guidelines

#### Live Indicators
```css
.live-badge {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
  animation: pulse 2s ease-in-out infinite;
}
```

#### Game Type Badges
```css
.cash-game-badge {
  background: rgba(79, 195, 247, 0.2);
  color: #4FC3F7;
  border: 1px solid rgba(79, 195, 247, 0.3);
}

.tournament-badge {
  background: rgba(255, 183, 77, 0.2);
  color: #FFB74D;
  border: 1px solid rgba(255, 183, 77, 0.3);
}
```

---

## 📝 Typography System

### Font Specification
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Type Scale
```css
/* Font Sizes (14px base) */
--text-xs: 10.5px;     /* Small labels, metadata */
--text-sm: 12.25px;    /* Secondary text, captions */
--text-base: 14px;     /* Body text, buttons */
--text-lg: 15.75px;    /* Card titles, form labels */
--text-xl: 17.5px;     /* Section headers */
--text-2xl: 21px;      /* Page titles */
--text-3xl: 28px;      /* Logo, splash screen */

/* Font Weights */
--font-weight-normal: 400;   /* Body text */
--font-weight-medium: 500;   /* Buttons, labels, emphasis */
--font-weight-bold: 700;     /* Headlines, important text */
```

### Typography Usage

#### Headers
```css
.page-title {
  font-size: 21px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1.3;
  margin-bottom: 16px;
}

.section-header {
  font-size: 17.5px;
  font-weight: 500;
  color: var(--foreground);
  line-height: 1.4;
  margin-bottom: 12px;
}

.card-title {
  font-size: 15.75px;
  font-weight: 500;
  color: var(--card-foreground);
  line-height: 1.4;
}
```

#### Body Text
```css
.body-text {
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
  line-height: 1.5;
}

.secondary-text {
  font-size: 12.25px;
  font-weight: 400;
  color: var(--muted-foreground);
  line-height: 1.4;
}

.metadata {
  font-size: 10.5px;
  font-weight: 400;
  color: var(--muted-foreground);
  line-height: 1.3;
}
```

---

## 🔲 Spacing & Layout

### Spacing Scale
```css
/* Base spacing units */
--space-1: 4px;      /* Micro spacing */
--space-2: 8px;      /* Small gaps */
--space-3: 12px;     /* Medium gaps */
--space-4: 16px;     /* Standard spacing */
--space-5: 20px;     /* Large gaps */
--space-6: 24px;     /* Section spacing */
--space-8: 32px;     /* Major sections */
--space-12: 48px;    /* Screen sections */
--space-16: 64px;    /* Large sections */
```

### Layout Specifications

#### Screen Layout
```css
.screen-container {
  max-width: 375px;           /* Mobile-first design */
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--background);
}

.screen-padding {
  padding: 0 16px;            /* Horizontal screen margins */
}

.content-padding {
  padding: 16px;              /* Standard content padding */
}
```

#### Card System
```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}
```

---

## 🔘 Component System

### Button Specifications

#### Primary Button
```css
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* States */
.btn-primary:hover {
  background: rgba(33, 42, 62, 0.9);
  transform: scale(1.02);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background: var(--muted);
  color: var(--muted-foreground);
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  min-height: 44px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--accent);
  border-color: var(--primary);
}
```

#### Button Sizes
```css
.btn-sm { 
  padding: 8px 12px; 
  font-size: 12px; 
  min-height: 36px; 
}

.btn-md { 
  padding: 12px 16px; 
  font-size: 14px; 
  min-height: 44px; 
}

.btn-lg { 
  padding: 16px 24px; 
  font-size: 16px; 
  min-height: 52px; 
}
```

### Tab System
```css
.tab-container {
  display: flex;
  background: var(--muted);
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.tab-button {
  flex: 1;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tab-button.active {
  background: var(--chart-1);
  color: var(--background);
  box-shadow: 0 2px 4px rgba(79, 195, 247, 0.2);
}

.tab-button:not(.active) {
  color: var(--muted-foreground);
}

.tab-button:not(.active):hover {
  color: var(--foreground);
  background: var(--accent);
}
```

### Input Components
```css
.input {
  background: var(--input-background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: var(--foreground);
  width: 100%;
  min-height: 44px;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(33, 42, 62, 0.1);
}

.input::placeholder {
  color: var(--muted-foreground);
}

/* Search Input with Icon */
.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  width: 16px;
  height: 16px;
}

.search-input {
  padding-left: 40px;
}
```

---

## 🏷️ Badge & Status System

### Badge Variants
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-live {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.badge-tournament {
  background: rgba(255, 183, 77, 0.2);
  color: #FFB74D;
  border: 1px solid rgba(255, 183, 77, 0.3);
}

.badge-cash {
  background: rgba(79, 195, 247, 0.2);
  color: #4FC3F7;
  border: 1px solid rgba(79, 195, 247, 0.3);
}

.badge-notification {
  background: var(--destructive);
  color: white;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-chip:hover {
  background: var(--accent);
  border-color: var(--primary);
}

.filter-chip.active {
  background: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}
```

---

## 📺 Advertising Components

### Banner Ad Specifications
```css
.ad-banner {
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ad-content {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  position: relative;
  z-index: 2;
}

.ad-background {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  z-index: 1;
}

.ad-cta-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(4px);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.ad-cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

### Popup Ad Specifications
```css
.ad-popup {
  max-width: 320px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
}

.ad-popup-image {
  height: 192px;
  width: 100%;
  object-fit: cover;
  position: relative;
}

.ad-popup-content {
  padding: 24px;
}

.ad-popup-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--card-foreground);
  margin-bottom: 12px;
}

.ad-popup-description {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.5;
  margin-bottom: 24px;
}

.ad-popup-cta {
  width: 100%;
  height: 48px;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}
```

---

## 📱 Screen-Specific Specifications

### Splash Screen
```css
.splash-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
  background: var(--background);
}

.splash-logo {
  margin-bottom: 64px;
}

.splash-loading {
  width: 192px;
  max-width: 80%;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--muted);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--chart-1), var(--chart-2));
  border-radius: 2px;
  transition: width 0.3s ease;
}
```

### Authentication Screens
```css
.auth-container {
  min-height: 100vh;
  padding: 0 24px;
  background: var(--background);
}

.auth-header {
  padding-top: 48px;
  padding-bottom: 32px;
  text-align: center;
}

.auth-form {
  max-width: 320px;
  margin: 0 auto;
}

.social-button {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.social-button:hover {
  background: var(--accent);
  border-color: var(--primary);
}
```

### Bottom Navigation
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--card);
  border-top: 1px solid var(--border);
  padding: 8px 0;
  z-index: 50;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 375px;
  margin: 0 auto;
  padding: 0 16px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 60px;
}

.nav-item.active {
  color: var(--chart-1);
  background: rgba(79, 195, 247, 0.1);
}

.nav-item:not(.active) {
  color: var(--muted-foreground);
}

.nav-item:not(.active):hover {
  color: var(--foreground);
  background: var(--accent);
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

## 🎮 Interactive States

### Hover Effects
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(79, 195, 247, 0.3);
}
```

### Active States
```css
.active-press:active {
  transform: scale(0.98);
}

.active-glow.active {
  box-shadow: 0 0 0 3px rgba(33, 42, 62, 0.2);
}
```

### Loading States
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--muted) 25%,
    var(--accent) 50%,
    var(--muted) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
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

---

## 📐 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.mobile-container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
}

/* Tablet and up */
@media (min-width: 768px) {
  .mobile-container {
    max-width: 375px;
  }
}

/* Large screens */
@media (min-width: 1024px) {
  .mobile-container {
    max-width: 375px;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }
}
```

### Safe Areas
```css
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-pb {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

---

## ✅ Implementation Checklist

### Design System Setup
- [ ] Import Inter/Roboto fonts
- [ ] Set up CSS custom properties for colors
- [ ] Configure 8px spacing grid
- [ ] Implement button component with all states
- [ ] Create card component system
- [ ] Set up badge and status components

### Screen Implementation
- [ ] Splash screen with logo and loading
- [ ] Authentication screens with social login
- [ ] Home screen with ad banner and filtering  
- [ ] Map screen with dark theme pins
- [ ] Table details with comprehensive info
- [ ] Create table form with presets
- [ ] Notifications with grouping
- [ ] Profile with stats and achievements
- [ ] Settings with proper toggles
- [ ] Chat interface (optional)

### Advertising Integration
- [ ] Banner ad component with rotation
- [ ] Popup ad modal with carousel
- [ ] Ad dismissal and timing logic
- [ ] Proper ad labeling and compliance

### Polish & Testing
- [ ] Implement hover and active states
- [ ] Add loading skeletons
- [ ] Test on various screen sizes
- [ ] Verify color contrast ratios
- [ ] Performance optimization
- [ ] Accessibility improvements

This design system provides comprehensive guidelines for implementing a professional, modern poker table finding app with consistent visual design and excellent user experience.