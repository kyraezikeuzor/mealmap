// components/ui/map.tsx
'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RMap, RMapContextProvider, useMap } from "maplibre-react-components";

import { ResourceType } from '@/types';
import { getGeocode, formatDeclarationTitle } from '@/lib/utils';

const mapStyleLight = 'https://api.maptiler.com/maps/streets/style.json'
const mapStyleDark = 'https://api.maptiler.com/maps/streets-v2-dark/style.json'



interface MapComponentProps {
  resources: ResourceType[];
  selectedResource: ResourceType | null;
  setSelectedResource: React.Dispatch<React.SetStateAction<ResourceType | null>>;
  onFlyToReady?: (flyTo: (resource: ResourceType) => void) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  resources, 
  selectedResource,
  setSelectedResource,
  onFlyToReady 
}) => {
  const [isClient, setIsClient] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  
  // More robust dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dark mode detection
  useEffect(() => {
    // Check for dark mode in multiple ways
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      const isDark = 
        htmlElement.classList.contains('dark') || 
        window.matchMedia('(prefers-color-scheme: dark)').matches ||
        htmlElement.getAttribute('data-theme') === 'dark';
      
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    // Observe class changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', checkDarkMode);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;
  
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (!mapContainer.current) return;
  
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
    if (!apiKey) return;
  
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `${isDarkMode ? mapStyleDark : mapStyleLight}?key=${apiKey}`,
      center: [-95.36153769473093, 29.76790572283977], // Consistent center
      zoom: 8
    });
  
    mapInstance.current = map;
  
    map.on('load', async () => {
      // Add markers for resources
      for (const resource of resources) {
        try {
          const coordinates = await getGeocode(`${resource.address}, ${resource.state}`);
          
          if (coordinates) {
            const markerColor = 'orange';
  
            // Create and add marker
            const marker = new maplibregl.Marker({
              color: markerColor,
              draggable: false
            })
              .setLngLat(coordinates)
              .setPopup(
                new maplibregl.Popup({ offset: 25 })
                  .setHTML(`
                    <div class='w-full h-full bg-transparent text-black'>
                        <div class='flex flex-col'>
                            <span class="text-sm font-medium">${formatDeclarationTitle(resource.name)}</span>
                            <div class='flex flex-col '>
                                <span class='text-sm flex flex-row gap-1'>${resource.address}</span>
                            </div>
                        </div>
                    </div>
                `)
              )
              .addTo(map);
  
            // Attach click event to marker
            marker.getElement().addEventListener('click', () => {
              setSelectedResource(resource);
            });
  
            markersRef.current.push(marker); // Store the marker in the ref
          }
        } catch (error) {
          console.error('Error adding marker:', error);
        }
      }
    });
  
    return () => {
      map.remove();
    };
  }, [resources, onFlyToReady, isClient, isDarkMode]);

  // Only render on client
  if (!isClient) return null;

  return (
    <RMapContextProvider>
      <div ref={mapContainer} className='w-full h-screen absolute top-0 bottom-0 left-0 right-0'>
        <RMap>
          {selectedResource && (
            <Marker selectedResource={selectedResource} />
          )}
        </RMap>
      </div>
    </RMapContextProvider>
  );
};

const Marker = ({ selectedResource }: { selectedResource: ResourceType | null }) => {
  const map = useMap();

  const flyToMarker = async (coordinates: [number, number], zoom: number) => {
    if (coordinates && typeof coordinates[0] !== 'undefined') {
      try {
        map.flyTo({
          center: coordinates,
          zoom: zoom,
          essential: true
        });
      } catch (error) {
        console.error('Error flying to marker:', error);
      }
    }
  };

  useEffect(() => {
    const flyToMarkerGeocode = async () => {
      if (selectedResource) {
        try {
          const selectedGeocode = await getGeocode(`${selectedResource.address}, ${selectedResource.state}`);
          if (selectedGeocode && typeof selectedGeocode[0] !== 'undefined') {
            await flyToMarker(selectedGeocode, 11);
          }
        } catch (error) {
          console.error('Error getting geocode:', error);
        }
      }
    };
    
    if (map) {
      flyToMarkerGeocode();
    }
  }, [selectedResource, map]);

  return null;
};

export default dynamic(() => Promise.resolve(MapComponent), { 
  ssr: false 
});