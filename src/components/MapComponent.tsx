import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Project } from '../data/projects/types';
import type { Map as LeafletMap, LeafletMouseEvent, MarkerClusterGroup, Marker, DivIcon } from 'leaflet';

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

interface Props {
  projects: Project[];
}

// Map configuration
const MAP_CONFIG = {
  bounds: {
    southwest: [-10, 65],  // Southwest corner
    northeast: [35, 140]   // Northeast corner
  },
  defaultCenter: [15.0, 102.5], // Default center (Thailand)
  defaultZoom: 5,
  minZoom: 4,
  maxZoom: 12,
  clusterRadius: 50
};

const MapComponent: React.FC<Props> = ({ projects }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const clusterGroupRef = useRef<MarkerClusterGroup | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate map center based on project coordinates
  const calculateMapCenter = useCallback((): [number, number] => {
    if (!projects.length) return MAP_CONFIG.defaultCenter;

    const validProjects = projects.filter(p => p.coordinates?.lat && p.coordinates?.lng);
    if (!validProjects.length) return MAP_CONFIG.defaultCenter;

    const lats = validProjects.map(p => p.coordinates.lat);
    const lngs = validProjects.map(p => p.coordinates.lng);
    
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2
    ];
  }, [projects]);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet.markercluster');
        await import('leaflet/dist/leaflet.css');
        await import('leaflet.markercluster/dist/MarkerCluster.css');
        await import('leaflet.markercluster/dist/MarkerCluster.Default.css');

        // Validate project coordinates
        const validProjects = projects.filter(project => {
          if (!project.coordinates?.lat || !project.coordinates?.lng) {
            console.warn(`Invalid coordinates for project: ${project.name}`);
            return false;
          }
          const { lat, lng } = project.coordinates;
          return !isNaN(lat) && !isNaN(lng) &&
                 lat >= MAP_CONFIG.bounds.southwest[0] && 
                 lat <= MAP_CONFIG.bounds.northeast[0] &&
                 lng >= MAP_CONFIG.bounds.southwest[1] && 
                 lng <= MAP_CONFIG.bounds.northeast[1];
        });

        if (validProjects.length === 0) {
          throw new Error('No valid project coordinates found');
        }

        // Define map boundaries
        const bounds = L.latLngBounds(
          L.latLng(...MAP_CONFIG.bounds.southwest),
          L.latLng(...MAP_CONFIG.bounds.northeast)
        );

        // Initialize map with custom controls
        const mapInstance = L.map(mapContainerRef.current!, {
          center: calculateMapCenter(),
          zoom: MAP_CONFIG.defaultZoom,
          zoomControl: false,
          maxBounds: bounds,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom,
          maxBoundsViscosity: 1.0,
          scrollWheelZoom: 'center', // Enable scroll zoom with center focus
          dragging: false // Disable dragging by default
        });

        // Override default scroll behavior to only work with Shift key
        mapInstance.scrollWheelZoom.disable();
        mapInstance.on('wheel', (e: LeafletMouseEvent) => {
          if (e.originalEvent?.shiftKey) {
            mapInstance.scrollWheelZoom.enable();
          } else {
            mapInstance.scrollWheelZoom.disable();
          }
        });

        // Add custom zoom control
        L.control.zoom({
          position: 'bottomright'
        }).addTo(mapInstance);

        // Add scale control
        L.control.scale({
          imperial: false,
          position: 'bottomleft'
        }).addTo(mapInstance);

        // Add tile layer with retina support
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          bounds: bounds,
          noWrap: true,
          detectRetina: true
        }).addTo(mapInstance);

        mapRef.current = mapInstance;

        // Enable dragging only when CTRL/Command is pressed
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Control' || e.key === 'Meta' || e.key === 'Command') {
            mapInstance.dragging.enable();
            setIsDragging(true);
          }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
          if (e.key === 'Control' || e.key === 'Meta' || e.key === 'Command') {
            mapInstance.dragging.disable();
            setIsDragging(false);
          }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Enable dragging only when CTRL is pressed
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

        // Create marker cluster group
        const clusterGroup = L.markerClusterGroup({
          maxClusterRadius: MAP_CONFIG.clusterRadius,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          removeOutsideVisibleBounds: true,
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            return L.divIcon({
              html: `<div class="cluster-marker">${count}</div>`,
              className: 'custom-cluster-marker',
              iconSize: L.point(40, 40)
            });
          }
        });

        clusterGroupRef.current = clusterGroup;
        mapInstance.addLayer(clusterGroup);

        // Create icons
        const createIcon = (color: string) => L.divIcon({
          html: `
            <div class="marker-icon" style="background-color: ${color}">
              <div class="marker-icon-inner"></div>
            </div>
          `,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });

        const icons = {
          completed: createIcon('#10b981'),
          active: createIcon('#3b82f6')
        };

        // Add markers with validation
        projects.forEach((project) => {
          if (!project.coordinates?.lat || !project.coordinates?.lng) {
            console.warn(`Invalid coordinates for project: ${project.name}`);
            return;
          }

          const marker = L.marker([project.coordinates.lat, project.coordinates.lng], {
            icon: icons[project.status.toLowerCase() === 'completed' ? 'completed' : 'active']
          });

          const popupContent = `
            <div class="p-4 min-w-[250px]">
              <h3 class="font-bold text-lg mb-2">${project.name}</h3>
              <div class="space-y-2 text-sm">
                <p><span class="font-medium">Location:</span> ${project.location}</p>
                <p><span class="font-medium">Capacity:</span> ${project.capacity}</p>
                <p><span class="font-medium">Type:</span> ${project.type}</p>
                <p><span class="font-medium">Status:</span> 
                  <span class="${project.status === 'Completed' ? 'text-emerald-600' : 'text-blue-600'} font-medium">
                    ${project.status}
                  </span>
                </p>
                <p><span class="font-medium">COD:</span> ${project.cod}</p>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            className: 'custom-popup',
            maxWidth: 300,
            minWidth: 250
          });

          markersRef.current.push(marker);
          clusterGroup.addLayer(marker);
        });

        // Add viewport culling
        const updateVisibleMarkers = debounce(() => {
          const bounds = mapInstance.getBounds();
          markersRef.current.forEach(marker => {
            const isVisible = bounds.contains(marker.getLatLng());
            if (isVisible) {
              clusterGroup.addLayer(marker);
            } else {
              clusterGroup.removeLayer(marker);
            }
          });
        }, 100);

        mapInstance.on('moveend', updateVisibleMarkers);
        mapInstance.on('zoomend', updateVisibleMarkers);

        // Cleanup function
        const cleanup = () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('keyup', handleKeyUp);
        };

        setIsLoading(false);
        return cleanup;
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
        markersRef.current = [];
        clusterGroupRef.current = null;
      }
    };
  }, [projects, calculateMapCenter]);

  if (typeof window === 'undefined') return null;

  return (
    <div className="relative w-full h-[600px] bg-gray-50">
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 rounded-xl shadow-lg z-10 bg-gray-50"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

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
      <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20">
        <p className="text-sm text-gray-600">
          Hold <kbd className="px-2 py-1 bg-gray-100 rounded">{/Mac/i.test(navigator.userAgent) ? '⌘ Command' : 'CTRL'}</kbd> + Mouse to pan<br/>
          Hold <kbd className="px-2 py-1 bg-gray-100 rounded">Shift</kbd> + Scroll to zoom
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20">
        <h3 className="text-sm font-semibold mb-2">Project Status</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#10b981]"></div>
            <span className="text-sm">Completed Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>
            <span className="text-sm">Active Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;