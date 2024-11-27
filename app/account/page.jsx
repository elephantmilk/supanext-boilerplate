import { getServerSupabase } from '@/lib/supabase/server';
import AccountForm from './AccountForm';
import { redirect } from 'next/navigation';

const Page = async () => {
  const supabase = getServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

  return (
    <div className="max-w-[600px] mx-auto py-6">
      <AccountForm />
    </div>
  );
};

export default Page;
