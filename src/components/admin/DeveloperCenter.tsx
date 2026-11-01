import React, { useState } from 'react';
import { 
  Code2, 
  Database, 
  FolderTree, 
  Server, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  Sparkles,
  Key,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Globe,
  FileCode
} from 'lucide-react';

export const DeveloperCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'folder' | 'vercel' | 'roadmap'>('sql');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedVarName, setCopiedVarName] = useState<string | null>(null);
  const [vercelMethod, setVercelMethod] = useState<'manual' | 'integration'>('manual');

  const supabaseSqlScript = `-- ====================================================================
-- LAHOMES VILLA MANAGEMENT & LISTING DASHBOARD
-- COMPLETE SUPABASE POSTGRESQL SCHEMA WITH AUTH, RLS & STORAGE
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom ENUM Types (Safely created if not already existing)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'villa_status') THEN
    CREATE TYPE villa_status AS ENUM ('available', 'rented', 'sold', 'under_maintenance');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
    CREATE TYPE transaction_type AS ENUM ('rent', 'sale', 'both');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
    CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'viewing_scheduled', 'negotiation', 'won', 'closed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'certificate_type') THEN
    CREATE TYPE certificate_type AS ENUM ('SHM (Hak Milik)', 'HGB (Hak Guna Bangunan)', 'Hak Pakai', 'Leasehold 25-30 Tahun', 'Leasehold > 30 Tahun');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'principal_broker', 'agent', 'staff');
  END IF;
END $$;

-- ====================================================================
-- 3. USERS / AGENT PROFILES TABLE (Linked with Supabase auth.users)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'agent' NOT NULL CHECK (role IN ('super_admin', 'admin', 'principal_broker', 'agent', 'staff')),
  avatar_url TEXT,
  license_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ====================================================================
-- 4. AUTOMATIC AUTH TRIGGER (Sync auth.users -> public.users)
-- Otomatis membuat baris profil saat ada user baru terdaftar di Auth
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, phone, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(LOWER(NEW.raw_user_meta_data->>'role'), 'agent'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper Function: Check Admin / Agent
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'principal_broker', 'agent')
  );
END;
$$;

-- ====================================================================
-- 5. VILLAS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.villas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  price_rent_daily NUMERIC(12, 2),
  price_rent_monthly NUMERIC(12, 2),
  price_rent_yearly NUMERIC(12, 2),
  price_sale NUMERIC(14, 2),
  status villa_status DEFAULT 'available' NOT NULL,
  transaction_type transaction_type DEFAULT 'both' NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  building_size NUMERIC(8, 2) NOT NULL, -- in m2
  land_size NUMERIC(8, 2) NOT NULL,     -- in m2 / are
  features JSONB DEFAULT '[]'::jsonb NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  agent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- 6. VILLA IMAGES TABLE (Storage links)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.villa_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  villa_id UUID NOT NULL REFERENCES public.villas(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- 7. OWNERS / LANDLORDS TABLE (Confidential - Restricted to Agents)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  villa_id UUID REFERENCES public.villas(id) ON DELETE SET NULL,
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,
  certificate_type certificate_type DEFAULT 'SHM (Hak Milik)',
  lease_expiry_year INTEGER,
  commission_rate TEXT DEFAULT '5% Jual / 10% Sewa',
  bank_account TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- 8. INQUIRIES / LEADS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  villa_id UUID REFERENCES public.villas(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  message TEXT NOT NULL,
  status inquiry_status DEFAULT 'new' NOT NULL,
  preferred_date DATE,
  inquiry_type TEXT DEFAULT 'rent_daily',
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villa_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 9.1 Users Profile Policies:
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.users;
CREATE POLICY "Admins can view all user profiles" 
  ON public.users FOR SELECT USING (public.is_admin());

-- 9.2 Villas Policies:
DROP POLICY IF EXISTS "Public users can view active villas" ON public.villas;
CREATE POLICY "Public users can view active villas" 
  ON public.villas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated agents can manage villas" ON public.villas;
CREATE POLICY "Authenticated agents can manage villas" 
  ON public.villas FOR ALL USING (auth.role() = 'authenticated');

-- 9.3 Villa Images Policies:
DROP POLICY IF EXISTS "Public users can view villa images" ON public.villa_images;
CREATE POLICY "Public users can view villa images" 
  ON public.villa_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated agents can manage villa images" ON public.villa_images;
CREATE POLICY "Authenticated agents can manage villa images" 
  ON public.villa_images FOR ALL USING (auth.role() = 'authenticated');

-- 9.4 Inquiries Policies:
DROP POLICY IF EXISTS "Public guests can submit inquiries" ON public.inquiries;
CREATE POLICY "Public guests can submit inquiries" 
  ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated agents can view and manage inquiries" ON public.inquiries;
CREATE POLICY "Authenticated agents can view and manage inquiries" 
  ON public.inquiries FOR ALL USING (auth.role() = 'authenticated');

-- 9.5 Owners Policies (STRICT CONFIDENTIALITY):
DROP POLICY IF EXISTS "Only authenticated agents can view owners" ON public.owners;
CREATE POLICY "Only authenticated agents can view owners" 
  ON public.owners FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated agents can manage owners" ON public.owners;
CREATE POLICY "Only authenticated agents can manage owners" 
  ON public.owners FOR ALL USING (auth.role() = 'authenticated');

-- ====================================================================
-- 10. STORAGE BUCKET CONFIGURATION (Supabase Storage)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('villa-photos', 'villa-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view villa photos" ON storage.objects;
CREATE POLICY "Public can view villa photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'villa-photos');

DROP POLICY IF EXISTS "Agents can upload villa photos" ON storage.objects;
CREATE POLICY "Agents can upload villa photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'villa-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Agents can delete villa photos" ON storage.objects;
CREATE POLICY "Agents can delete villa photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'villa-photos' AND auth.role() = 'authenticated');

-- ====================================================================
-- 11. CARA MEMBUAT AKUN ADMIN PERTAMA DI SUPABASE
-- ====================================================================
-- Cara 1 (Paling Mudah): Buka Supabase Dashboard -> Authentication -> Users
-- Klik "Add User" -> Masukkan Email & Password -> Centang "Auto Confirm User".
--
-- Cara 2 (SQL):
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
-- VALUES (gen_random_uuid(), 'candra.rusman@lahomes.realestate', crypt('admin123', gen_salt('bf')), NOW(), '{"full_name":"Candra Rusman","role":"principal_broker"}');
`;

  const folderStructureText = `my-villa-platform/
├── app/
│   ├── (public)/                     # Halaman Publik (Guest / Buyer)
│   │   ├── layout.tsx                # Public Layout (Header, Footer, WhatsApp Floating CTA)
│   │   ├── page.tsx                  # Homepage (Hero Search, Featured Villas, Filter Lokasi)
│   │   ├── villas/
│   │   │   ├── page.tsx              # Public Listing Catalog (Search & Filters)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Villa Detail Page (Gallery, Specs, WhatsApp CTA, ROI Calc)
│   │   └── contact/
│   │       └── page.tsx              # Halaman Kontak Agen & Kantor
│   ├── (admin)/                      # Dashboard Internal Agen (Lahomes)
│   │   ├── layout.tsx                # Admin Layout (Lahomes Sidebar, Navbar, Dark Mode)
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Overview Analytics & KPI Metrik
│   │   ├── villas/
│   │   │   ├── page.tsx              # Villa Management (Tabel CRUD & Status Switcher)
│   │   │   ├── new/page.tsx          # Form Tambah Villa Baru + Upload Foto Supabase
│   │   │   └── [id]/edit/page.tsx    # Form Edit Villa
│   │   ├── leads/
│   │   │   └── page.tsx              # Leads & Inquiries CRM Pipeline
│   │   ├── owners/
│   │   │   └── page.tsx              # Confidential Owner / Landlord Tracker
│   │   └── settings/
│   │       └── page.tsx              # Profil Agen, WhatsApp Config & Tema
│   ├── api/
│   │   ├── inquiries/route.ts        # Webhook / Endpoint penerima inquiry publik
│   │   └── upload/route.ts           # Supabase Storage presigned URL handler
│   ├── layout.tsx                    # Root Layout (Font Plus Jakarta Sans, ThemeProvider)
│   └── globals.css                   # Tailwind CSS v4 / Shadcn Styles
├── components/
│   ├── ui/                           # Shadcn UI Components (Button, Dialog, Badge, Input, Table)
│   ├── public/                       # Komponen Khusus Website Publik
│   │   ├── HeroSearch.tsx
│   │   ├── VillaCard.tsx
│   │   ├── RoiCalculator.tsx
│   │   └── WhatsAppButton.tsx
│   └── admin/                        # Komponen Khusus Dashboard Lahomes
│       ├── StatCards.tsx
│       ├── VillaTable.tsx
│       ├── LeadsPipeline.tsx
│       └── OwnerSecretCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Client (@supabase/ssr)
│   │   ├── server.ts                 # Server Component Client
│   │   └── middleware.ts             # Auth Session Refresh & Route Protection
│   └── utils.ts                      # Currency Formatter (IDR/USD), WhatsApp URL Builder
├── types/
│   └── database.types.ts             # Generated TypeScript types dari Supabase CLI
├── middleware.ts                     # Protect /dashboard & /admin routes
├── .env.local                        # Supabase & Vercel Keys
└── package.json`;

  const envVariablesText = `# ====================================================================
# SUPABASE & VERCEL ENVIRONMENT VARIABLES (.env.local)
# ====================================================================

# 1. Supabase Project Credentials (dari Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Supabase Service Role Key (Hanya untuk Server-side API / Backend, JANGAN di-expose ke client!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 3. Agent Default Contact Config
NEXT_PUBLIC_AGENT_WHATSAPP_NUMBER=6281234567890
NEXT_PUBLIC_AGENT_NAME="Candra Rusman"
NEXT_PUBLIC_AGENT_ROLE="Principal Villa Broker"

# 4. Deployment Base URL (Otomatis diisi oleh Vercel di production)
NEXT_PUBLIC_SITE_URL=https://lahomes-villa.vercel.app`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([supabaseSqlScript], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supabase_villa_schema.sql';
    a.click();
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envVariablesText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleCopyVar = (varName: string) => {
    navigator.clipboard.writeText(varName);
    setCopiedVarName(varName);
    setTimeout(() => setCopiedVarName(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Next.js & Supabase Developer Center
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Full-Stack Specs
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Arsitektur teknis lengkap, skema database PostgreSQL Supabase dengan RLS, struktur folder Next.js App Router, dan panduan deployment ke Vercel.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sql'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Skema SQL Supabase</span>
          </button>

          <button
            onClick={() => setActiveTab('folder')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'folder'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Struktur Folder Next.js</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Vercel & Env Vars</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Langkah Deployment</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Supabase SQL Script */}
      {activeTab === 'sql' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>Supabase PostgreSQL Migration Script (DDL + RLS + Storage)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Buka menu <strong>SQL Editor</strong> di dashboard Supabase Anda, lalu tempel dan jalankan script ini.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
              </button>

              <button
                onClick={handleDownloadSql}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .sql</span>
              </button>
            </div>
          </div>

          {/* Syntax Code block */}
          <div className="relative rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto border border-slate-800">
            <pre className="whitespace-pre-wrap">{supabaseSqlScript}</pre>
          </div>
        </div>
      )}

      {/* Tab 2: Next.js Folder Structure */}
      {activeTab === 'folder' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-emerald-500" />
                <span>Next.js 15 (App Router) Modular Architecture</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Struktur Route Groups: <code>(public)</code> untuk guest/buyer & <code>(admin)</code> untuk Lahomes Dashboard.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 text-emerald-400 p-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto border border-slate-800">
            <pre className="text-slate-300 whitespace-pre-wrap">{folderStructureText}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: Vercel & Env Vars */}
      {activeTab === 'vercel' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Koneksi Supabase via Vercel Environment Variables</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 font-bold border border-emerald-500/30">
                      Tanpa File .env di Repo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Standar industri Next.js: kredensial Supabase diatur langsung di Vercel Dashboard secara terenkripsi.
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setVercelMethod('manual')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  vercelMethod === 'manual'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Input di Settings Vercel</span>
              </button>
              <button
                onClick={() => setVercelMethod('integration')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  vercelMethod === 'integration'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click Vercel Integration</span>
              </button>
            </div>
          </div>

          {/* Security Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 block">
                Mengapa Tidak Menggunakan File .env di Git/Vercel?
              </span>
              <p className="text-amber-800/90 dark:text-amber-400/90 leading-relaxed">
                File <code>.env</code> atau <code>.env.local</code> <strong>tidak boleh di-commit ke Git/GitHub</strong> karena berisi kunci kredensial. Di platform cloud modern seperti Vercel, variabel disuntikkan secara aman langsung melalui menu <strong>Environment Variables</strong> saat proses build dan runtime di server Vercel.
              </p>
            </div>
          </div>

          {/* METHOD 1: MANUAL INPUT IN VERCEL DASHBOARD */}
          {vercelMethod === 'manual' && (
            <div className="space-y-6">
              {/* Variable Keys List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Daftar Environment Variables yang Perlu Didaftarkan di Vercel:</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Klik tombol salin untuk copy nama Key</span>
                </div>

                <div className="space-y-2.5">
                  {/* Var 1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          NEXT_PUBLIC_SUPABASE_URL
                        </code>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                          Public (Browser & Server)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        URL Project Supabase Anda. Ambil di Supabase Dashboard ➔ <strong>Project Settings</strong> ➔ <strong>API</strong> ➔ <strong>Project URL</strong> (contoh: <code>https://xyzcompany.supabase.co</code>).
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyVar('NEXT_PUBLIC_SUPABASE_URL')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto shrink-0 transition-colors shadow-2xs"
                    >
                      {copiedVarName === 'NEXT_PUBLIC_SUPABASE_URL' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Key</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Var 2 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          NEXT_PUBLIC_SUPABASE_ANON_KEY
                        </code>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                          Public Anon Key
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kunci anonim publik Supabase. Ambil di Supabase Dashboard ➔ <strong>Project Settings</strong> ➔ <strong>API</strong> ➔ <strong>Project API Keys (anon public)</strong>.
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto shrink-0 transition-colors shadow-2xs"
                    >
                      {copiedVarName === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Key</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Var 3 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/20">
                          SUPABASE_SERVICE_ROLE_KEY
                        </code>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                          Server-Only (Private)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Hanya untuk Server Action / API Route backend jika diperlukan bypass RLS. <strong>Jangan beri prefix NEXT_PUBLIC_!</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyVar('SUPABASE_SERVICE_ROLE_KEY')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto shrink-0 transition-colors shadow-2xs"
                    >
                      {copiedVarName === 'SUPABASE_SERVICE_ROLE_KEY' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Key</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Var 4 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          NEXT_PUBLIC_AGENT_WHATSAPP_NUMBER
                        </code>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          WhatsApp Bot/Lead
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Nomor kontak WhatsApp Agen untuk tombol WhatsApp otomatis di halaman detail villa (contoh: <code>6281234567890</code>).
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyVar('NEXT_PUBLIC_AGENT_WHATSAPP_NUMBER')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto shrink-0 transition-colors shadow-2xs"
                    >
                      {copiedVarName === 'NEXT_PUBLIC_AGENT_WHATSAPP_NUMBER' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Key</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Steps Tutorial di Vercel UI */}
              <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>4 Langkah Mudah Memasukkan Variables di Dashboard Vercel:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                      Buka Settings di Vercel
                    </span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Buka <strong>vercel.com</strong> ➔ Klik project Anda (e.g. <code>lahomes-villa</code>) ➔ Klik tab <strong>Settings</strong> di menu atas.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                      Pilih Environment Variables
                    </span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Di sidebar kiri Settings, klik <strong>Environment Variables</strong>. Di sini Anda akan melihat form input <code>Key</code> dan <code>Value</code>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                      Input Key & Value + Centang Target
                    </span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Masukkan nama Key (misal <code>NEXT_PUBLIC_SUPABASE_URL</code>) & Value dari Supabase. Centang ketiga opsi: <strong>Production</strong>, <strong>Preview</strong>, dan <strong>Development</strong>. Klik <strong>Save</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="flex items-center gap-2 font-bold text-white">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">4</span>
                      Redeploy Project Anda
                    </span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Agar Environment Variables yang baru masuk terbaca, buka tab <strong>Deployments</strong> ➔ Klik titik tiga (...) pada deployment terbaru ➔ Klik <strong>Redeploy</strong>. Selesai!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* METHOD 2: VERCEL MARKETPLACE 1-CLICK INTEGRATION */}
          {vercelMethod === 'integration' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <Zap className="w-5 h-5" />
                  <span>Integrasi Resmi Vercel ⚡ Supabase (100% Otomatis)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Vercel menyediakan integrasi native resmi di Vercel Marketplace. Dengan cara ini, Anda <strong>tidak perlu menyalin satupun URL atau Key</strong>; Vercel akan otomatis menyinkronkan seluruh kredensial database Supabase ke Environment Variables project Anda.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Kunjungi Marketplace Supabase di Vercel:</span>
                      <a 
                        href="https://vercel.com/integrations/supabase" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline mt-0.5"
                      >
                        <span>vercel.com/integrations/supabase</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Klik "Add Integration"</span>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Pilih Vercel Scope (Akun pribadi atau Tim) dan pilih project <strong>Lahomes Villa Management</strong> Anda.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Pilih Project Supabase</span>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Pilih project Supabase yang sudah Anda buat. Klik <strong>Connect</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Semua Variabel Terhubung Otomatis!</span>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Vercel otomatis membuat variabel <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, dan <code>POSTGRES_URL</code> di project Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOW NEXT.JS CODE CONSUMES VERCEL ENV VARS (NO .ENV NEEDED) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bagaimana Kode Next.js Membaca Variabel Vercel Tanpa File .env:</span>
              </h4>
              <span className="text-[11px] text-slate-400">lib/supabase/client.ts & lib/supabase/server.ts</span>
            </div>

            <div className="rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-[11px] leading-relaxed border border-slate-800 space-y-3 overflow-x-auto">
              <div>
                <span className="text-slate-500">// 1. Client Component Client (lib/supabase/client.ts):</span>
                <pre className="text-emerald-400">{`import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Langsung membaca nilai dari Vercel Environment Variables saat build & runtime
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}`}</pre>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500">// 2. Server Component / Route Handler Client (lib/supabase/server.ts):</span>
                <pre className="text-emerald-400">{`import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ditangani otomatis saat dipanggil dari Server Component
          }
        },
      },
    }
  )
}`}</pre>
              </div>
            </div>
          </div>

          {/* Quick Tip: Local Dev sync via Vercel CLI */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs">
            <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">
                Tips Testing di Komputer Lokal Tanpa Mengetik File .env Manual:
              </span>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Jika Anda ingin menjalankan <code>npm run dev</code> di komputer lokal, Anda tidak perlu mengetik variabel satu per satu. Cukup gunakan Vercel CLI untuk menarik variabel yang sudah Anda simpan di Vercel Dashboard langsung ke laptop:
              </p>
              <code className="inline-block bg-slate-900 text-emerald-400 px-3 py-1 rounded-lg font-mono text-[11px] mt-1">
                npx vercel env pull .env.local
              </code>
            </div>
          </div>

          {/* Auth Redirect Configuration Reminder */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-start gap-3">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-300">
                Penting: Konfigurasi Supabase Auth Redirect URL di Supabase Dashboard:
              </span>
              <p className="text-blue-800/90 dark:text-blue-300/90 leading-relaxed">
                Di Supabase Dashboard ➔ <strong>Authentication</strong> ➔ <strong>URL Configuration</strong>:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 font-mono text-[11px] text-blue-700 dark:text-blue-300">
                <li>Site URL: <code>https://lahomes-villa.vercel.app</code></li>
                <li>Redirect URLs: <code>https://lahomes-villa.vercel.app/api/auth/callback</code></li>
                <li>Local Test: <code>http://localhost:3000/**</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Step-by-Step Implementation Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span>Panduan Langkah Demi Langkah (Step-by-Step Build & Deploy)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Urutan implementasi dari inisialisasi lokal hingga rilis publik di Vercel.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Inisialisasi Project Next.js & Shadcn UI</h4>
              </div>
              <p className="text-slate-500 dark:text-slate-400 pl-8">
                Jalankan perintah pembuatan project Next.js dengan TypeScript & Tailwind:
              </p>
              <div className="pl-8">
                <code className="block bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-[11px]">
                  npx create-next-app@latest my-villa-platform --typescript --tailwind --eslint --app<br/>
                  cd my-villa-platform<br/>
                  npx shadcn@latest init
                </code>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Install Supabase SSR Client & Icons</h4>
              </div>
              <div className="pl-8">
                <code className="block bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-[11px]">
                  npm install @supabase/supabase-js @supabase/ssr lucide-react
                </code>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Eksekusi Skema Database di Supabase</h4>
              </div>
              <p className="text-slate-500 dark:text-slate-400 pl-8 leading-relaxed">
                Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold underline">supabase.com</a>, buat project baru, klik tab <strong>SQL Editor</strong>, tempel skema SQL dari Tab 1, dan klik <strong>Run</strong>. Tabel, relasi, RLS policies, dan storage bucket <code>villa-photos</code> akan dibuat secara otomatis.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">4</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Deploy Otomatis ke Vercel</h4>
              </div>
              <p className="text-slate-500 dark:text-slate-400 pl-8 leading-relaxed">
                Push kode Anda ke GitHub, buka <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold underline">vercel.com</a> ➔ <strong>Add New Project</strong> ➔ Import Repository ➔ Masukkan nilai <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ➔ Klik <strong>Deploy</strong>. Platform villa Anda langsung live dengan performa global edge network!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
