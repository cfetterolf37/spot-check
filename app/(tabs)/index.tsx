import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from '../../hooks/useLocation';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { location, address, errorMsg, loading, refreshLocation } = useLocation();

  const handleSignOut = async () => {
    await signOut();
    Toast.show({
      type: 'success',
      text1: 'Signed out',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Welcome to Spot Check!">Welcome to Spot Check!</Text>
      <Text style={styles.subtitle} accessibilityLabel={`You are signed in as: ${user?.email}`}>You are signed in as: {user?.email}</Text>
      <View style={styles.locationCard} accessible accessibilityLabel="Your Location">
        <Text style={styles.locationTitle} accessibilityRole="header" accessibilityLabel="Your Location">Your Location</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#2563eb" accessibilityLabel="Loading location" />
        ) : errorMsg ? (
          <Text style={styles.errorText} accessibilityLabel={errorMsg}>{errorMsg}</Text>
        ) : location ? (
          <>
            <Text style={styles.locationText} accessibilityLabel={`Latitude: ${location.coords.latitude.toFixed(6)}`}>Latitude: {location.coords.latitude.toFixed(6)}</Text>
            <Text style={styles.locationText} accessibilityLabel={`Longitude: ${location.coords.longitude.toFixed(6)}`}>Longitude: {location.coords.longitude.toFixed(6)}</Text>
            {address && (
              <Text style={styles.locationText} accessibilityLabel={`Address: ${address}`}>Address: {address}</Text>
            )}
          </>
        ) : (
          <Text style={styles.errorText} accessibilityLabel="Location not available">Location not available</Text>
        )}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshLocation}
          accessibilityRole="button"
          accessibilityLabel="Refresh Location"
          accessible
        >
          <Text style={styles.refreshButtonText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} accessibilityRole="button" accessibilityLabel="Sign Out" accessible>
        <Text style={styles.signOutButtonText} accessibilityLabel="Sign Out">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
  },
  locationCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2563eb',
  },
  locationText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 15,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 