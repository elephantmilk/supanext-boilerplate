"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supaBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/Icons";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      const supabase = supaBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + "/auth/callback?next=" + next,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(`Fehler beim ${provider}-Login`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Bitte E-Mail und Passwort eingeben");
      return;
    }
    
    setLoading(true);
    try {
      const supabase = supaBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Bitte E-Mail eingeben");
      return;
    }
    
    setLoading(true);
    try {
      const supabase = supaBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + "/auth/callback?next=" + next,
        },
      });
      if (error) throw error;
      setShowOTP(true);
      toast.success("Magic Link wurde gesendet!");
    } catch (error) {
      console.error("Magic Link error:", error);
      toast.error("Fehler beim Senden des Magic Links");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;

    setLoading(true);
    try {
      const supabase = supaBrowser();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "magiclink",
      });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (error) {
      toast.error("Ungültiger Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      {!showOTP ? (
        <form onSubmit={handlePasswordLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@beispiel.de"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ihr Passwort"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Wird angemeldet..." : "Mit Passwort anmelden"}
            </Button>
            <Button 
              type="button"
              variant="secondary"
              onClick={handleMagicLink} 
              disabled={loading}
              className="flex-1"
            >
              Magic Link senden
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp">Bestätigungscode</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="000000"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Wird überprüft..." : "Code bestätigen"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowOTP(false)}
          >
            Zurück
          </Button>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Oder fortfahren mit
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        <Button
          variant="outline"
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOAuthLogin("facebook")}
          disabled={loading}
        >
          <Icons.facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
}