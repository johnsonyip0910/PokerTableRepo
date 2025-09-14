import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
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
          <h1 className="text-xl text-primary-foreground">Privacy Policy</h1>
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
              Poker Table Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>
            <p className="text-card-foreground leading-relaxed">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the application.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">2. Information We Collect</h2>
            <h3 className="text-base text-card-foreground">Personal Information</h3>
            <p className="text-card-foreground leading-relaxed">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside space-y-1 text-card-foreground ml-4">
              <li>Register for an account</li>
              <li>Use our services</li>
              <li>Contact us for support</li>
              <li>Participate in poker games or tournaments</li>
            </ul>
            <p className="text-card-foreground leading-relaxed">
              This information may include your name, email address, username, profile picture, and any other information you choose to provide.
            </p>
          </section>

          {/* Automatically Collected Information */}
          <section className="space-y-3">
            <h3 className="text-base text-card-foreground">Automatically Collected Information</h3>
            <p className="text-card-foreground leading-relaxed">
              When you use our application, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-card-foreground ml-4">
              <li>Device information (device type, operating system, unique device identifiers)</li>
              <li>Usage information (features used, time spent in app, app interactions)</li>
              <li>Location information (if you grant permission)</li>
              <li>Log data (IP address, browser type, access times)</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">3. How We Use Your Information</h2>
            <p className="text-card-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-card-foreground ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Facilitate poker game connections and communications</li>
              <li>Send you notifications and updates</li>
              <li>Provide customer support</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">4. Information Sharing and Disclosure</h2>
            <p className="text-card-foreground leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-card-foreground ml-4">
              <li>With other users as necessary to facilitate poker games (usernames, ratings, comments)</li>
              <li>With service providers who assist us in operating our application</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">5. Data Security</h2>
            <p className="text-card-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          {/* Data Retention */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">6. Data Retention</h2>
            <p className="text-card-foreground leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">7. Your Privacy Rights</h2>
            <p className="text-card-foreground leading-relaxed">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-card-foreground ml-4">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your personal information</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">8. Cookies and Tracking Technologies</h2>
            <p className="text-card-foreground leading-relaxed">
              We may use cookies, web beacons, and other tracking technologies to collect information about your use of our application. You can manage your cookie preferences through your device settings.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">9. Third-Party Services</h2>
            <p className="text-card-foreground leading-relaxed">
              Our application may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">10. Children's Privacy</h2>
            <p className="text-card-foreground leading-relaxed">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">11. Changes to This Privacy Policy</h2>
            <p className="text-card-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-3">
            <h2 className="text-lg text-card-foreground">12. Contact Us</h2>
            <p className="text-card-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-muted rounded-lg p-4 space-y-1">
              <p className="text-card-foreground">Email: privacy@pokertable.app</p>
              <p className="text-card-foreground">Address: 123 Poker Street, Gaming City, GC 12345</p>
              <p className="text-card-foreground">Phone: (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}