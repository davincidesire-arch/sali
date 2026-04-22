import { MapPin, Lock, Zap, Droplets } from 'lucide-react';

interface HeaderProps {
  locationStatus: string;
  onAdminClick: () => void;
}

export default function Header({ locationStatus, onAdminClick }: HeaderProps) {
  return (
    <header className="bg-amber-400 text-black px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-lg">
            <MapPin className="text-amber-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none">SALIII</h1>
            <p className="text-[10px] font-bold tracking-[0.2em] opacity-80">ONE CLICK AWAY</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-full text-xs font-bold">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            {locationStatus}
          </div>
          
          <button 
            onClick={onAdminClick}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
            title="Admin Dashboard"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
