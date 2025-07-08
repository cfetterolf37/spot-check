import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocationContext } from '../contexts/LocationContext';

export function LocationGate({ children }: { children: React.ReactNode }) {
  const { loading } = useLocationContext();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <>{children}</>;
} 