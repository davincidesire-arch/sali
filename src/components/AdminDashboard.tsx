import { X, Trash2, Power, PowerOff, ShieldCheck } from 'lucide-react';
import { Provider } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  providers: Provider[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AdminDashboard({ isOpen, onClose, providers, onToggleActive, onDelete }: AdminDashboardProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 text-white w-full max-w-4xl max-h-[80vh] border-4 border-amber-400 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-amber-400 p-4 border-b-4 border-black flex justify-between items-center text-black">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-black uppercase tracking-tight">Admin Control Panel</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <th className="pb-3 px-2">Provider</th>
                  <th className="pb-3 px-2">Type</th>
                  <th className="pb-3 px-2">Location</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {providers.map((p) => (
                  <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-zinc-500">{p.phone}</div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800">
                        {p.type}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-xs">{p.city}</div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        p.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onToggleActive(p.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            p.isActive ? 'hover:bg-red-500/20 text-zinc-400' : 'hover:bg-green-500/20 text-green-400'
                          }`}
                          title={p.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {p.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="p-2 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-zinc-800 border-t border-zinc-700 flex justify-between items-center">
          <p className="text-xs text-zinc-400 font-medium">
            Total Providers: <span className="text-white font-bold">{providers.length}</span>
          </p>
          <button
            onClick={onClose}
            className="bg-amber-400 text-black px-6 py-2 rounded-lg font-black text-sm hover:bg-amber-300 transition-colors"
          >
            CLOSE DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
