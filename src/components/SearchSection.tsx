import { Search, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { ServiceType, FilterState } from '../types';

interface SearchSectionProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onAISearch: (query: string) => void;
  isThinking: boolean;
}

export default function SearchSection({ filters, onFilterChange, onAISearch, isThinking }: SearchSectionProps) {
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('query') as HTMLInputElement;
    if (input.value.trim()) {
      onAISearch(input.value);
    }
  };

  return (
    <section className="bg-amber-100 p-4 sm:p-6 border-b border-amber-200">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* AI Search Input */}
        <form onSubmit={handleQuerySubmit} className="relative group">
          <input
            name="query"
            type="text"
            placeholder="Try 'Find a plumber near me' or 'Electrician in Gulberg'..."
            className="w-full bg-white border-2 border-black rounded-xl py-4 pl-12 pr-24 font-medium focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all"
          />
          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 w-6 h-6" />
          <button
            type="submit"
            disabled={isThinking}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-amber-400 px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {isThinking ? 'Thinking...' : 'Search'}
          </button>
        </form>

        {/* Manual Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Service Type</label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange({ type: e.target.value as ServiceType })}
              className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 font-bold text-sm focus:outline-none"
            >
              <option value="all">All Services</option>
              <option value="plumber">Plumbers</option>
              <option value="electrician">Electricians</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between items-end mb-1">
              <label className="text-[10px] font-black uppercase tracking-wider">Radius</label>
              <span className="text-xs font-bold">{filters.radiusKm}km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.radiusKm}
              onChange={(e) => onFilterChange({ radiusKm: parseInt(e.target.value) })}
              className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Text Search</label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                placeholder="Name, address, city..."
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-2 pl-9 font-bold text-sm focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(filters.type !== 'all' || filters.radiusKm !== 10 || filters.searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-[10px] font-black uppercase opacity-50">Active:</span>
            {filters.type !== 'all' && (
              <Badge label={filters.type} onClear={() => onFilterChange({ type: 'all' })} />
            )}
            {filters.radiusKm !== 10 && (
              <Badge label={`${filters.radiusKm}km`} onClear={() => onFilterChange({ radiusKm: 10 })} />
            )}
            {filters.searchQuery && (
              <Badge label={filters.searchQuery} onClear={() => onFilterChange({ searchQuery: '' })} />
            )}
            <button 
              onClick={() => onFilterChange({ type: 'all', radiusKm: 10, searchQuery: '' })}
              className="text-[10px] font-bold underline hover:text-amber-600"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Badge({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <div className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
      {label}
      <button onClick={onClear} className="hover:text-amber-400">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
