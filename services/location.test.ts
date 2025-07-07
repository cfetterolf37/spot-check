import * as ExpoLocation from 'expo-location';
import { getUserLocation } from './location';

jest.mock('expo-location');

const mockCoords = { latitude: 1, longitude: 2 };
const mockLocation = { coords: mockCoords };
const mockAddress = [{ name: 'Test', street: 'Main', city: 'Town', region: 'State', country: 'Country' }];

describe('getUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns location and address when permission granted', async () => {
    (ExpoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ExpoLocation.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);
    (ExpoLocation.reverseGeocodeAsync as jest.Mock).mockResolvedValue(mockAddress);

    const result = await getUserLocation();
    expect(result.location).toEqual(mockLocation);
    expect(result.address).toContain('Test');
    expect(result.errorMsg).toBeNull();
  });

  it('returns error if permission denied', async () => {
    (ExpoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    const result = await getUserLocation();
    expect(result.location).toBeNull();
    expect(result.address).toBeNull();
    expect(result.errorMsg).toMatch(/denied/i);
  });

  it('returns error if location fetch fails', async () => {
    (ExpoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ExpoLocation.getCurrentPositionAsync as jest.Mock).mockRejectedValue(new Error('fail'));
    const result = await getUserLocation();
    expect(result.location).toBeNull();
    expect(result.address).toBeNull();
    expect(result.errorMsg).toMatch(/could not fetch/i);
  });
}); 