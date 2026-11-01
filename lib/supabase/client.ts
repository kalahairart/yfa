import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Otomatis membaca dari Vercel Environment Variables
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
