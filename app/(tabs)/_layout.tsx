import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FiltersModal from '../../components/FiltersModal';
import ProfileModal from '../../components/ProfileModal';
import { useLocationContext } from '../../contexts/LocationContext';
import { useProfile } from '../../contexts/ProfileContext';
import { WeatherProvider, useWeather } from '../../contexts/WeatherContext';

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

function HeaderTitle({ locationLabel }: { locationLabel: string }) {
  const { weather, loading } = useWeather();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>{locationLabel}</Text>
      {weather && !loading && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Text style={{ fontSize: 14, color: '#2563eb', marginRight: 4 }}>
            {Math.round(weather.tempF)}°F / {Math.round(weather.tempC)}°C
          </Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 13, color: '#666', marginLeft: 4 }}>{toTitleCase(weather.description)}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { profile } = useProfile();
  const { location } = useLocationContext();
  const [profileSheetVisible, setProfileSheetVisible] = useState(false);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const openProfileSheet = () => setProfileSheetVisible(true);
  const closeProfileSheet = () => setProfileSheetVisible(false);
  const openFilterSheet = () => setFilterSheetVisible(true);
  const closeFilterSheet = () => setFilterSheetVisible(false);

  let locationLabel = 'Home';
  if (location.city && location.state) {
    locationLabel = `${location.city}, ${location.state}`;
  } else if (location.rawInput) {
    locationLabel = location.rawInput;
  }

  return (
    <WeatherProvider lat={location.latitude ?? null} lon={location.longitude ?? null}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ProfileModal 
            visible={profileSheetVisible} 
            onClose={closeProfileSheet} 
          />
          <FiltersModal 
            visible={filterSheetVisible} 
            onClose={closeFilterSheet}
          />
          <Tabs
            initialRouteName="index"
            screenOptions={{
              headerTitle: () => <HeaderTitle locationLabel={locationLabel} />,
              headerTitleAlign: 'center',
              headerLeft: () => (
                <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', marginLeft: 12, paddingVertical: 4 }}>
                  <TouchableOpacity
                    onPress={openProfileSheet}
                    accessibilityRole="button"
                    accessibilityLabel="Open account info"
                    accessible
                    activeOpacity={0.8}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {profile?.avatar_url ? (
                      <Image
                        source={{ uri: profile.avatar_url }}
                        style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0' }}
                      />
                    ) : (
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
                        <Feather name="user" size={18} color="#2563eb" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ),
              headerRight: () => (
                <View style={{ width: 38, height: 38, justifyContent: 'center', alignItems: 'center', marginRight: 12, paddingVertical: 4 }}>
                  <TouchableOpacity
                    onPress={openFilterSheet}
                    accessibilityRole="button"
                    accessibilityLabel="Open filters"
                    accessible
                    activeOpacity={0.8}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons name="tune" size={22} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              ),
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
                color: '#222',
              },
            }}
          >
            <Tabs.Screen
              name='index'
              options={{
                title: '',
                headerTitle: () => <HeaderTitle locationLabel={locationLabel} />,
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="home" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name='favorites'
              options={{
                title: '',
                headerTitle: () => <HeaderTitle locationLabel={locationLabel} />,
                tabBarIcon: ({ color }) => (
                  <Feather name="star" color={color} size={28} style={{ marginBottom: -3 }} />
                ),
              }}
            />
          </Tabs>
        </View>
      </GestureHandlerRootView>
    </WeatherProvider>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
} 