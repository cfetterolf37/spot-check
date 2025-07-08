import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getUserLocation } from '../services/location';

export interface LocationData {
  city?: string;
  state?: string;
  zip?: string;
  radius?: number;
  rawInput?: string;
  latitude?: number;
  longitude?: number;
  categories?: string[];
}

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData, loading?: boolean) => void;
  loading: boolean;
  getCurrentLocation: () => Promise<LocationData | undefined>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch location on mount
    getUserLocation().then(result => {
      // Parse city and state from address string if available
      let city, state, latitude, longitude;
      if (result?.address) {
        const parts = result.address.split(',').map(s => s.trim());
        if (parts.length >= 3) {
          city = parts[parts.length - 3];
          state = parts[parts.length - 2];
        }
      }
      if (result?.location) {
        latitude = result.location.coords.latitude;
        longitude = result.location.coords.longitude;
      }
      setLocationState({
        city,
        state,
        latitude,
        longitude,
        // ...other fields as needed
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // setLocation can optionally set loading to true (for user-typed searches)
  const setLocation = (loc: LocationData, loadingOverride?: boolean) => {
    setLocationState(loc);
    if (loadingOverride !== undefined) {
      setLoading(loadingOverride);
    } else {
      setLoading(false);
    }
  };

  // Returns the current device location as LocationData
  const getCurrentLocation = async (): Promise<LocationData | undefined> => {
    try {
      const result = await getUserLocation();
      let city, state, latitude, longitude;
      if (result?.address) {
        const parts = result.address.split(',').map(s => s.trim());
        if (parts.length >= 3) {
          city = parts[parts.length - 3];
          state = parts[parts.length - 2];
        }
      }
      if (result?.location) {
        latitude = result.location.coords.latitude;
        longitude = result.location.coords.longitude;
      }
      return { city, state, latitude, longitude };
    } catch {
      return undefined;
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, loading, getCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext must be used within a LocationProvider');
  return ctx;
} 