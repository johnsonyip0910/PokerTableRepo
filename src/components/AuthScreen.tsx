import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader } from './ui/card';
import { Logo } from './Logo';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AuthScreenProps {
  onLogin: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
}

type AuthMode = 'welcome' | 'login' | 'signup' | 'forgot';

export function AuthScreen({ onLogin, onNavigateToTerms, onNavigateToPrivacy }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Authentication variables
  const [auth_email, setAuth_email] = useState('');
  const [auth_password, setAuth_password] = useState('');
  const [authError, setAuthError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError(''); // Clear any existing errors when switching modes
  };

  const handleSocialLogin = (provider: string) => {
    // Show prototype limitation message
    toast.info("Third-party sign-in is only available in the code build. This prototype uses email/password for testing.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setAuthError('');
    
    // Only validate for login mode
    if (authMode === 'login') {
      // Check credentials
      if (auth_email === "johnsonyip0910@gmail.com" && auth_password === "qwe123rty456uio789") {
        // Successful login
        onLogin();
      } else {
        // Failed login
        setAuthError('Incorrect email or password.');
      }
    } else {
      // For signup and forgot password, simulate form submission
      setTimeout(onLogin, 1000);
    }
  };

  // Welcome Screen
  if (authMode === 'welcome') {
    return (
      <div className="flex flex-col min-h-screen bg-background px-6">
        {/* Enhanced Logo Header - 18% from top for prominence */}
        <div className="flex flex-col items-center justify-center" style={{ paddingTop: '18vh', paddingBottom: '4vh' }}>
          <Logo 
            size="5xl" 
            showText={false} 
            forceBlackText={true}
          />
          <p className="text-lg text-muted-foreground mt-6">Find your game</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-8">
            <Button
              onClick={() => handleSocialLogin('google')}
              variant="outline"
              className="w-full h-12 bg-card border-border hover:bg-accent text-card-foreground font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={() => handleSocialLogin('facebook')}
              variant="outline"
              className="w-full h-12 bg-card border-border hover:bg-accent text-card-foreground font-medium"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>

            <Button
              onClick={() => handleSocialLogin('apple')}
              variant="outline"
              className="w-full h-12 bg-card border-border hover:bg-accent text-card-foreground font-medium"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C8.396 0 8.971 1.719 8.971 1.719s-.564 1.271.632 3.281c1.158 1.937 3.089 1.937 3.089 1.937s1.93 0 3.089-1.937c1.196-2.01.632-3.281.632-3.281S15.639 0 12.017 0z"/>
                <path d="M16.624 6.219c-3.02 0-5.438 2.418-5.438 5.438 0 3.02 2.418 5.438 5.438 5.438 3.02 0 5.438-2.418 5.438-5.438 0-3.02-2.418-5.438-5.438-5.438zM7.624 6.219c-3.02 0-5.438 2.418-5.438 5.438 0 3.02 2.418 5.438 5.438 5.438 3.02 0 5.438-2.418 5.438-5.438 0-3.02-2.418-5.438-5.438-5.438z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <Separator className="bg-border" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email Options */}
          <div className="space-y-3">
            <Button
              onClick={() => handleAuthModeChange('signup')}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <Mail className="w-5 h-5 mr-3" />
              Sign up with Email
            </Button>

            <Button
              onClick={() => handleAuthModeChange('login')}
              variant="outline"
              className="w-full h-12 bg-card border-border hover:bg-accent text-card-foreground font-medium"
            >
              <Mail className="w-5 h-5 mr-3" />
              Sign in with Email
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8 pt-4">
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <button 
              onClick={onNavigateToTerms}
              className="text-primary underline hover:text-primary/80"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              onClick={onNavigateToPrivacy}
              className="text-primary underline hover:text-primary/80"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Form Screens (Login, Signup, Forgot Password)
  return (
    <div className="flex flex-col min-h-screen bg-background px-6">
      {/* Header with Logo */}
      <div className="flex items-center justify-between pt-12 pb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAuthModeChange('welcome')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Logo size="sm" showText={false} forceBlackText={true} />
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Form Card */}
      <Card className="bg-card border-border max-w-sm mx-auto w-full">
        <CardHeader className="pb-4">
          <h2 className="text-2xl font-bold text-center text-card-foreground">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-center text-muted-foreground text-sm">
            {authMode === 'login' && 'Sign in to your account'}
            {authMode === 'signup' && 'Join the poker community'}
            {authMode === 'forgot' && 'Enter your email to reset password'}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={authMode === 'login' ? auth_email : formData.email}
                  onChange={(e) => {
                    if (authMode === 'login') {
                      setAuth_email(e.target.value);
                      setAuthError(''); // Clear error when typing
                    } else {
                      handleInputChange('email', e.target.value);
                    }
                  }}
                  className="pl-10 bg-input-background border-border focus:border-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password (Login & Signup) */}
            {authMode !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={authMode === 'login' ? auth_password : formData.password}
                    onChange={(e) => {
                      if (authMode === 'login') {
                        setAuth_password(e.target.value);
                        setAuthError(''); // Clear error when typing
                      } else {
                        handleInputChange('password', e.target.value);
                      }
                    }}
                    className="pl-10 pr-10 bg-input-background border-border focus:border-primary"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password (Signup only) */}
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-card-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 bg-input-background border-border focus:border-primary"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Authentication Error Message */}
            {authError && (
              <div className="text-sm text-destructive mt-2">
                {authError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-6"
            >
              {authMode === 'login' && 'Sign In'}
              {authMode === 'signup' && 'Create Account'}
              {authMode === 'forgot' && 'Send Reset Link'}
            </Button>
          </form>

          {/* Forgot Password Link (Login only) */}
          {authMode === 'login' && (
            <div className="text-center">
              <button
                onClick={() => handleAuthModeChange('forgot')}
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Switch Mode Links */}
          <div className="text-center pt-4 border-t border-border">
            {authMode === 'login' && (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => handleAuthModeChange('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            )}
            {authMode === 'signup' && (
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => handleAuthModeChange('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
            {authMode === 'forgot' && (
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <button
                  onClick={() => handleAuthModeChange('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}