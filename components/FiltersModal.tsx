import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

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
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const radiusOptions = [1, 3, 5, 10, 15, 25, 50];

  useEffect(() => {
    if (visible) {
      // Reset any ongoing animations
      slideAnim.setValue(screenHeight);
      translateY.setValue(0);
      
      // Slide up from bottom
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // Slide down to bottom
      Animated.spring(slideAnim, {
        toValue: screenHeight,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible, slideAnim]);

  const applyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(locationInput, selectedRadius);
    } else {
      // Default behavior
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
        // Snap back to open position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
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

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Filters</Text>
              
              <Text style={styles.modalLabel}>Location or Zip Code:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter city, state, or zip code"
                value={locationInput}
                onChangeText={setLocationInput}
                accessibilityLabel="Location input"
                accessible
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <Text style={styles.modalLabel}>Radius (miles):</Text>
              <View style={styles.radiusContainer}>
                {radiusOptions.map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[
                      styles.radiusButton,
                      selectedRadius === radius && styles.radiusButtonSelected
                    ]}
                    onPress={() => setSelectedRadius(radius)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${radius} mile radius`}
                    accessible
                  >
                    <Text style={[
                      styles.radiusButtonText,
                      selectedRadius === radius && styles.radiusButtonTextSelected
                    ]}>
                      {radius}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

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
    paddingBottom: 24,
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
}); 