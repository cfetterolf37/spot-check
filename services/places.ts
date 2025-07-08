const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export interface Place {
  place_id: string;
  name: string;
  address: string;
  photoUrl?: string;
}

function getPhotoUrl(photoReference: string, maxwidth = 400) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
}

export async function fetchNearbyPlaces(lat: number, lon: number, radiusMeters = 3218): Promise<Place[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key is missing');
    return [];
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radiusMeters}&key=${GOOGLE_PLACES_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      address: place.vicinity,
      photoUrl: place.photos && place.photos.length > 0 ? getPhotoUrl(place.photos[0].photo_reference) : undefined,
    }));
  } catch (e) {
    console.warn('Failed to fetch places:', e);
    return [];
  }
} 