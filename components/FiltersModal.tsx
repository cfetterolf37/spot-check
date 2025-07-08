import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import MultiSelect from 'react-native-multiple-select';
import Toast from 'react-native-toast-message';
import { useLocationContext } from '../contexts/LocationContext';

const { height: screenHeight } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = 500;

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters?: (location: string, radius: number) => void;
}

export default function FiltersModal({ visible, onClose, onApplyFilters }: FiltersModalProps) {
  const [locationInput, setLocationInput] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const { setLocation, getCurrentLocation } = useLocationContext();

  // Curated Google Places types
  const placeCategories = [
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'cafe', name: 'Cafe' },
    { id: 'bar', name: 'Bar' },
    { id: 'park', name: 'Park' },
    { id: 'gym', name: 'Gym' },
    { id: 'museum', name: 'Museum' },
    { id: 'store', name: 'Store' },
    { id: 'supermarket', name: 'Supermarket' },
    { id: 'library', name: 'Library' },
    { id: 'movie_theater', name: 'Movie Theater' },
    { id: 'shopping_mall', name: 'Shopping Mall' },
    { id: 'lodging', name: 'Lodging' },
    { id: 'pharmacy', name: 'Pharmacy' },
    { id: 'hospital', name: 'Hospital' },
    { id: 'atm', name: 'ATM' },
  ];

  useEffect(() => {
    if (visible) {
      // Reset any ongoing animations
      slideAnim.setValue(screenHeight);
      translateY.setValue(0);
      // Slide up from bottom (no bounce)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down to bottom (no bounce)
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, translateY]);

  const handleUseCurrentLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      if (loc) {
        setLocationInput(`${loc.city || ''}${loc.state ? ', ' + loc.state : ''}`);
        setLocation({ ...loc, radius: selectedRadius, rawInput: '', zip: undefined }, true);
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Could not get current location' });
    }
  };

  const applyFilters = () => {
    // Try to parse city, state from input (simple split on comma)
    let city, state, zip;
    const trimmed = locationInput.trim();
    if (/^\d{5}$/.test(trimmed)) {
      zip = trimmed;
    } else if (trimmed.includes(',')) {
      const parts = trimmed.split(',').map(s => s.trim());
      city = parts[0];
      state = parts[1];
    } else {
      city = undefined;
      state = undefined;
    }
    setLocation({ city, state, zip, radius: selectedRadius, rawInput: trimmed, latitude: undefined, longitude: undefined, categories: selectedCategories }, true); // set loading to true
    if (onApplyFilters) {
      onApplyFilters(locationInput, selectedRadius);
    } else {
      Toast.show({ 
        type: 'success', 
        text1: `Filters applied: ${locationInput} within ${selectedRadius} miles` 
      });
    }
    onClose();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY } = event.nativeEvent;
      if (translationY > 100) {
        // Swipe down to close
        onClose();
      } else {
        // Snap back to open position (no bounce)
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [
              { translateY: slideAnim },
              { translateY: translateY }
            ],
          },
        ]}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetY={[-10, 10]}
          failOffsetX={[-20, 20]}
          shouldCancelWhenOutside={true}
        >
          <Animated.View style={styles.sheetContent}>
            {/* Drag Handle */}
            <View style={styles.dragHandle}>
              <View style={styles.dragIndicator} />
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.modalTitle}>Filters</Text>
              
              <Text style={styles.modalLabel}>Location or Zip Code:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TextInput
                  style={[styles.modalInput, { flex: 1 }]}
                  placeholder="Enter city, state, or zip code"
                  value={locationInput}
                  onChangeText={setLocationInput}
                  accessibilityLabel="Location input"
                  accessible
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <TouchableOpacity onPress={handleUseCurrentLocation} style={styles.currentLocationButton} accessibilityRole="button" accessibilityLabel="Use current location">
                  <Text style={styles.currentLocationText}>Use Current Location</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Radius (miles):</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Slider
                  style={{ flex: 1, height: 40 }}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  value={selectedRadius}
                  onValueChange={setSelectedRadius}
                  minimumTrackTintColor="#2563eb"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#2563eb"
                  accessibilityLabel="Radius slider"
                />
                <Text style={{ width: 40, textAlign: 'center', fontWeight: 'bold', color: '#2563eb' }}>{selectedRadius}</Text>
              </View>

              <Text style={styles.modalLabel}>Categories:</Text>
              <MultiSelect
                items={placeCategories}
                uniqueKey="id"
                onSelectedItemsChange={setSelectedCategories}
                selectedItems={selectedCategories}
                selectText="Pick Categories"
                searchInputPlaceholderText="Search Categories..."
                tagRemoveIconColor="#2563eb"
                tagBorderColor="#2563eb"
                tagTextColor="#2563eb"
                selectedItemTextColor="#2563eb"
                selectedItemIconColor="#2563eb"
                itemTextColor="#222"
                displayKey="name"
                searchInputStyle={{ color: '#222' }}
                submitButtonColor="#2563eb"
                submitButtonText="Done"
                styleDropdownMenuSubsection={{ borderRadius: 8, borderColor: '#ddd', borderWidth: 1, marginBottom: 8 }}
                styleListContainer={{ borderRadius: 8, borderColor: '#ddd', borderWidth: 1 }}
                styleInputGroup={{ borderRadius: 8, borderColor: '#ddd', borderWidth: 1 }}
              />

              <Pressable
                style={[styles.applyButton, { backgroundColor: '#2563eb', marginTop: 20 }]}
                onPress={applyFilters}
                accessibilityRole="button"
                accessibilityLabel="Apply filters"
                accessible
              >
                <Text style={[styles.applyButtonText, { color: 'white' }]}>Apply Filters</Text>
              </Pressable>
            </ScrollView>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: BOTTOM_SHEET_HEIGHT,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  dragHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  radiusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  radiusButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  radiusButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  radiusButtonText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '600',
  },
  radiusButtonTextSelected: {
    color: 'white',
  },
  applyButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  currentLocationButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  currentLocationText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13,
  },
}); 