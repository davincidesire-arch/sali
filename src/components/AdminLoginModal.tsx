import { X, ShieldAlert, Key } from 'lucide-react';
import { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded password for demo purposes
    if (password === 'admin123') {
      onSuccess();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 text-white w-full max-w-sm border-4 border-amber-400 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        <div className="bg-amber-400 p-4 border-b-4 border-black flex justify-between items-center text-black">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-lg font-black uppercase tracking-tight">Admin Access</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs font-bold text-zinc-400 text-center uppercase tracking-wider">
            Enter password to access control panel
          </p>
          
          <div className="relative">
            <input
              autoFocus
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full bg-zinc-800 border-2 ${error ? 'border-red-500' : 'border-zinc-700'} rounded-lg px-4 py-3 pl-11 font-bold text-white focus:outline-none focus:border-amber-400 transition-colors`}
              placeholder="••••••••"
            />
            <Key className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${error ? 'text-red-500' : 'text-zinc-500'}`} />
          </div>

          {error && (
            <p className="text-[10px] font-black text-red-500 uppercase text-center animate-bounce">
              Invalid Password. Try Again.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-400 text-black py-3 rounded-xl font-black text-sm hover:bg-amber-300 transition-all active:scale-95"
          >
            UNLOCK DASHBOARD
          </button>
          
          <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">
            Hint: admin123
          </p>
        </form>
      </div>
    </div>
  );
}
