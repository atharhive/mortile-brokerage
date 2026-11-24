export type DomainStatus = 'available' | 'under_offer' | 'sold' | 'private';

export type InquiryType =
  | 'domain_offer'
  | 'buyer_mandate'
  | 'seller_listing'
  | 'general_advisory';

export type InquiryStatus =
  | 'new'
  | 'reviewing'
  | 'negotiating'
  | 'closed'
  | 'archived';

export interface DomainAsset {
  id: number;
  name: string;
  sld: string;
  tld: string;
  category: string;
  priceUsd: number;
  minOfferUsd: number;
  pricingModel: string;
  status: DomainStatus;
  featured: boolean;
  length: number;
  ageYears: number;
  registeredYear: number;
  summary: string;
  useCases: string;
  comparableSale: string | null;
  monthlyInquiries: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrokerageInquiry {
  id: number;
  type: InquiryType;
  domainId: number | null;
  domainName: string | null;
  clientName: string;
  clientEmail: string;
  company: string | null;
  budgetOrOfferUsd: number | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export type AppRoute =
  | 'home'
  | 'portfolio'
  | 'services'
  | 'buy'
  | 'sell'
  | 'about'
  | 'contact'
  | 'admin';

export const DOMAIN_CATEGORIES = [
  'All Categories',
  'Artificial Intelligence',
  'Fintech & Capital',
  'Enterprise SaaS',
  'Bio & Health',
  'Climate & Energy',
  'Luxury & Consumer',
  'Digital Assets',
] as const;

export const DOMAIN_TLDS = [
  'All Extensions',
  '.com',
  '.ai',
  '.io',
  '.si',
  '.co',
  '.ch',
] as const;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortUsd(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)}K`;
  }
  return `$${amount}`;
}
