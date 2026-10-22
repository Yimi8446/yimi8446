import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { X, Save, Settings, Phone, QrCode, Building2, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPop();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-yellow-300" />
            <h3 className="font-black text-sm sm:text-base">Configuración de Tienda & WhatsApp</h3>
          </div>
          <button
            onClick={() => { sounds.playPop(); onClose(); }}
            className="p-1 text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs">
          
          <div>
            <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-green-600" /> Número de WhatsApp para recibir pedidos (con código de país sin +):
            </label>
            <input
              type="text"
              required
              placeholder="Ej. 59176543210"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 font-bold text-green-700 bg-emerald-50 focus:outline-none focus:border-green-600"
            />
            <p className="text-[10px] text-gray-500 mt-0.5">
              Formato Bolivia: 591 seguidos de tus 8 dígitos. Ejemplo: 59171234567
            </p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-purple-600" /> Banco para Transferencias QR:
            </label>
            <input
              type="text"
              required
              value={formData.qrBankName}
              onChange={(e) => setFormData({ ...formData, qrBankName: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 font-medium bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Titular de Cuenta:</label>
              <input
                type="text"
                required
                value={formData.qrAccountHolder}
                onChange={(e) => setFormData({ ...formData, qrAccountHolder: e.target.value })}
                className="w-full p-2 rounded-xl border border-gray-300 font-medium bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">N° Cuenta Banco:</label>
              <input
                type="text"
                required
                value={formData.qrAccountNumber}
                onChange={(e) => setFormData({ ...formData, qrAccountNumber: e.target.value })}
                className="w-full p-2 rounded-xl border border-gray-300 font-mono text-xs font-medium bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Monto Mínimo para Envío Gratis (Bs.):</label>
            <input
              type="number"
              required
              value={formData.freeShippingBobThreshold}
              onChange={(e) => setFormData({ ...formData, freeShippingBobThreshold: Number(e.target.value) })}
              className="w-full p-2 rounded-xl border border-gray-300 font-bold bg-white"
            />
          </div>

          {savedSuccess && (
            <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl font-bold text-center flex items-center justify-center gap-1.5 animate-bounce">
              <Check className="w-4 h-4" />
              <span>¡Configuración guardada correctamente!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-2 rounded-xl shadow flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
