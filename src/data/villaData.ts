import { Villa, VillaOwner, VillaInquiry } from '../types/villa';

export const INITIAL_VILLAS: Villa[] = [
  {
    id: 'VLA-001',
    title: 'The Bamboo Sanctuary Eco-Luxury Valley Villa',
    slug: 'the-bamboo-sanctuary-eco-luxury-ubud',
    description: 'Mahakarya arsitektur bambu organik dengan pemandangan lembah sungai tropis yang tenang di Ubud. Menawarkan infinity pool batu alam melengkung, dek kayu ulin yang luas, kamar tidur ber-AC dengan kaca panorama 270 derajat, dan dapur terbuka bergaya desainer.',
    address: 'Jl. Raya Sayan, Banjar Baung, Sayan',
    city: 'Ubud',
    price_rent_daily: 450, // USD
    price_rent_monthly: 6500,
    price_rent_yearly: 58000,
    price_sale: 890000, // USD (sekitar Rp 14.2 M)
    status: 'available',
    transaction_type: 'both',
    bedrooms: 3,
    bathrooms: 4,
    building_size: 420,
    land_size: 850,
    features: [
      'Private Curved Infinity Pool',
      'Jungle & River Valley View',
      'High-Speed Starlink WiFi',
      'Open-Air Designer Kitchen',
      'Sunken Lounge Deck',
      'Bathtub Terbuka (Open Air Bath)',
      'Solar Powered Backup',
      'Staff Quarters & Daily Butler'
    ],
    is_featured: true,
    images: [
      '/src/assets/images/villa_tropical_bamboo_1792908924954.jpg',
      '/src/assets/images/property_luxury_villa_1792833743009.jpg',
      '/src/assets/images/villa_mediterranean_bali_1792908924438.jpg'
    ],
    created_at: '2026-10-12',
    views_count: 4210,
    owner_id: 'OWN-101',
    agent_id: 'AGT-01',
    agent_name: 'Candra Rusman (Principal Villa Broker)',
    agent_phone: '+6281234567890'
  },
  {
    id: 'VLA-002',
    title: 'Casa Blanca Mediterranean Arches & Sunken Lounge Villa',
    slug: 'casa-blanca-mediterranean-canggu',
    description: 'Villa bergaya bohemian Mediterania kontemporer di jantung Canggu. Dinding plester putih lengkung yang estetik, kolam renang pirus dengan sunken conversation pit lounge, ruang makan gazebo jerami tropis, dan interior minimalis berkelas.',
    address: 'Jl. Nelayan No. 24, Pantai Batu Bolong',
    city: 'Canggu',
    price_rent_daily: 550,
    price_rent_monthly: 8200,
    price_rent_yearly: 72000,
    price_sale: 1250000,
    status: 'available',
    transaction_type: 'both',
    bedrooms: 4,
    bathrooms: 5,
    building_size: 510,
    land_size: 680,
    features: [
      'Sunken Conversation Pit in Pool',
      'Walking Distance to Nelayan Beach',
      'En-Suite Bathrooms with Skylight',
      'Mediterranean Plaster Arches',
      'Private Parking Garage for 2 Cars',
      'Full Furnished Custom Teak Furniture',
      'Smart Home Security & CCTV',
      'Outdoor BBQ Dining Pavilion'
    ],
    is_featured: true,
    images: [
      '/src/assets/images/villa_mediterranean_bali_1792908924438.jpg',
      '/src/assets/images/property_luxury_villa_1792833743009.jpg',
      '/src/assets/images/property_modern_suburban_1792833742979.jpg'
    ],
    created_at: '2026-10-18',
    views_count: 5890,
    owner_id: 'OWN-102',
    agent_id: 'AGT-01',
    agent_name: 'Candra Rusman (Principal Villa Broker)',
    agent_phone: '+6281234567890'
  },
  {
    id: 'VLA-003',
    title: 'Cliffside Horizon Ultra-Luxury Sunset Oceanfront Villa',
    slug: 'cliffside-horizon-oceanfront-uluwatu',
    description: 'Villa spektakuler bertingkat di tebing karang Uluwatu dengan pemandangan samudera Hindia tak terhalang. Kolam renang infinity tepi tebing sepanjang 22 meter, perapian luar ruangan (fire pit), dan kaca lantai-ke-langit-langit ganda kedap suara.',
    address: 'Jl. Pantai Suluban, Pecatu',
    city: 'Uluwatu',
    price_rent_daily: 1200,
    price_rent_monthly: 18500,
    price_rent_yearly: 160000,
    price_sale: 2750000,
    status: 'rented',
    transaction_type: 'both',
    bedrooms: 5,
    bathrooms: 6,
    building_size: 780,
    land_size: 1400,
    features: [
      '22m Olympic Cliffside Infinity Pool',
      '180-Degree Unobstructed Ocean View',
      'Outdoor Fire Pit & Sunken Lounge',
      'Wine Cellar & Cigar Lounge',
      'Gym & Spa Suite',
      'Helipad Access Nearby',
      'Gated 24/7 VIP Security',
      'Generator Genset 100% Back-Up'
    ],
    is_featured: true,
    images: [
      '/src/assets/images/property_luxury_villa_1792833743009.jpg',
      '/src/assets/images/property_penthouse_skyline_1792833742837.jpg'
    ],
    created_at: '2026-09-28',
    views_count: 8320,
    owner_id: 'OWN-103',
    agent_id: 'AGT-01',
    agent_name: 'Candra Rusman (Principal Villa Broker)',
    agent_phone: '+6281234567890'
  },
  {
    id: 'VLA-004',
    title: 'The Timber Slats Modern Minimalist Estate',
    slug: 'timber-slats-modern-seminyak',
    description: 'Residensi modern kontemporer dengan fasad kisi-kisi kayu ulin dan beton ekspos yang elegan di kawasan tenang Seminyak. Sangat cocok untuk keluarga ekspatriat atau sewa jangka panjang dengan privasi tinggi.',
    address: 'Jl. Drupadi II No. 8, Seminyak',
    city: 'Seminyak',
    price_rent_monthly: 4200,
    price_rent_yearly: 44000,
    price_sale: 690000,
    status: 'available',
    transaction_type: 'rent',
    bedrooms: 3,
    bathrooms: 3,
    building_size: 340,
    land_size: 450,
    features: [
      'Private Swimming Pool',
      'Lush Tropical Garden',
      'Enclosed Living & Dining Room',
      'Modern Island Kitchen with Dishwasher',
      'Double Carport with Electric Gate',
      'Fast Fiber Optic Internet',
      'Maid Room & Laundry Area'
    ],
    is_featured: false,
    images: [
      '/src/assets/images/property_modern_suburban_1792833742979.jpg',
      '/src/assets/images/villa_mediterranean_bali_1792908924438.jpg'
    ],
    created_at: '2026-10-05',
    views_count: 2740,
    owner_id: 'OWN-104',
    agent_id: 'AGT-01',
    agent_name: 'Candra Rusman (Principal Villa Broker)',
    agent_phone: '+6281234567890'
  },
  {
    id: 'VLA-005',
    title: 'The Grand Royal Penthouse Villa Sky Residence',
    slug: 'grand-royal-penthouse-villa-sanur',
    description: 'Unit penthouse villa eksklusif di Sanur dengan teras atap privat seluas 180 m2 dan kolam air hangat pribadi. Menikmati matahari terbit (sunrise) pantai timur Bali setiap pagi.',
    address: 'Jl. Danau Tamblingan, Sanur Beachfront',
    city: 'Sanur',
    price_rent_daily: 680,
    price_rent_monthly: 9500,
    price_sale: 1650000,
    status: 'sold',
    transaction_type: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    building_size: 490,
    land_size: 550,
    features: [
      'Rooftop Jacuzzi & Heated Plunge Pool',
      'Direct Private Beach Access',
      'Panoramic Sunrise Ocean View',
      'Private Elevator Access',
      'Full Concierge & Valet Service',
      'Marble Bathrooms with Double Vanity'
    ],
    is_featured: false,
    images: [
      '/src/assets/images/property_penthouse_skyline_1792833742837.jpg',
      '/src/assets/images/property_luxury_villa_1792833743009.jpg'
    ],
    created_at: '2026-09-15',
    views_count: 4910,
    owner_id: 'OWN-105',
    agent_id: 'AGT-01',
    agent_name: 'Candra Rusman (Principal Villa Broker)',
    agent_phone: '+6281234567890'
  }
];

export const INITIAL_OWNERS: VillaOwner[] = [
  {
    id: 'OWN-101',
    villa_id: 'VLA-001',
    villa_title: 'The Bamboo Sanctuary Eco-Luxury Valley Villa',
    owner_name: 'I Made Suardana / PT Ubud Bamboo Retreat',
    owner_phone: '+62 813-3890-1122',
    owner_email: 'suardana.ubud@gmail.com',
    certificate_type: 'SHM (Hak Milik)',
    commission_rate: '3.5% Jual / 10% Sewa',
    notes: 'Sertifikat SHM asli disimpan di Notaris I Nyoman Sukerta, Denpasar. Izin IMB/Pondok Wisata aktif dan siap ditransaksikan.',
    bank_account: 'BCA 7720188921 a/n I Made Suardana'
  },
  {
    id: 'OWN-102',
    villa_id: 'VLA-002',
    villa_title: 'Casa Blanca Mediterranean Canggu',
    owner_name: 'Jean-Pierre Laurent & Ketut Ariani',
    owner_phone: '+62 811-3940-5588',
    owner_email: 'jp.laurent@baliinvestment.fr',
    certificate_type: 'Leasehold 25-30 Tahun',
    lease_expiry_year: 2054,
    commission_rate: '5% Jual / 8% Sewa',
    notes: 'Leasehold berakhir tahun 2054 dengan opsi perpanjangan terjamin 15 tahun tambahan di harga pasar tanah. Pajak sewa ditanggung pemilik.',
    bank_account: 'Mandiri 14500098231 a/n Ketut Ariani'
  },
  {
    id: 'OWN-103',
    villa_id: 'VLA-003',
    villa_title: 'Cliffside Horizon Oceanfront Uluwatu',
    owner_name: 'David & Sarah Henderson (Singapura/Australia)',
    owner_phone: '+65 9123 4567',
    owner_email: 'david.henderson@cliffsideholdings.sg',
    certificate_type: 'HGB (Hak Guna Bangunan)',
    commission_rate: '4% Jual / 10% Sewa',
    notes: 'Dimiliki lewat PMA (PT Penanaman Modal Asing). Dapat ditransaksikan via pengalihan 100% saham PMA sehingga bebas BPHTB tinggi.',
    bank_account: 'DBS Bank Singapore 029-48201-9'
  },
  {
    id: 'OWN-104',
    villa_id: 'VLA-004',
    villa_title: 'The Timber Slats Modern Seminyak',
    owner_name: 'Hj. Ratna Kartika Dewi',
    owner_phone: '+62 812-9988-3412',
    owner_email: 'ratna.dewi@kartikagroup.id',
    certificate_type: 'SHM (Hak Milik)',
    commission_rate: '2.5% Jual / 7% Sewa',
    notes: 'SHM atas nama pribadi, IMB tahun 2022. Pembayaran sewa tahunan minimal 2 tahun di muka mendapatkan diskon 5%.',
    bank_account: 'BNI 0239102938 a/n Ratna Kartika Dewi'
  }
];

export const INITIAL_INQUIRIES: VillaInquiry[] = [
  {
    id: 'INQ-901',
    villa_id: 'VLA-001',
    villa_title: 'The Bamboo Sanctuary Eco-Luxury Valley Villa',
    client_name: 'Michael Van Houten',
    client_phone: '+31 6 82910293',
    client_email: 'michael.vh@amsterdamcapital.nl',
    message: 'Halo Agen Candra, saya tertarik untuk menyewa bulanan villa ini mulai pertengahan Desember 2026 selama 3 bulan. Apakah ada staf harian dan apakah internetnya stabil untuk WFH?',
    status: 'negotiation',
    preferred_date: '2026-12-15',
    created_at: '2026-10-24 10:15',
    inquiry_type: 'rent_monthly'
  },
  {
    id: 'INQ-902',
    villa_id: 'VLA-002',
    villa_title: 'Casa Blanca Mediterranean Canggu',
    client_name: 'Jessica Tan & Daniel Lim',
    client_phone: '+65 9876 5432',
    client_email: 'jessicatan@techasia.sg',
    message: 'Hi Pak Candra, kami mencari villa di Canggu untuk investasi dan ingin tahu proyeksi ROI sewa hariannya. Apakah bisa jadwalkan inspeksi video call hari Selasa?',
    status: 'viewing_scheduled',
    preferred_date: '2026-10-28',
    created_at: '2026-10-23 16:40',
    inquiry_type: 'buy'
  },
  {
    id: 'INQ-903',
    villa_id: 'VLA-003',
    villa_title: 'Cliffside Horizon Oceanfront Uluwatu',
    client_name: 'Bapak Hartono Widjaja',
    client_phone: '+62 811-8899-221',
    client_email: 'hartono.w@surabayabusiness.id',
    message: 'Selamat sore. Untuk villa tebing Uluwatu ini, apakah sertifikatnya bisa dinaikkan ke SHM atas nama WNI atau harus tetap HGB PMA? Tolong kirimkan draf perincian legalitasnya via WhatsApp.',
    status: 'contacted',
    preferred_date: '2026-11-02',
    created_at: '2026-10-22 09:20',
    inquiry_type: 'buy'
  },
  {
    id: 'INQ-904',
    villa_id: 'VLA-004',
    villa_title: 'The Timber Slats Modern Seminyak',
    client_name: 'Sophie Dubois',
    client_phone: '+33 6 1234 5678',
    client_email: 'sophie.dubois@parisdesign.fr',
    message: 'Bonjour! Is this villa available for yearly lease starting next month? Are pets allowed?',
    status: 'new',
    preferred_date: '2026-11-10',
    created_at: '2026-10-24 14:05',
    inquiry_type: 'rent_yearly'
  }
];
