"use server";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getServerSupabase() {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}

export async function getProfile(userId) {
  if (!userId) return { data: null };
  
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return { error };
  return { data };
} 