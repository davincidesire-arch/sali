import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, List, Map as MapIcon, Loader2, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import ProviderCard from './components/ProviderCard';
import AddProviderModal from './components/AddProviderModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import MapView from './components/MapView';
import { Provider, Location, FilterState, ServiceType } from './types';
import { MOCK_PROVIDERS, generateDynamicProviders } from './lib/mockData';
import { calculateHaversineDistance } from './lib/utils';
import { parseNaturalLanguageQuery } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_LOCATION: Location = { lat: 31.5204, lng: 74.3587 }; // Lahore

export default function App() {
  // State
  const [allProviders, setAllProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [userLocation, setUserLocation] = useState<Location>(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting Location...');
  const [loading, setLoading] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    radiusKm: 10,
    searchQuery: '',
  });

  const dataGeneratedRef = useRef(false);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Lahore (Default)');
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLoc);
        setLocationStatus('Live Location');
        setLoading(false);

        // Generate dynamic providers once location is obtained
        if (!dataGeneratedRef.current) {
          const dynamic = generateDynamicProviders(newLoc, 25);
          setAllProviders(prev => [...prev, ...dynamic]);
          dataGeneratedRef.current = true;
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('Lahore (Default)');
        setLoading(false);
        
        // Fallback generation
        if (!dataGeneratedRef.current) {
          const dynamic = generateDynamicProviders(DEFAULT_LOCATION, 25);
          setAllProviders(prev => [...prev, ...dynamic]);
          dataGeneratedRef.current = true;
        }
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Filter Logic
  const filteredProviders = useMemo(() => {
    return allProviders
      .map(p => ({
        ...p,
        distanceKm: calculateHaversineDistance(
          userLocation.lat,
          userLocation.lng,
          p.location.lat,
          p.location.lng
        )
      }))
      .filter(p => {
        const matchesType = filters.type === 'all' || p.type === filters.type;
        const matchesRadius = (p.distanceKm || 0) <= filters.radiusKm;
        const matchesSearch = !filters.searchQuery || 
          p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(filters.searchQuery.toLowerCase());
        
        // Only show active providers to public users (unless admin is open, but we'll keep it simple)
        return matchesType && matchesRadius && matchesSearch && p.isActive;
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [allProviders, filters, userLocation]);

  // Handlers
  const handleAISearch = async (query: string) => {
    setAiThinking(true);
    try {
      const result = await parseNaturalLanguageQuery(query);
      setFilters(prev => ({
        ...prev,
        type: result.type,
        radiusKm: result.radiusKm || prev.radiusKm,
        searchQuery: result.nameKeyword || result.locationKeywords || prev.searchQuery
      }));
    } finally {
      setAiThinking(false);
    }
  };

  const handleAddProvider = (data: any) => {
    const newProvider: Provider = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type,
      address: data.address,
      city: data.city,
      phone: data.phone,
      imageUrl: data.imageUrl,
      location: { ...userLocation }, // Added at user's current location
      rating: 5.0,
      ratingsCount: 0,
      isActive: true,
    };
    setAllProviders(prev => [newProvider, ...prev]);
    alert('Provider registered successfully!');
  };

  const toggleProviderStatus = (id: string) => {
    setAllProviders(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const deleteProvider = (id: string) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      setAllProviders(prev => prev.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <h2 className="text-xl font-black uppercase tracking-tight">Locating Services...</h2>
        <p className="text-sm font-bold opacity-60 mt-2">Connecting you to the nearest providers</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-black pb-24">
      <Header 
        locationStatus={locationStatus} 
        onAdminClick={() => setIsLoginModalOpen(true)} 
      />

      <SearchSection 
        filters={filters}
        onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        onAISearch={handleAISearch}
        isThinking={aiThinking}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              Nearby Results
              <span className="bg-black text-amber-400 px-2 py-0.5 rounded-lg text-sm">
                {filteredProviders.length}
              </span>
            </h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Sorted by distance (nearest first)
            </p>
          </div>

          <div className="flex bg-white border-2 border-black rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                viewMode === 'list' ? 'bg-black text-amber-400' : 'hover:bg-amber-50'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                viewMode === 'map' ? 'bg-black text-amber-400' : 'hover:bg-amber-50'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {filteredProviders.length > 0 ? (
            viewMode === 'list' ? (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                {filteredProviders.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <MapView 
                  userLocation={userLocation} 
                  providers={filteredProviders} 
                  radiusKm={filters.radiusKm} 
                />
              </motion.div>
            )
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border-4 border-black border-dashed rounded-3xl p-12 text-center"
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-black uppercase mb-2">No Providers Found</h3>
              <p className="text-zinc-500 font-bold max-w-md mx-auto mb-6">
                Try increasing your search radius or searching for a different service type.
              </p>
              <button
                onClick={() => setFilters({ type: 'all', radiusKm: 50, searchQuery: '' })}
                className="bg-black text-amber-400 px-6 py-3 rounded-xl font-black hover:bg-zinc-800 transition-colors"
              >
                EXPAND SEARCH RADIUS
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAB */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-amber-400 text-black p-4 rounded-full shadow-2xl border-4 border-black hover:scale-110 transition-transform z-40 group"
        title="Add Provider"
      >
        <Plus className="w-8 h-8" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Register Service
        </span>
      </button>

      {/* Modals */}
      <AddProviderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddProvider}
      />
      
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setIsAdminOpen(true);
        }}
      />

      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        providers={allProviders}
        onToggleActive={toggleProviderStatus}
        onDelete={deleteProvider}
      />
    </div>
  );
}
