import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { ServiceType } from '../types';
import { useState, useRef } from 'react';

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function AddProviderModal({ isOpen, onClose, onSubmit }: AddProviderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'plumber' as ServiceType,
    address: '',
    city: '',
    phone: '',
    imageUrl: '',
    acceptTerms: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-amber-50 w-full max-w-md border-4 border-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
        <div className="bg-amber-400 p-4 border-b-4 border-black flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">Add Service Provider</h2>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-white border-2 border-dashed border-black rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-amber-100 transition-colors group relative"
            >
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-black transition-colors" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Upload Profile Photo</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Provider Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-amber-400/20"
              placeholder="e.g. Quick Fix Plumbing"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Service Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ServiceType })}
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold focus:outline-none"
            >
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">City</label>
              <input
                required
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold focus:outline-none"
                placeholder="Lahore"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Phone</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold focus:outline-none"
                placeholder="0300-1234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold focus:outline-none h-20 resize-none"
              placeholder="Full street address..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="w-5 h-5 border-2 border-black rounded accent-black"
            />
            <span className="text-xs font-bold text-zinc-600 group-hover:text-black transition-colors">
              I agree to the terms and conditions for service providers.
            </span>
          </label>

          <button
            type="submit"
            disabled={!formData.acceptTerms}
            className="w-full bg-black text-amber-400 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <Plus className="w-6 h-6" />
            REGISTER PROVIDER
          </button>
        </form>
      </div>
    </div>
  );
}
