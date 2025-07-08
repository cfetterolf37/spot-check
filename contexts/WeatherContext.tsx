import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchWeather, WeatherData } from '../services/weather';

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  refreshWeather: (lat: number, lon: number) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ lat, lon, children }: { lat: number | null, lon: number | null, children: React.ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    const data = await fetchWeather(lat, lon);
    if (data) {
      setWeather(data);
    } else {
      setError('Failed to fetch weather');
      setWeather(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (lat != null && lon != null) {
      fetchAndSetWeather(lat, lon);
    }
  }, [lat, lon]);

  return (
    <WeatherContext.Provider value={{ weather, loading, error, refreshWeather: fetchAndSetWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within a WeatherProvider');
  return ctx;
} 