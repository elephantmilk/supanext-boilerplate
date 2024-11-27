import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setRateLimitError(false);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=/`,
        },
      });

      if (error?.message?.includes('rate limit')) {
        setRateLimitError(true);
        return;
      }

      // ... rest of the code
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn}>
      <div className="mb-4">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      {rateLimitError && (
        <div className="text-red-500 text-sm mt-2">
          Zu viele Versuche. Bitte warten Sie einige Minuten.
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? 'Wird gesendet...' : 'Anmelden'}
      </Button>
    </form>
  );
};

export default Auth; 