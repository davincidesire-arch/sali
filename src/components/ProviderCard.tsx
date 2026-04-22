import { Star, MapPin, Phone, ExternalLink, User, MessageCircle } from 'lucide-react';
import { Provider } from '../types';
import { motion } from 'motion/react';

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const sanitizePhoneForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    // Assuming Pakistan (92) context based on "Lahore" in prompt
    if (cleaned.startsWith('0')) {
      cleaned = '92' + cleaned.substring(1);
    }
    return cleaned;
  };

  const whatsappPhone = sanitizePhoneForWhatsApp(provider.phone);
  const whatsappMessage = encodeURIComponent(`Hi ${provider.name}, I found your profile on SALIII. I'm interested in your ${provider.type} services. Can you help?`);
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  const dialerPhone = provider.phone.replace(/[^\d+]/g, '');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="p-4 sm:p-5">
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden flex-shrink-0 bg-amber-100 flex items-center justify-center">
            {provider.imageUrl ? (
              <img src={provider.imageUrl} alt={provider.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                provider.type === 'plumber' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {provider.type}
              </span>
              <div className="bg-amber-400 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-black" />
                <span className="text-[10px] font-black">{provider.rating}</span>
              </div>
            </div>
            <h3 className="text-lg font-black leading-tight group-hover:text-amber-600 transition-colors">
              {provider.name}
            </h3>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-zinc-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium leading-tight">
              {provider.address}, {provider.city}
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 px-1.5 py-0.5 rounded">
              {provider.distanceKm?.toFixed(1)} km away
            </span>
            <span className="text-[10px] font-bold opacity-50">
              ({provider.ratingsCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={`tel:${dialerPhone}`}
            className="flex-1 bg-black text-amber-400 py-2.5 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 hover:bg-zinc-800 transition-colors"
          >
            <Phone className="w-3 h-3" />
            Call
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] text-white py-2.5 rounded-lg font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </a>
          <button className="p-2.5 border-2 border-black rounded-lg hover:bg-amber-50 transition-colors flex-shrink-0">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
