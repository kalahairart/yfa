import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Villa } from '../types/villa';

// Detect Supabase credentials from either VITE_ or NEXT_PUBLIC_ env vars,
// or fallback to interactive developer tester stored in localStorage.
export const getSupabaseConfig = () => {
  const envUrl = 
    (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ||
    '';

  const envKey = 
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
    '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('lahomes_sb_url') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('lahomes_sb_anon_key') || '' : '';

  const finalUrl = (envUrl || localUrl).trim();
  const finalKey = (envKey || localKey).trim();
  const source = envUrl ? 'env' : localUrl ? 'localStorage' : 'none';

  const isValidUrl = finalUrl.startsWith('https://') && finalUrl.includes('supabase.co');
  const isValidKey = finalKey.length > 20;

  return {
    url: finalUrl,
    key: finalKey,
    source: source as 'env' | 'localStorage' | 'none',
    isConfigured: Boolean(isValidUrl && isValidKey),
    isValidUrl,
    isValidKey,
    hasEnvUrl: Boolean(envUrl),
    hasEnvKey: Boolean(envKey),
  };
};

export const saveCustomSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('lahomes_sb_url', url.trim());
    else localStorage.removeItem('lahomes_sb_url');
    
    if (key) localStorage.setItem('lahomes_sb_anon_key', key.trim());
    else localStorage.removeItem('lahomes_sb_anon_key');
  }
};

export const clearCustomSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lahomes_sb_url');
    localStorage.removeItem('lahomes_sb_anon_key');
  }
};

let clientInstance: SupabaseClient | null = null;
let lastClientUrl = '';
let lastClientKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  if (clientInstance && lastClientUrl === config.url && lastClientKey === config.key) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    lastClientUrl = config.url;
    lastClientKey = config.key;
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export interface SupabaseHealthReport {
  isConfigured: boolean;
  source: 'env' | 'localStorage' | 'none';
  url: string;
  maskedKey: string;
  authConnected: boolean;
  dbConnected: boolean;
  tableVillasFound: boolean;
  villaCount: number | null;
  latencyMs: number | null;
  currentUserEmail: string | null;
  status: 'connected' | 'not_configured' | 'schema_needed' | 'error';
  error?: string;
  advice?: string;
}

export const testSupabaseConnection = async (): Promise<SupabaseHealthReport> => {
  const config = getSupabaseConfig();
  const startTime = Date.now();

  const maskedKey = config.key 
    ? `${config.key.slice(0, 8)}...${config.key.slice(-6)}` 
    : '';

  const report: SupabaseHealthReport = {
    isConfigured: config.isConfigured,
    source: config.source,
    url: config.url ? config.url.replace(/(https:\/\/[a-z0-9]+)\.supabase\.co.*/, '$1.supabase.co') : '',
    maskedKey,
    authConnected: false,
    dbConnected: false,
    tableVillasFound: false,
    villaCount: null,
    latencyMs: null,
    currentUserEmail: null,
    status: 'not_configured',
  };

  if (!config.isConfigured) {
    report.status = 'not_configured';
    report.error = 'Variabel environment Supabase belum terdeteksi.';
    report.advice = 'Masukkan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY (atau NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY) di Vercel Dashboard > Project Settings > Environment Variables, kemudian lakukan Redeploy.';
    return report;
  }

  const client = getSupabaseClient();
  if (!client) {
    report.status = 'error';
    report.error = 'Gagal inisialisasi Supabase Client.';
    return report;
  }

  try {
    // 1. Test Auth ping
    const { data: sessionData, error: authError } = await client.auth.getSession();
    if (!authError) {
      report.authConnected = true;
      report.currentUserEmail = sessionData.session?.user?.email || null;
    }

    // 2. Test DB Query to 'villas' table
    const { count, error: dbError } = await client
      .from('villas')
      .select('*', { count: 'exact', head: true });

    report.latencyMs = Date.now() - startTime;

    if (!dbError) {
      report.dbConnected = true;
      report.tableVillasFound = true;
      report.villaCount = count ?? 0;
      report.status = 'connected';
    } else {
      if (dbError.code === '42P01') {
        // Table doesn't exist yet
        report.dbConnected = true;
        report.tableVillasFound = false;
        report.status = 'schema_needed';
        report.error = 'Koneksi database PostgreSQL Supabase BERHASIL, namun tabel "villas" belum dibuat.';
        report.advice = 'Buka Supabase Dashboard > SQL Editor, jalankan script skema tabel yang ada di tab "Skema SQL Supabase".';
      } else {
        report.status = 'error';
        report.error = `Database Error (${dbError.code || 'UNKNOWN'}): ${dbError.message}`;
        report.advice = 'Periksa permission/RLS pada tabel atau pastikan URL dan Anon Key sudah benar.';
      }
    }

    return report;
  } catch (err: any) {
    report.latencyMs = Date.now() - startTime;
    report.status = 'error';
    report.error = err?.message || 'Gagal menghubungi server Supabase (Network / CORS error)';
    report.advice = 'Pastikan URL Supabase berawalan https:// dan Anon Key sesuai yang tertera di Project Settings > API Supabase.';
    return report;
  }
};

// ==========================================
// AUTHENTICATION HELPERS
// ==========================================

export const signInWithSupabase = async (email: string, password: string) => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client belum terhubung. Konfigurasikan environment variables di Vercel terlebih dahulu.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUpWithSupabase = async (email: string, password: string, fullName: string) => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client belum terhubung. Konfigurasikan environment variables di Vercel terlebih dahulu.');
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'agent',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOutFromSupabase = async () => {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
};

// ==========================================
// DATABASE QUERY HELPERS
// ==========================================

export const fetchVillasFromSupabase = async (): Promise<Villa[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('villas')
      .select(`
        *,
        villa_images (
          image_url,
          is_primary,
          display_order
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((item: any) => {
      const images: string[] = item.villa_images && item.villa_images.length > 0
        ? item.villa_images
            .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
            .map((img: any) => img.image_url)
        : [];

      return {
        id: item.id,
        title: item.title,
        slug: item.slug || item.id,
        description: item.description,
        address: item.address,
        city: item.city,
        price_rent_daily: item.price_rent_daily ? Number(item.price_rent_daily) : undefined,
        price_rent_monthly: item.price_rent_monthly ? Number(item.price_rent_monthly) : undefined,
        price_rent_yearly: item.price_rent_yearly ? Number(item.price_rent_yearly) : undefined,
        price_sale: item.price_sale ? Number(item.price_sale) : undefined,
        status: item.status,
        transaction_type: item.transaction_type,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        building_size: Number(item.building_size),
        land_size: Number(item.land_size),
        features: Array.isArray(item.features) ? item.features : [],
        is_featured: Boolean(item.is_featured),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'],
        created_at: item.created_at,
        views_count: item.views_count || 0,
      };
    });
  } catch {
    return null;
  }
};
