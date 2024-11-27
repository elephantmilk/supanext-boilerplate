import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import HeaderProfile from "./HeaderProfile";
import { getServerSupabase } from '@/lib/supabase/server';
import { DarkModeToggle } from "./ui/dark-mode-toggle";
import { Button } from "./ui/button";

export default async function Header() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user?.id) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/">
        <div className="text-foreground">{SITE_NAME}</div>
      </Link>

      <div className="flex items-center">
        {user ? (
          <HeaderProfile id={user.id} profile={profile} />
        ) : (
          <Button asChild>
            <Link href="/auth">Login</Link>
          </Button>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}
