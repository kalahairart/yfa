export type VillaStatus = 'available' | 'rented' | 'sold' | 'under_maintenance';

export type TransactionType = 'rent' | 'sale' | 'both';

export type CertificateType = 'SHM (Hak Milik)' | 'HGB (Hak Guna Bangunan)' | 'Hak Pakai' | 'Leasehold 25-30 Tahun' | 'Leasehold > 30 Tahun';

export interface Villa {
  id: string;
  title: string;
  slug: string;
  description: string;
  address: string;
  city: string; // e.g., 'Canggu', 'Uluwatu', 'Ubud', 'Seminyak', 'Sanur'
  price_rent_daily?: number;
  price_rent_monthly?: number;
  price_rent_yearly?: number;
  price_sale?: number;
  status: VillaStatus;
  transaction_type: TransactionType;
  bedrooms: number;
  bathrooms: number;
  building_size: number; // m2
  land_size: number; // m2 / are
  features: string[];
  is_featured: boolean;
  images: string[];
  created_at: string;
  views_count?: number;
  owner_id?: string;
  agent_id?: string;
  agent_name?: string;
  agent_phone?: string;
}

export interface VillaOwner {
  id: string;
  villa_id: string;
  villa_title?: string;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  certificate_type: CertificateType;
  lease_expiry_year?: number;
  commission_rate: string; // e.g. "5% Penjualan" / "10% Sewa"
  notes: string;
  bank_account?: string;
}

export interface VillaInquiry {
  id: string;
  villa_id: string;
  villa_title: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  message: string;
  status: 'new' | 'contacted' | 'viewing_scheduled' | 'negotiation' | 'won' | 'closed';
  preferred_date?: string;
  created_at: string;
  inquiry_type: 'rent_daily' | 'rent_monthly' | 'rent_yearly' | 'buy';
}

export interface PublicSearchFilter {
  location: string;
  transaction_type: 'all' | 'rent' | 'sale';
  bedrooms: string;
  category: string;
  maxPrice: number;
}
