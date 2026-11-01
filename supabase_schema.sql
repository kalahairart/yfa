-- ====================================================================
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

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ====================================================================
-- 4. AUTOMATIC AUTH TRIGGER (Sync auth.users -> public.users)
-- When user signs up or is created in Supabase Auth, profile is auto-created
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

-- Drop trigger if exists to prevent duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 5. HELPER FUNCTION: Check if current authenticated user is Admin/Agent
-- ====================================================================
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
-- 6. VILLAS TABLE
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

CREATE INDEX IF NOT EXISTS idx_villas_city ON public.villas(city);
CREATE INDEX IF NOT EXISTS idx_villas_status ON public.villas(status);
CREATE INDEX IF NOT EXISTS idx_villas_transaction_type ON public.villas(transaction_type);

-- ====================================================================
-- 7. VILLA IMAGES TABLE (Storage file references)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.villa_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  villa_id UUID NOT NULL REFERENCES public.villas(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_villa_images_villa_id ON public.villa_images(villa_id);

-- ====================================================================
-- 8. OWNERS / LANDLORDS TABLE (Confidential: Strictly Agents Only)
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
-- 9. INQUIRIES / LEADS TABLE
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

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- ====================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villa_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 10.1 Users Profile Policies:
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.users;
CREATE POLICY "Admins can view all user profiles" 
  ON public.users FOR SELECT 
  USING (public.is_admin());

-- 10.2 Villas Policies:
DROP POLICY IF EXISTS "Public users can view active villas" ON public.villas;
CREATE POLICY "Public users can view active villas" 
  ON public.villas FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated agents can manage villas" ON public.villas;
CREATE POLICY "Authenticated agents can manage villas" 
  ON public.villas FOR ALL 
  USING (auth.role() = 'authenticated');

-- 10.3 Villa Images Policies:
DROP POLICY IF EXISTS "Public users can view villa images" ON public.villa_images;
CREATE POLICY "Public users can view villa images" 
  ON public.villa_images FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated agents can manage villa images" ON public.villa_images;
CREATE POLICY "Authenticated agents can manage villa images" 
  ON public.villa_images FOR ALL 
  USING (auth.role() = 'authenticated');

-- 10.4 Inquiries Policies:
DROP POLICY IF EXISTS "Public guests can submit inquiries" ON public.inquiries;
CREATE POLICY "Public guests can submit inquiries" 
  ON public.inquiries FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated agents can view and manage inquiries" ON public.inquiries;
CREATE POLICY "Authenticated agents can view and manage inquiries" 
  ON public.inquiries FOR ALL 
  USING (auth.role() = 'authenticated');

-- 10.5 Owners Policies (STRICT CONFIDENTIALITY):
DROP POLICY IF EXISTS "Only authenticated agents can view owners" ON public.owners;
CREATE POLICY "Only authenticated agents can view owners" 
  ON public.owners FOR SELECT 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only authenticated agents can manage owners" ON public.owners;
CREATE POLICY "Only authenticated agents can manage owners" 
  ON public.owners FOR ALL 
  USING (auth.role() = 'authenticated');

-- ====================================================================
-- 11. STORAGE BUCKET CONFIGURATION (Supabase Storage)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('villa-photos', 'villa-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view photos
DROP POLICY IF EXISTS "Public can view villa photos" ON storage.objects;
CREATE POLICY "Public can view villa photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'villa-photos');

-- Only authenticated agents can upload photos
DROP POLICY IF EXISTS "Agents can upload villa photos" ON storage.objects;
CREATE POLICY "Agents can upload villa photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'villa-photos' AND auth.role() = 'authenticated');

-- Only authenticated agents can delete photos
DROP POLICY IF EXISTS "Agents can delete villa photos" ON storage.objects;
CREATE POLICY "Agents can delete villa photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'villa-photos' AND auth.role() = 'authenticated');

-- ====================================================================
-- 12. CARA MEMBUAT AKUN ADMIN PERTAMA DI SUPABASE (2 METODE)
-- ====================================================================
/*
METODE A (Paling Mudah via Supabase Dashboard UI):
1. Buka dashboard project Supabase Anda.
2. Masuk ke menu "Authentication" -> "Users".
3. Klik tombol "Add User" -> "Create User".
4. Masukkan:
   - Email: candra.rusman@lahomes.realestate
   - Password: password_anda_yang_aman
   - Centang "Auto Confirm User?": YES (agar langsung aktif tanpa verifikasi email).
5. User metadata (opsional) atau update role setelah terbuat:
   UPDATE public.users 
   SET role = 'principal_broker', full_name = 'Candra Rusman' 
   WHERE email = 'candra.rusman@lahomes.realestate';

METODE B (Direct SQL untuk seeding Admin User):
Jalankan query di bawah ini di SQL Editor Supabase:
*/
-- DO $$
-- DECLARE
--   new_user_id UUID := gen_random_uuid();
-- BEGIN
--   INSERT INTO auth.users (
--     id,
--     instance_id,
--     email,
--     encrypted_password,
--     email_confirmed_at,
--     raw_app_meta_data,
--     raw_user_meta_data,
--     created_at,
--     updated_at,
--     role,
--     aud
--   ) VALUES (
--     new_user_id,
--     '00000000-0000-0000-0000-000000000000',
--     'candra.rusman@lahomes.realestate',
--     crypt('admin123', gen_salt('bf')),
--     NOW(),
--     '{"provider":"email","providers":["email"]}',
--     '{"full_name":"Candra Rusman","role":"principal_broker"}',
--     NOW(),
--     NOW(),
--     'authenticated',
--     'authenticated'
--   );
-- END $$;
