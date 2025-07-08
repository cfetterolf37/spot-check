import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FiltersModal from '../../components/FiltersModal';
import ProfileModal from '../../components/ProfileModal';
import { useProfile } from '../../contexts/ProfileContext';

export default function TabLayout() {
  const { profile } = useProfile();
  const [profileSheetVisible, setProfileSheetVisible] = useState(false);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const openProfileSheet = () => {
    setProfileSheetVisible(true);
  };

  const closeProfileSheet = () => {
    setProfileSheetVisible(false);
  };

  const openFilterSheet = () => {
    setFilterSheetVisible(true);
  };

  const closeFilterSheet = () => {
    setFilterSheetVisible(false);
  };

  const handleApplyFilters = (location: string, radius: number) => {
    // Here you would apply the filters to your data
    console.log(`Filters applied: ${location} within ${radius} miles`);
    // You can integrate this with your data fetching logic
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Profile Icon (absolute, top left) */}
        <TouchableOpacity
          style={profileStyles.profileIcon}
          onPress={openProfileSheet}
          accessibilityRole="button"
          accessibilityLabel="Open account info"
          accessible
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {profile?.avatar_url ? (
            <Image 
              source={{ uri: profile.avatar_url }} 
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee' }} 
            />
          ) : (
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="user" size={18} color="#2563eb" />
            </View>
          )}
        </TouchableOpacity>

        {/* Filters Icon (absolute, top right) */}
        <TouchableOpacity
          style={profileStyles.filterIcon}
          onPress={openFilterSheet}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          accessible
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="filter" size={20} color="#2563eb" />
        </TouchableOpacity>

        {/* Profile Modal */}
        <ProfileModal 
          visible={profileSheetVisible} 
          onClose={closeProfileSheet} 
        />

        {/* Filters Modal */}
        <FiltersModal 
          visible={filterSheetVisible} 
          onClose={closeFilterSheet}
          onApplyFilters={handleApplyFilters}
        />

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="home" color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </GestureHandlerRootView>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
}

const profileStyles = StyleSheet.create({
  profileIcon: {
    position: 'absolute',
    top: 40,
    left: 24,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  filterIcon: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
}); 