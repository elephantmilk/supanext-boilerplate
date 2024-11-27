import { supaAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = supaAdmin();
  
  const testUser = {
    email: 'test@heritaxa.com',
    password: 'test123!',
    user_metadata: {
      full_name: 'Test User'
    }
  };

  try {
    // Benutzer in Supabase Auth erstellen
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,  // Email direkt bestätigen
      user_metadata: testUser.user_metadata
    });

    if (signUpError) {
      console.error('SignUp error:', signUpError);
      throw signUpError;
    }

    return NextResponse.json({ 
      message: "Test-Benutzer erfolgreich erstellt",
      credentials: {
        email: testUser.email,
        password: testUser.password
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: error.status || 500 }
    );
  }
} 