/**
 * Custom hook to get the user's current location and address.
 * Handles permission requests, loading state, and errors.
 * Returns location, address, errorMsg, loading, and a refreshLocation function.
 */
import { useCallback, useEffect, useState } from 'react';
import { getUserLocation, LocationResult } from '../services/location';

export function useLocation() {
  const [location, setLocation] = useState<LocationResult['location']>(null);
  const [address, setAddress] = useState<LocationResult['address']>(null);
  const [errorMsg, setErrorMsg] = useState<LocationResult['errorMsg']>(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    const result = await getUserLocation();
    setLocation(result.location);
    setAddress(result.address);
    setErrorMsg(result.errorMsg);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { location, address, errorMsg, loading, refreshLocation: fetchLocation };
} 