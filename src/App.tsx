import React, { useState, useMemo } from 'react';
import { Product, CartItem, StoreSettings, CategoryId, AgeRange } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryPills } from './components/CategoryPills';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { GiftWizardModal } from './components/GiftWizardModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { 
  Gift, 
  Sparkles, 
  Heart, 
  Phone, 
  QrCode, 
  Truck, 
  ShieldCheck, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { sounds } from './utils/audio';

export default function App() {
  // Store Products State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Filtering State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedAge, setSelectedAge] = useState<AgeRange | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'popular' | 'rating'>('featured');

  // Delivery & Store Settings
  const [selectedCity, setSelectedCity] = useState<string>('La Paz');
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    whatsappNumber: '59175368104', // WhatsApp Bolivia Mundo Regalón
    storeName: 'Mundo Regalón',
    qrAccountHolder: 'Mundo Regalón',
    qrAccountNumber: '100000492819',
    qrBankName: 'Banco Unión S.A.',
    freeShippingBobThreshold: 250,
    currencySymbol: 'Bs.'
  });

  // Wishlist Toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Add to Cart Logic
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    giftWrapper = true,
    wrapperStyle?: any,
    cardMessage?: string,
    giftToName?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                giftWrapper,
                wrapperStyle: wrapperStyle || item.wrapperStyle,
                cardMessage: cardMessage || item.cardMessage,
                giftToName: giftToName || item.giftToName,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          giftWrapper,
          wrapperStyle: wrapperStyle || 'cumple',
          cardMessage,
          giftToName,
        },
      ];
    });
  };

  // Cart quantity controls
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleCartGiftWrap = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, giftWrapper: !item.giftWrapper }
          : item
      )
    );
  };

  // Filtered Products Computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        // Age Filter
        if (selectedAge !== 'all' && p.ageRange !== selectedAge) return false;
        // Offers Filter
        if (onlyOffers && !p.isOffer && !p.originalPriceBob) return false;
        // Wishlist Filter
        if (showWishlistOnly && !wishlist.includes(p.id)) return false;
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTag) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceBob - b.priceBob;
        if (sortBy === 'price-desc') return b.priceBob - a.priceBob;
        if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, selectedCategory, selectedAge, onlyOffers, showWishlistOnly, wishlist, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-amber-50/30 text-gray-800 font-sans pb-20 lg:pb-8 flex flex-col justify-between">
      
      {/* Header Bar */}
      <div>
        <Header
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          wishlistCount={wishlist.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => { setShowWishlistOnly(!showWishlistOnly); setSelectedCategory('all'); }}
          onOpenWizard={() => setIsWizardOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          storeSettings={storeSettings}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat as any)}
        />

        {/* Hero Section Banner */}
        <HeroBanner
          onOpenWizard={() => setIsWizardOpen(true)}
          onSelectCategory={(cat) => setSelectedCategory(cat as any)}
        />

        {/* Filter Pills */}
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => { setSelectedCategory(c); setShowWishlistOnly(false); }}
          selectedAge={selectedAge}
          onSelectAge={setSelectedAge}
          onlyOffers={onlyOffers}
          onToggleOffers={() => setOnlyOffers(!onlyOffers)}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Wishlist Active Notification Bar */}
        {showWishlistOnly && (
          <div className="bg-pink-100 border-b border-pink-200 py-2.5 px-4 text-center text-xs font-bold text-pink-900 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>Viendo tus {wishlist.length} productos guardados en favoritos</span>
            <button
              onClick={() => setShowWishlistOnly(false)}
              className="bg-white text-pink-700 px-2.5 py-0.5 rounded-full border border-pink-300 font-black hover:bg-pink-50"
            >
              Ver Todo el Catálogo
            </button>
          </div>
        )}

        {/* Main Product Grid Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-950 flex items-center gap-2">
                <span>🎁 Catálogo de Regalos & Juguetes</span>
                <span className="text-xs bg-amber-300 text-amber-950 px-2.5 py-1 rounded-full font-black">
                  {filteredProducts.length} disponibles
                </span>
              </h2>
              <p className="text-xs font-semibold text-gray-500">
                Selecciona tu regalo preferido, incluye empaque gratis y paga cómodamente por QR
              </p>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-amber-300 p-8 space-y-3">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                🧸
              </div>
              <h3 className="text-lg font-black text-gray-800">No se encontraron productos</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">
                Intenta cambiando los filtros de edad o busca otro término como "robot", "arte" o "15 años".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedAge('all');
                  setSearchQuery('');
                  setOnlyOffers(false);
                  setShowWishlistOnly(false);
                }}
                className="bg-amber-400 text-amber-950 font-black text-xs px-5 py-2.5 rounded-full shadow"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p, 1, true)}
                  onQuickView={(p) => setSelectedProductDetail(p)}
                />
              ))}
            </div>
          )}

          {/* Trust Value Props Section */}
          <section className="mt-16 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 text-center sm:text-left">
              
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="p-3 bg-amber-400 text-amber-950 rounded-2xl font-black">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-yellow-300">Pasarela Pago QR Bolivia</h4>
                  <p className="text-xs text-gray-200">Compatibilidad con todos los bancos (Banco Unión, BNB, Mercantil, BCP).</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="p-3 bg-pink-500 text-white rounded-2xl font-black">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-pink-300">Empaque & Dedicatoria</h4>
                  <p className="text-xs text-gray-200">Empaque temático con cinta y tarjeta escrita a mano sin costo extra.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="p-3 bg-emerald-500 text-white rounded-2xl font-black">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-emerald-300">WhatsApp Inmediato</h4>
                  <p className="text-xs text-gray-200">Envío automático del resumen de compra al número oficial del vendedor.</p>
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-amber-300 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-6 h-6 text-pink-600" />
              <span className="font-black text-base text-purple-950">{storeSettings.storeName}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Tienda online especializada en juguetes infantiles, regalos para cumpleaños, 15 años y eventos familiares en Bolivia.
            </p>
          </div>

          <div>
            <h5 className="font-black text-purple-900 mb-2">Ciudades con Despacho</h5>
            <p className="text-xs leading-relaxed text-gray-500">
              La Paz • El Alto • Santa Cruz • Cochabamba • Sucre • Tarija • Oruro • Potosí • Trinidad • Cobija
            </p>
          </div>

          <div>
            <h5 className="font-black text-purple-900 mb-2">Métodos de Pago</h5>
            <div className="flex items-center gap-1.5 font-bold text-purple-800">
              <QrCode className="w-4 h-4 text-purple-600" />
              <span>Pago Simple QR Bolivia (Transferencia Directa)</span>
            </div>
          </div>

          <div>
            <h5 className="font-black text-purple-900 mb-2">Contacto WhatsApp</h5>
            <p className="font-bold text-green-700 text-sm flex items-center gap-1">
              <Phone className="w-4 h-4" /> +{storeSettings.whatsappNumber}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              © {new Date().getFullYear()} {storeSettings.storeName}. Todos los derechos reservados.
            </p>
          </div>

        </div>
      </footer>

      {/* Product Inspection Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        isOpen={!!selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={(p, qty, wrap, style, msg, to) => {
          handleAddToCart(p, qty, wrap, style, msg, to);
          setIsCartOpen(true);
        }}
        isWishlisted={selectedProductDetail ? wishlist.includes(selectedProductDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onToggleGiftWrap={handleToggleCartGiftWrap}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        storeSettings={storeSettings}
      />

      {/* Checkout & Bolivia QR Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        selectedCity={selectedCity}
        storeSettings={storeSettings}
        onOrderCompleted={() => setCart([])}
      />

      {/* Gift Wizard Modal */}
      <GiftWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProductDetail(p)}
      />

      {/* Store Settings Manager Modal */}
      <StoreSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={storeSettings}
        onSaveSettings={(newSettings) => setStoreSettings(newSettings)}
      />

      {/* Mobile Sticky Navigation Bar */}
      <MobileBottomBar
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => { setShowWishlistOnly(!showWishlistOnly); setSelectedCategory('all'); }}
        onOpenWizard={() => setIsWizardOpen(true)}
        onGoHome={() => { setSelectedCategory('all'); setSelectedAge('all'); setSearchQuery(''); setShowWishlistOnly(false); }}
        whatsappNumber={storeSettings.whatsappNumber}
      />

    </div>
  );
}
