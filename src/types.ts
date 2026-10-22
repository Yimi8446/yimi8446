export type CategoryId = 'toys' | 'birthdays' | 'quince' | 'weddings' | 'babyshower' | 'educational';

export type AgeRange = '0-2' | '3-5' | '6-8' | '9-12' | '13+';

export interface Product {
  id: string;
  name: string;
  priceBob: number;
  originalPriceBob?: number;
  category: CategoryId;
  ageRange?: AgeRange;
  imageUrl: string;
  galleryUrls?: string[];
  description: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  isOffer?: boolean;
  stock: number;
  tags: string[];
  badge?: string;
  dimensions?: string;
  material?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  giftWrapper: boolean;
  wrapperStyle?: 'cumple' | '15anos' | 'elegante' | 'infantil_estrellas';
  cardMessage?: string;
  giftToName?: string;
}

export interface DeliveryDetails {
  customerName: string;
  customerPhone: string;
  city: 'La Paz' | 'Santa Cruz' | 'Cochabamba' | 'El Alto' | 'Sucre' | 'Tarija' | 'Oruro' | 'Potosí' | 'Trinidad' | 'Cobija';
  address: string;
  deliveryDate: string;
  giftMessage: string;
  recipientName: string;
  paymentProofName?: string;
  paymentProofUrl?: string;
  transactionRef?: string;
  orderNotes?: string;
}

export interface StoreSettings {
  whatsappNumber: string; // Default: e.g. "59176543210"
  storeName: string;
  qrAccountHolder: string;
  qrAccountNumber: string;
  qrBankName: string;
  qrCodeImageUrl?: string;
  freeShippingBobThreshold: number;
  currencySymbol: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  iconName: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
  image: string;
}

export interface FilterState {
  category: CategoryId | 'all';
  ageRange: AgeRange | 'all';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  onlyOffers: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
}

export interface AiRecommendationResponse {
  greeting?: string;
  recommendations?: Array<{
    title: string;
    why: string;
    estimatedBob: string;
    category: string;
  }>;
  tip?: string;
  error?: string;
}
