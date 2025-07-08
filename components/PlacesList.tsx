import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { usePlaces } from '../contexts/PlacesContext';

export default function PlacesList() {
  const { places, loading, error } = usePlaces();

  if (loading) {
    return <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 32 }} />;
  }
  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }
  if (!places.length) {
    return <Text style={styles.empty}>No places found nearby.</Text>;
  }
  return (
    <FlatList
      data={places}
      keyExtractor={item => item.place_id}
      contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
      style={{ width: '100%', alignSelf: 'center', maxWidth: 500 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} style={styles.photo} resizeMode="cover" />
          ) : (
            <View style={[styles.photo, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ color: '#bbb', fontSize: 18 }}>No Photo</Text>
            </View>
          )}
          <View style={styles.details}>
            <Text style={styles.placeName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Text style={styles.placeAddress} numberOfLines={2} ellipsizeMode="tail">{item.address}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#eee',
    flexShrink: 0,
  },
  details: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  empty: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
}); 