import { router, Stack, useSegments } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LocationGate } from '../components/LocationGate';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LocationProvider } from '../contexts/LocationContext';
import { ProfileProvider } from '../contexts/ProfileContext';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    // While redirecting, render nothing
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const segments = useSegments();
  const isAuthRoute = segments[0] === 'auth';

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <LocationProvider>
            <LocationGate>
              {isAuthRoute ? (
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="auth/login" />
                  <Stack.Screen name="auth/register" />
                </Stack>
              ) : (
                <AuthGate>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                </AuthGate>
              )}
              <Toast />
            </LocationGate>
          </LocationProvider>
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
