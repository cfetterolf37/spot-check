import * as Location from 'expo-location';

/**
 * The result of a location fetch, including the location object, address, and error message (if any).
 */
export interface LocationResult {
  location: Location.LocationObject | null;
  address: string | null;
  errorMsg: string | null;
}

/**
 * Requests location permissions, fetches the user's current location, and reverse geocodes the address.
 * Returns a LocationResult with location, address, and errorMsg.
 */
export async function getUserLocation(): Promise<LocationResult> {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        location: null,
        address: null,
        errorMsg: 'Permission to access location was denied',
      };
    }
    let loc = await Location.getCurrentPositionAsync({});
    let address: string | null = null;
    try {
      const [addr] = await Location.reverseGeocodeAsync(loc.coords);
      if (addr) {
        address = [addr.name, addr.street, addr.city, addr.region, addr.country]
          .filter(Boolean)
          .join(', ');
      }
    } catch {
      // Ignore reverse geocode errors
    }
    return {
      location: loc,
      address,
      errorMsg: null,
    };
  } catch {
    return {
      location: null,
      address: null,
      errorMsg: 'Could not fetch location',
    };
  }
} 