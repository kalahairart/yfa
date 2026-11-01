export type PropertyType = 'Villa' | 'Apartment' | 'House' | 'Penthouse' | 'Office' | 'Commercial';

export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Reserved';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  period?: 'total' | 'month' | 'year';
  address: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  parkingSpaces: number;
  featured: boolean;
  image: string;
  gallery: string[];
  agentId: string;
  agentName: string;
  agentPhone: string;
  agentAvatar: string;
  description: string;
  amenities: string[];
  yearBuilt: number;
  dateAdded: string;
  viewsCount: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  propertiesCount: number;
  dealsClosed: number;
  rating: number;
  totalSalesValue: number;
  status: 'Active' | 'On Leave' | 'Busy';
  location: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: 'Buyer' | 'Seller' | 'Tenant' | 'Investor';
  interestProperty: string;
  budget: number;
  status: 'Hot' | 'Warm' | 'Viewing' | 'Negotiation' | 'Closed';
  dateAdded: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  propertyTitle: string;
  propertyId: string;
  clientName: string;
  agentName: string;
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Escrow' | 'Cryptocurrency';
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface ChatThread {
  id: string;
  contactName: string;
  contactRole: string;
  contactAvatar: string;
  propertyTitle: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface ThemeSettings {
  mode: 'light' | 'dark';
  sidebarColor: 'dark' | 'light';
  sidebarCondensed: boolean;
  currency: 'USD' | 'IDR';
  language: 'id' | 'en';
}
