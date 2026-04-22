import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Provider, Location } from '../types';
import L from 'leaflet';
import { useEffect } from 'react';

// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Cast components to any to bypass type issues
const MapContainerAny = MapContainer as any;
const TileLayerAny = TileLayer as any;
const MarkerAny = Marker as any;
const CircleAny = Circle as any;
const PopupAny = Popup as any;

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const providerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  userLocation: Location;
  providers: Provider[];
  radiusKm: number;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapView({ userLocation, providers, radiusKm }: MapViewProps) {
  const center: [number, number] = [userLocation.lat, userLocation.lng];

  return (
    <div className="h-[600px] w-full rounded-2xl border-4 border-black overflow-hidden shadow-lg z-0">
      <MapContainerAny center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayerAny
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        
        {/* User Marker */}
        <MarkerAny position={center} icon={userIcon}>
          <PopupAny>
            <div className="font-bold">You are here</div>
          </PopupAny>
        </MarkerAny>

        {/* Radius Circle */}
        <CircleAny
          center={center}
          radius={radiusKm * 1000}
          pathOptions={{ color: '#FCD34D', fillColor: '#FCD34D', fillOpacity: 0.1 }}
        />

        {/* Provider Markers */}
        {providers.map((p) => (
          <MarkerAny 
            key={p.id} 
            position={[p.location.lat, p.location.lng]}
            icon={providerIcon}
          >
            <PopupAny>
              <div className="p-1">
                <h4 className="font-black text-sm">{p.name}</h4>
                <p className="text-xs font-bold text-zinc-500 uppercase">{p.type}</p>
                <p className="text-[10px] mt-1">{p.address}</p>
                <div className="mt-2 text-[10px] font-black bg-amber-400 px-1.5 py-0.5 rounded inline-block">
                  {p.distanceKm?.toFixed(1)} km away
                </div>
              </div>
            </PopupAny>
          </MarkerAny>
        ))}
      </MapContainerAny>
    </div>
  );
}
