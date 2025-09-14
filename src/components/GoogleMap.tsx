import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationClick?: (location: PokerLocation) => void;
  locations?: PokerLocation[];
  showOnlyLive?: boolean;
  className?: string;
}

interface PokerLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  tables: Array<{
    id: string;
    name: string;
    type: 'cash' | 'tournament';
    stakes: string;
    buyIn: string;
    seatsAvailable: number;
    totalSeats: number;
    isLive: boolean;
    startTime?: string;
  }>;
  rating?: number;
  isSponsored?: boolean;
  brandedPin?: {
    logo: string;
    color: string;
    name: string;
  };
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

// Utility function to validate coordinates with more strict checking
const validateCoordinates = (lat: any, lng: any): boolean => {
  // Check if values exist and are actually numbers
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return false;
  }
  
  // Convert to numbers if they're strings
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
  
  return (
    typeof latNum === 'number' && 
    typeof lngNum === 'number' && 
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    isFinite(latNum) && 
    isFinite(lngNum) &&
    latNum >= -90 && 
    latNum <= 90 && 
    lngNum >= -180 && 
    lngNum <= 180
  );
};

// Default fallback coordinates (NYC)
const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 };

export function GoogleMap({ 
  center = DEFAULT_CENTER,
  zoom = 14,
  onLocationClick,
  locations = [],
  showOnlyLive = false,
  className = ""
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const markersRef = useRef<any[]>([]);

  // Filter locations based on showOnlyLive and validate coordinates
  const filteredLocations = (showOnlyLive 
    ? locations.filter(location => 
        location.tables.some(table => table.isLive)
      )
    : locations
  ).filter(location => validateCoordinates(location.lat, location.lng));

  // Load Google Maps API with simplified loading (no advanced features)
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsApiLoaded(true);
        setIsLoading(false);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          setIsApiLoaded(true);
          setIsLoading(false);
        });
        existingScript.addEventListener('error', (error) => {
          console.error('Google Maps loading error:', error);
          setLoadError('Failed to load Google Maps. Please check your internet connection.');
          setIsLoading(false);
        });
        return;
      }

      const script = document.createElement('script');
      // Simplified API call without advanced features to avoid API activation errors
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDXBvnTgc6_dUl3-xOJ0nJWkMpdt9OqWhg&loading=async&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      // Set up global callback
      window.initGoogleMaps = () => {
        console.log('Google Maps API loaded successfully');
        setIsApiLoaded(true);
        setIsLoading(false);
      };
      
      script.onload = () => {
        // Backup in case callback doesn't fire
        if (!isApiLoaded) {
          setTimeout(() => {
            if (window.google && window.google.maps) {
              setIsApiLoaded(true);
              setIsLoading(false);
            }
          }, 100);
        }
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        setLoadError('Failed to load Google Maps. The API key may not be properly configured.');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [isApiLoaded]);

  // Get user's current location with improved validation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          console.log('Geolocation coordinates received:', { lat, lng, accuracy: position.coords.accuracy });
          
          if (validateCoordinates(lat, lng)) {
            console.log('Valid coordinates set:', { lat, lng });
            setUserLocation({ lat, lng });
          } else {
            console.error('Invalid coordinates received from geolocation:', { lat, lng });
            // Don't set userLocation, will use default center
          }
        },
        (error) => {
          console.log('Geolocation error:', error.message, 'Code:', error.code);
          // Continue without user location - this is not an error that should break the app
        },
        {
          enableHighAccuracy: false, // Use less accurate but more reliable positioning
          timeout: 15000, // Longer timeout
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, []);

  // Initialize map without advanced features
  useEffect(() => {
    if (!isApiLoaded || loadError || !mapRef.current || map) return;

    // Validate center coordinates with comprehensive fallback
    let mapCenter = DEFAULT_CENTER;
    
    if (userLocation && validateCoordinates(userLocation.lat, userLocation.lng)) {
      mapCenter = userLocation;
      console.log('Using user location for map center:', mapCenter);
    } else if (center && validateCoordinates(center.lat, center.lng)) {
      mapCenter = center;
      console.log('Using provided center for map:', mapCenter);
    } else {
      console.log('Using default center coordinates:', mapCenter);
    }
    
    // Create map without mapId and custom styles to avoid API issues
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: zoom,
      // Remove custom styles and mapId to avoid conflicts
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    console.log('Map initialized successfully');
    setMap(newMap);

    // Add user location marker if available - use simple marker
    if (userLocation && validateCoordinates(userLocation.lat, userLocation.lng)) {
      new window.google.maps.Marker({
        position: userLocation,
        map: newMap,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });
      console.log('User location marker added');
    }
  }, [isApiLoaded, loadError, map, userLocation, center, zoom]);

  // Add markers for poker locations using standard Markers
  useEffect(() => {
    if (!map || !isApiLoaded) return;

    console.log('Adding markers for', filteredLocations.length, 'locations');

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];

    // Add new markers using standard Google Maps Markers
    filteredLocations.forEach(location => {
      if (!validateCoordinates(location.lat, location.lng)) {
        console.warn(`Skipping location ${location.name} with invalid coordinates:`, location.lat, location.lng);
        return;
      }

      // Create marker with custom icon
      let markerIcon;
      
      if (location.brandedPin) {
        // Custom icon for branded pins
        markerIcon = {
          path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2z',
          fillColor: location.brandedPin.color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 1.5,
          anchor: new window.google.maps.Point(12, 24)
        };
      } else {
        // Default icon for regular locations
        markerIcon = {
          path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2z',
          fillColor: location.isSponsored ? '#f59e0b' : '#212A3E',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 1.2,
          anchor: new window.google.maps.Point(12, 24)
        };
      }

      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: markerIcon
      });

      // Create info window content
      const infoWindowContent = `
        <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #000; font-size: 16px; font-weight: 600;">
            ${location.brandedPin ? location.brandedPin.logo + ' ' : ''}${location.name}
            ${location.isSponsored ? '<span style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 4px;">SPONSORED</span>' : ''}
          </h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${location.address}</p>
          ${location.rating ? `
          <div style="margin: 0 0 8px 0; display: flex; align-items: center;">
            <span style="color: #f59e0b; margin-right: 4px;">★</span>
            <span style="color: #000; font-size: 14px;">${location.rating}</span>
          </div>
          ` : ''}
          <div style="margin: 8px 0 0 0;">
            <p style="margin: 0 0 8px 0; color: #000; font-size: 12px; font-weight: 600;">
              ${location.tables.length} table${location.tables.length !== 1 ? 's' : ''} available
            </p>
            ${location.tables.slice(0, 2).map(table => `
              <div style="margin: 4px 0; padding: 6px; background: #f8f9fa; border-radius: 4px;">
                <div style="font-size: 11px; color: #000; font-weight: 500;">${table.name}</div>
                <div style="font-size: 10px; color: #666; margin-top: 2px;">${table.stakes} • ${table.seatsAvailable}/${table.totalSeats} seats</div>
                ${table.isLive ? '<div style="font-size: 9px; color: #10b981; font-weight: 600; margin-top: 2px;">● LIVE</div>' : ''}
              </div>
            `).join('')}
            ${location.tables.length > 2 ? `<div style="font-size: 10px; color: #666; margin-top: 4px;">+${location.tables.length - 2} more table${location.tables.length - 2 !== 1 ? 's' : ''}</div>` : ''}
          </div>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent
      });

      // Add click listener
      marker.addListener('click', () => {
        // Close any open info windows
        markersRef.current.forEach(m => m.infoWindow?.close());
        
        // Open this info window
        infoWindow.open(map, marker);
        marker.infoWindow = infoWindow;
        
        // Call the onLocationClick callback
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      marker.infoWindow = infoWindow;
      markersRef.current.push(marker);
    });

    console.log('Added', markersRef.current.length, 'markers to map');
  }, [map, filteredLocations, onLocationClick, isApiLoaded]);

  // Center map on user location when available
  useEffect(() => {
    if (map && userLocation && validateCoordinates(userLocation.lat, userLocation.lng)) {
      console.log('Centering map on user location:', userLocation);
      map.setCenter(userLocation);
    }
  }, [map, userLocation]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-muted p-4 ${className}`}>
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-destructive text-xl">⚠️</span>
          </div>
          <div>
            <p className="text-sm text-destructive font-medium">Map Unavailable</p>
            <p className="text-xs text-muted-foreground mt-1">
              Google Maps couldn't load. Please check your internet connection or try again later.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs text-primary hover:underline"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
}