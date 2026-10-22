import React from 'react';
import { CartItem, StoreSettings } from '../types';
import { X, Trash2, ShoppingBag, Gift, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { CITIES_BOLIVIA } from '../data/categories';
import { sounds } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onToggleGiftWrap: (productId: string) => void;
  onProceedToCheckout: () => void;
  selectedCity: string;
  setSelectedCity: (city: any) => void;
  storeSettings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onToggleGiftWrap,
  onProceedToCheckout,
  selectedCity,
  setSelectedCity,
  storeSettings,
}) => {
  if (!isOpen) return null;

  const subtotalBob = cart.reduce((acc, item) => acc + item.product.priceBob * item.quantity, 0);
  const cityInfo = CITIES_BOLIVIA.find((c) => c.name === selectedCity) || CITIES_BOLIVIA[0];
  const shippingCostBob = subtotalBob >= storeSettings.freeShippingBobThreshold ? 0 : cityInfo.deliveryCostBob;
  const totalBob = subtotalBob + shippingCostBob;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-purple-950/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l-4 border-amber-300">
          
          {/* Cart Header */}
          <div className="p-4 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-yellow-300" />
              <h2 className="text-lg font-black tracking-tight">Tu Carrito de Regalos</h2>
              <span className="bg-yellow-300 text-purple-900 font-extrabold text-xs px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'ítem' : 'ítems'}
              </span>
            </div>
            <button
              onClick={() => { sounds.playPop(); onClose(); }}
              className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50/40">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                  <Gift className="w-10 h-10 text-amber-500 animate-bounce" />
                </div>
                <h3 className="text-lg font-black text-gray-800">Tu carrito está vacío</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto font-medium">
                  Agrega juguetes o regalos para iniciar tu compra con empaque especial y pago QR Simple Bolivia.
                </p>
                <button
                  onClick={() => { sounds.playPop(); onClose(); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md"
                >
                  Ver Catálogo de Juguetes
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-sm space-y-2"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-amber-100"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-purple-900 font-black">
                        Bs. {item.product.priceBob} c/u
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-gray-800 px-1">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-gray-900 font-sans">
                        Bs. {item.product.priceBob * item.quantity}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="block ml-auto mt-2 text-rose-500 hover:text-rose-700 p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Gift Wrapping Badge */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onToggleGiftWrap(item.product.id)}
                      className={`flex items-center space-x-1.5 font-bold text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                        item.giftWrapper
                          ? 'bg-pink-100 text-pink-700 border border-pink-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5 text-pink-500" />
                      <span>{item.giftWrapper ? '🎁 Empaque Especial (Incluido)' : '+ Añadir Empaque Gratis'}</span>
                    </button>

                    {item.cardMessage && (
                      <span className="text-[10px] text-purple-700 font-semibold truncate max-w-[120px]">
                        💌 Con tarjeta
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t-2 border-amber-200 space-y-3 shadow-xl">
              
              {/* Delivery City Selector */}
              <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950">Ciudad de entrega en Bolivia:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-white border border-amber-300 rounded-xl px-2 py-1 font-bold text-xs text-purple-900 focus:outline-none"
                >
                  {CITIES_BOLIVIA.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name} ({city.deliveryCostBob} Bs.)
                    </option>
                  ))}
                </select>
              </div>

              {/* Free shipping progress bar */}
              <div className="text-[11px] font-bold text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Envío Gratis al superar Bs. {storeSettings.freeShippingBobThreshold}</span>
                  {subtotalBob >= storeSettings.freeShippingBobThreshold ? (
                    <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ¡Envío Gratis Conseguido!
                    </span>
                  ) : (
                    <span className="text-pink-600">Faltan Bs. {storeSettings.freeShippingBobThreshold - subtotalBob}</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotalBob / storeSettings.freeShippingBobThreshold) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs text-gray-700 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="font-bold">Bs. {subtotalBob}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío a {selectedCity}:</span>
                  <span className="font-bold">
                    {shippingCostBob === 0 ? '¡GRATIS!' : `Bs. ${shippingCostBob}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-purple-950 pt-2 border-t border-gray-200">
                  <span>TOTAL COMPRA:</span>
                  <span className="text-xl text-purple-900">Bs. {totalBob}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => { sounds.playPop(); onProceedToCheckout(); }}
                className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2 border-2 border-green-400 transform active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>Pagar con QR Simple y Enviar a WhatsApp</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
