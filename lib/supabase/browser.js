import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supaBrowser = () => {
  return createClientComponentClient({
    options: {
      cookies: {
        name: 'sb-auth',
        lifetime: 60 * 60 * 8,
        domain: '',
        path: '/',
        sameSite: 'lax'
      }
    }
  });
};
