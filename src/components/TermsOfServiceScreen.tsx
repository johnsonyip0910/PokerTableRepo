import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div 
        className="flex-shrink-0 bg-primary px-4 py-3"
        style={{
          paddingTop: `max(48px, calc(12px + env(safe-area-inset-top)))`
        }}
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-primary-foreground/10 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-primary-foreground">Terms of Service</h1>
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
          className="px-4 py-6 space-y-6"
          style={{
            paddingBottom: `max(24px, env(safe-area-inset-bottom))`
          }}
        >
          {/* Last Updated */}
          <div className="text-sm text-muted-foreground">
            Last updated: January 15, 2024
          </div>

          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">1. Introduction</h2>
            <p className="text-card-foreground leading-relaxed">
              Welcome to Poker Table ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our mobile application and services (the "Service") operated by Poker Table Inc.
            </p>
            <p className="text-card-foreground leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">2. Acceptance of Terms</h2>
            <p className="text-card-foreground leading-relaxed">
              By creating an account or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          {/* User Accounts */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">3. User Accounts</h2>
            <p className="text-card-foreground leading-relaxed">
              To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <ul className="list-disc list-inside space-y-1 text-card-foreground ml-4">
              <li>You must provide accurate and complete information during registration</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for keeping your login credentials secure</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">4. Acceptable Use</h2>
            <p className="text-card-foreground leading-relaxed">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
            </p>
            <ul className="list-disc list-inside space-y-1 text-card-foreground ml-4">
              <li>To violate any applicable local, state, national, or international law or regulation</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              <li>To impersonate or attempt to impersonate another user or person</li>
              <li>To engage in any automated use of the system without our express written permission</li>
              <li>To interfere with or circumvent the security features of the Service</li>
            </ul>
          </section>

          {/* Gaming and Gambling */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">5. Gaming and Gambling</h2>
            <p className="text-card-foreground leading-relaxed">
              Poker Table is a platform for organizing and finding poker games. Users are responsible for ensuring their participation in poker games complies with all applicable laws in their jurisdiction.
            </p>
            <p className="text-card-foreground leading-relaxed">
              We do not facilitate gambling transactions and are not responsible for any financial transactions between users. All gaming activities arranged through our platform are at your own risk.
            </p>
          </section>

          {/* Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">6. Privacy</h2>
            <p className="text-card-foreground leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">7. Intellectual Property</h2>
            <p className="text-card-foreground leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Poker Table Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          {/* Termination */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">8. Termination</h2>
            <p className="text-card-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">9. Limitation of Liability</h2>
            <p className="text-card-foreground leading-relaxed">
              In no event shall Poker Table Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">10. Changes to Terms</h2>
            <p className="text-card-foreground leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">11. Contact Us</h2>
            <p className="text-card-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-muted rounded-lg p-4 space-y-1">
              <p className="text-card-foreground">Email: legal@pokertable.app</p>
              <p className="text-card-foreground">Address: 123 Poker Street, Gaming City, GC 12345</p>
              <p className="text-card-foreground">Phone: (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}