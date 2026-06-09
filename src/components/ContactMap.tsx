import React, { useRef, useEffect, useState } from "react";

interface Office {
  country: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: string;
  coordinates: [number, number];
  showInList?: boolean;
}

interface Props {
  offices: Office[];
}

// Map configuration
const MAP_CONFIG = {
  bounds: {
    southwest: [-10, 65],  // Southwest corner
    northeast: [35, 140]   // Northeast corner
  },
  center: [15.0, 102.5],   // Centered on Thailand
  zoom: 4,
  minZoom: 3,
  maxZoom: 10
};

const ContactMap: React.FC<Props> = ({ offices }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapInitialized) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        // Validate office coordinates
        const validOffices = offices.filter(office => {
          const [lng, lat] = office.coordinates;
          return !isNaN(lat) && !isNaN(lng) && 
                 lat >= MAP_CONFIG.bounds.southwest[0] && 
                 lat <= MAP_CONFIG.bounds.northeast[0] &&
                 lng >= MAP_CONFIG.bounds.southwest[1] && 
                 lng <= MAP_CONFIG.bounds.northeast[1];
        });

        if (validOffices.length === 0) {
          throw new Error('No valid office coordinates found');
        }

        // Define map boundaries
        const bounds = L.latLngBounds(
          L.latLng(...MAP_CONFIG.bounds.southwest),
          L.latLng(...MAP_CONFIG.bounds.northeast)
        );

        // Initialize map
        const mapInstance = L.map(mapContainerRef.current!, {
          center: MAP_CONFIG.center,
          zoom: MAP_CONFIG.zoom,
          zoomControl: false,
          maxBounds: bounds,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom,
          maxBoundsViscosity: 1.0,
          dragging: false // Disable dragging by default
        });

        // Add tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          bounds: bounds,
          noWrap: true
        }).addTo(mapInstance);

        mapRef.current = mapInstance;

        // Enable dragging only when CTRL/Command is pressed
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Control' || e.key === 'Meta' || e.key === 'Command') {
            mapInstance.dragging.enable();
            setIsDragging(true);
          }
        });

        document.addEventListener('keyup', (e) => {
          if (e.key === 'Control' || e.key === 'Meta' || e.key === 'Command') {
            mapInstance.dragging.disable();
            setIsDragging(false);
          }
        });

        // Override default scroll behavior to only work with Shift key
        mapInstance.scrollWheelZoom.disable();
        mapInstance.on('wheel', (e) => {
          if (e.originalEvent.shiftKey) {
            mapInstance.scrollWheelZoom.enable();
          } else {
            mapInstance.scrollWheelZoom.disable();
          }
        });

        // Create office icon
        const officeIcon = L.divIcon({
          html: `
            <div class="marker-icon" style="background-color: #1a5f7a">
              <div class="marker-icon-inner"></div>
            </div>
          `,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });

        // Add markers for each office
        validOffices.forEach((office) => {
          const marker = L.marker(office.coordinates, {
            icon: officeIcon
          });

          const popupContent = `
            <div class="p-4 min-w-[250px]">
              <h3 class="font-bold text-lg mb-2">${office.name}</h3>
              <p class="text-primary text-sm mb-2">${office.country}</p>
              <div class="space-y-2 text-sm">
                <p class="text-gray-600">${office.address}</p>
                ${office.phone ? `<p class="text-gray-600"><span class="font-medium">Tel:</span> ${office.phone}</p>` : ''}
                ${office.hours ? `<p class="text-gray-600"><span class="font-medium">Hours:</span> ${office.hours}</p>` : ''}
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 300,
            minWidth: 250
          }).addTo(mapInstance);
        });

        setIsLoading(false);
        setMapInitialized(true);
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to initialize map. Please try again.');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [offices]); // Add offices to dependency array

  if (typeof window === 'undefined') return null;

  return (
    <div className="relative w-full h-[600px]">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 rounded-lg shadow-lg z-10 bg-gray-50" 
      />
      {isLoading && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20">
        <p className="text-sm text-gray-600">
          Hold <kbd className="px-2 py-1 bg-gray-100 rounded">{navigator.platform.includes('Mac') ? '⌘ Command' : 'CTRL'}</kbd> + Mouse to pan<br/>
          Hold <kbd className="px-2 py-1 bg-gray-100 rounded">Shift</kbd> + Scroll to zoom
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20">
        <h3 className="text-sm font-semibold mb-2">Office Locations</h3>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4" style={{ backgroundColor: '#1a5f7a' }}></div>
          <span className="text-sm">PSS Powers Office</span>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;