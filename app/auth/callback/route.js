import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { error: supabaseError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (supabaseError) {
        console.error('Auth error:', supabaseError);
        return NextResponse.redirect(
          `${requestUrl.origin}/auth?error=${encodeURIComponent(supabaseError.message)}&next=${encodeURIComponent(next)}`
        );
      }

      console.log('Login successful, redirecting to:', next);
      
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
