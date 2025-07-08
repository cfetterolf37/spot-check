import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchNearbyPlaces, Place } from '../services/places';

interface PlacesContextType {
  places: Place[];
  loading: boolean;
  error: string | null;
  refreshPlaces: (lat: number, lon: number) => void;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export function PlacesProvider({ lat, lon, children }: { lat: number | null, lon: number | null, children: React.ReactNode }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetPlaces = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    const data = await fetchNearbyPlaces(lat, lon);
    if (data) {
      setPlaces(data);
    } else {
      setError('Failed to fetch places');
      setPlaces([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (lat != null && lon != null) {
      fetchAndSetPlaces(lat, lon);
    }
  }, [lat, lon]);

  return (
    <PlacesContext.Provider value={{ places, loading, error, refreshPlaces: fetchAndSetPlaces }}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const ctx = useContext(PlacesContext);
  if (!ctx) throw new Error('usePlaces must be used within a PlacesProvider');
  return ctx;
} 