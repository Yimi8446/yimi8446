import React, { useState, useEffect } from 'react';
import { CartItem, StoreSettings } from '../types';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  Send, 
  Clock, 
  Gift, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { CITIES_BOLIVIA } from '../data/categories';
import { sounds } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  selectedCity: string;
  storeSettings: StoreSettings;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  selectedCity,
  storeSettings,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Delivery Info, 2: Bolivia Simple QR Payment & Send to WhatsApp
  
  // Customer Info State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState(selectedCity || 'La Paz');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  
  // QR & Payment State
  const [copiedRef, setCopiedRef] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 min countdown for QR validity

  // Calculate Totals
  const subtotalBob = cart.reduce((acc, item) => acc + item.product.priceBob * item.quantity, 0);
  const cityInfo = CITIES_BOLIVIA.find((c) => c.name === city) || CITIES_BOLIVIA[0];
  const shippingCostBob = subtotalBob >= storeSettings.freeShippingBobThreshold ? 0 : cityInfo.deliveryCostBob;
  const totalBob = subtotalBob + shippingCostBob;

  // Generate Unique Order Reference Number
  const [orderNumber] = useState(() => `MR-${Math.floor(100000 + Math.random() * 900000)}`);

  // QR Timer Effect
  useEffect(() => {
    if (!isOpen || step !== 2) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`${storeSettings.qrBankName} - Cuenta: ${storeSettings.qrAccountNumber} - Titular: ${storeSettings.qrAccountHolder} - Mágico Regalo Bolivia`);
    setCopiedRef(true);
    sounds.playPop();
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFileName(e.target.files[0].name);
      sounds.playPop();
    }
  };

  // Build Structured WhatsApp Text & Open Link Directly
  const handleSendToWhatsApp = () => {
    sounds.playCelebration();

    const finalName = customerName.trim() || 'Cliente';
    const finalPhone = customerPhone.trim() || 'A coordinar por WhatsApp';
    const finalAddress = address.trim() || 'A coordinar por WhatsApp';

    // Formatted WhatsApp Message String
    const itemsList = cart.map(item => (
      `• *${item.quantity}x ${item.product.name}* - Bs. ${item.product.priceBob * item.quantity}${item.giftWrapper ? ' 🎁 (Con Empaque Gratis)' : ''}`
    )).join('\n');

    const whatsappMessage = `
🎉 *¡NUEVO PEDIDO DE REGALO! - ${storeSettings.storeName}* 🇧🇴
--------------------------------------------------
📋 *Número de Pedido:* #${orderNumber}
👤 *Cliente:* ${finalName}
📱 *Teléfono del Cliente:* ${finalPhone}
📍 *Ciudad / Destino:* ${city}
🏠 *Dirección Exacta:* ${finalAddress}
📅 *Fecha de Entrega Deseada:* ${deliveryDate || 'Lo antes posible / Inmediata'}
🎁 *Para:* ${recipientName || finalName}

🛍️ *PRODUCTOS SELECCIONADOS:*
${itemsList}

💌 *Dedicatoria para Tarjeta de Regalo:*
"${cardMessage || '¡Muchas felicidades y los mejores deseos!'}"

💰 *DESGLOSE DE PAGO:*
• Subtotal Productos: Bs. ${subtotalBob}
• Envío a ${city}: ${shippingCostBob === 0 ? '¡GRATIS!' : `Bs. ${shippingCostBob}`}
👉 *TOTAL A PAGAR:* *Bs. ${totalBob}.00*

📲 *SOLICITUD DE PAGO POR QR:*
Por favor envíenme el código QR Simple del banco para realizar el pago del monto exacto de *Bs. ${totalBob}.00*.
--------------------------------------------------
¡Hola! He generado este pedido desde la tienda online. Aguardo el código QR para realizar la transferencia. ¡Muchas gracias!
`.trim();

    const encodedText = encodeURIComponent(whatsappMessage);
    const targetPhone = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;

    // Clear cart and notify parent
    onOrderCompleted();
    
    // Open WhatsApp
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <Gift className="w-6 h-6 text-yellow-300 animate-bounce" />
            <div>
              <h2 className="text-base sm:text-lg font-black">
                {step === 1 ? 'Paso 1: Datos de Envío & Regalo' : 'Paso 2: Pago con QR Simple Bolivia'}
              </h2>
              <p className="text-[11px] text-amber-200 font-medium">Pedido #{orderNumber}</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playPop(); onClose(); }}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-amber-100/80 px-6 py-2 flex items-center justify-center space-x-6 text-xs font-black text-amber-950 border-b border-amber-200">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 ${step === 1 ? 'text-purple-900 underline decoration-2' : 'opacity-60'}`}
          >
            <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Envío y Dedicatoria</span>
          </button>
          <span className="text-gray-400">➔</span>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 ${step === 2 ? 'text-purple-900 underline decoration-2' : 'opacity-60'}`}
          >
            <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Pago QR & WhatsApp</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {step === 1 ? (
            /* STEP 1: Delivery & Recipient Information Form */
            <div className="space-y-4">
              
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Resumen de tu pedido: {cart.length} productos</span>
                <span className="text-purple-900 text-sm font-black">Total: Bs. {totalBob}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-600" /> Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Maria Elena Quispe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-purple-500 font-medium outline-none"
                  />
                </div>

                {/* Customer Phone WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-green-600" /> Tu Celular con WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 71234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-purple-500 font-medium outline-none"
                  />
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> Ciudad de Bolivia *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-purple-500 font-bold text-purple-900 outline-none"
                  >
                    {CITIES_BOLIVIA.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.deliveryCostBob} Bs. envío)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" /> Fecha Deseada de Entrega
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-purple-500 font-medium outline-none"
                  />
                </div>

              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Dirección Exacta de Entrega (Zona, Calle, Número, Referencia) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sopocachi, Calle 15 #230, frente a la plaza principal"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-purple-500 font-medium outline-none"
                />
              </div>

              {/* Recipient Name & Dedicated Card */}
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 space-y-2">
                <h4 className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-pink-500" />
                  <span>Personalización del Regalo (Tarjeta Gratis)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="¿A quién va dirigido el regalo? (Ej. Para Mateo)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-gray-300 font-medium bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Dedicatoria corta para la tarjeta (Ej. ¡Feliz Cumpleaños!)"
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-gray-300 font-medium bg-white"
                  />
                </div>
              </div>

              {/* Continue to Payment Button */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setStep(2);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 border-2 border-purple-400 transition-all active:scale-95 cursor-pointer"
              >
                <span className="uppercase tracking-wide">VER RESUMEN DE PAGO Y ENVIAR A WHATSAPP (Bs. {totalBob})</span>
                <span className="text-lg">➔</span>
              </button>

            </div>
          ) : (
            /* STEP 2: Bolivia Simple QR Payment via Direct WhatsApp Transfer */
            <div className="space-y-4">
              
              {/* Order Breakdown Box */}
              <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-4 rounded-3xl border-2 border-amber-300 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-purple-700/60 pb-2">
                  <span className="text-xs font-bold text-amber-200">Resumen Total de tu Pedido</span>
                  <span className="text-[11px] bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full">
                    Pedido #{orderNumber}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-purple-100">
                  <div className="flex justify-between">
                    <span>Productos ({cart.reduce((a, b) => a + b.quantity, 0)} items):</span>
                    <span className="font-bold">Bs. {subtotalBob}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío a {city}:</span>
                    <span className="font-bold text-amber-300">
                      {shippingCostBob === 0 ? '¡GRATIS!' : `Bs. ${shippingCostBob}.00`}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-700/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-purple-200 uppercase tracking-wider font-bold">Monto Total a Pagar</p>
                    <p className="text-2xl font-black text-yellow-300">Bs. {totalBob}.00</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                      PAGO POR QR SIMPLE
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation Card */}
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 space-y-2 text-amber-950 text-xs">
                <div className="flex items-center gap-2 font-black text-purple-900 text-sm">
                  <QrCode className="w-5 h-5 text-purple-700" />
                  <span>¿Cómo funciona el pago por QR?</span>
                </div>
                <p className="font-medium text-gray-700 leading-relaxed">
                  Para tu total comodidad en Bolivia, al hacer clic en el botón de abajo se enviará la orden de tu pedido directamente a nuestro <strong>WhatsApp oficial</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1 font-semibold text-gray-800">
                  <p className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">1.</span>
                    <span>Enviaremos tu pedido con el total exacto de <strong>Bs. {totalBob}.00</strong> a nuestro WhatsApp.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">2.</span>
                    <span>Nuestro vendedor te responderá de inmediato enviándote el <strong>código QR oficial del Banco</strong> para escanear.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">3.</span>
                    <span>Escaneas el QR desde tu banca móvil (Banco Unión, BCP, BNB, Mercantil, Bisa, etc.) y listo!</span>
                  </p>
                </div>
              </div>

              {/* Optional Bank Transfer Info */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-gray-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" /> Datos bancarios (Alternativo):
                  </span>
                  <span className="text-purple-900 font-black">{storeSettings.qrBankName}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-600">
                  <span>Titular: <strong>{storeSettings.qrAccountHolder}</strong></span>
                  <span>N° Cuenta: <strong className="font-mono text-gray-900">{storeSettings.qrAccountNumber}</strong></span>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold text-[11px] py-1 rounded-xl border border-gray-300 flex items-center justify-center gap-1"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? '¡Copiado!' : 'Copiar número de cuenta bancaria'}</span>
                </button>
              </div>

              {/* Direct WhatsApp Action Button */}
              <button
                onClick={handleSendToWhatsApp}
                className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base py-4 px-5 rounded-2xl shadow-xl flex items-center justify-center space-x-2 border-2 border-green-300 transform active:scale-95 transition-all"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 animate-pulse" />
                <span className="uppercase tracking-wide">ENVIAR PEDIDO Y RECIBIR QR EN WHATSAPP (Bs. {totalBob})</span>
              </button>

              <p className="text-[11px] text-center text-gray-500 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Se abrirá WhatsApp con el desglose total listo para solicitar el código QR de pago.
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
