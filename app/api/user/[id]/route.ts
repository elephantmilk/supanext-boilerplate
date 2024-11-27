import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const data = await request.json();
    
    // Profil Update
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: params.id,
        full_name: data.full_name,
        username: data.username,
        website: data.website,
        updated_at: new Date().toISOString(),
      }, { 
        returning: 'minimal',
        onConflict: 'id' 
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 