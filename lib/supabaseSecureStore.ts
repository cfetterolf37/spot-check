import * as SecureStore from 'expo-secure-store';

/**
 * SecureStorage adapter for Supabase session storage using expo-secure-store.
 * Provides async getItem, setItem, and removeItem methods.
 */
export const SecureStorage = {
  async getItem(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};