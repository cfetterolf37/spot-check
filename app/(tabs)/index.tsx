import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PlacesList from '../../components/PlacesList';
import { useLocationContext } from '../../contexts/LocationContext';
import { PlacesProvider } from '../../contexts/PlacesContext';

export default function HomeScreen() {
  const { location } = useLocationContext();
  return (
    <PlacesProvider lat={location.latitude ?? null} lon={location.longitude ?? null}>
      <View style={styles.container}>
        <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Welcome to Spot Check!">Welcome to Spot Check!</Text>
        <View style={{ width: '100%', flex: 1 }}>
          <PlacesList />
        </View>
      </View>
    </PlacesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop: 32,
    marginBottom: 8,
  },
}); 