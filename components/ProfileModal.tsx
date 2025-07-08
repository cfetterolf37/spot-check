import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

const { height: screenHeight } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = Math.min(600, screenHeight * 0.8);

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, error: profileError, updateProfile, uploadAvatarAndUpdate, refreshProfile } = useProfile();
  const [displayName, setDisplayName] = useState('');
  const [uploading, setUploading] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && profile) {
      setDisplayName(profile.display_name ?? '');
    }
  }, [visible, profile]);

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

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    const success = await updateProfile({ display_name: displayName });
    if (success) {
      Toast.show({ type: 'success', text1: 'Profile updated' });
      await refreshProfile();
      Keyboard.dismiss();
    } else {
      Toast.show({ type: 'error', text1: 'Failed to update profile' });
    }
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      const uri = result.assets[0].uri;
      const success = await uploadAvatarAndUpdate(uri);
      setUploading(false);
      if (success) {
        Toast.show({ type: 'success', text1: 'Avatar uploaded and profile updated' });
        await refreshProfile();
      } else {
        Toast.show({ type: 'error', text1: 'Failed to upload avatar' });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    Toast.show({
      type: 'success',
      text1: 'Signed out',
      position: 'bottom',
      visibilityTime: 2000,
    });
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

            <ScrollView 
              style={{ flex: 1 }} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={{ alignItems: 'center', width: '100%', marginTop: 20 }}>
                <TouchableOpacity onPress={handlePickAvatar} style={{ alignItems: 'center', marginBottom: 16 }}>
                  {profile?.avatar_url ? (
                    <Image
                      source={{ uri: profile.avatar_url }}
                      style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#eee' }}
                    />
                  ) : (
                    <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
                      <Feather name="user" size={40} color="#bbb" />
                    </View>
                  )}
                  <Text style={{ color: '#2563eb', marginTop: 8, fontSize: 13, textAlign: 'center' }}>Change Photo</Text>
                  {(uploading || profileLoading) && <ActivityIndicator size="small" color="#2563eb" style={{ marginTop: 4 }} />}
                </TouchableOpacity>
              </View>
              <Text style={styles.modalTitle}>Account Info</Text>
              <Text style={styles.modalLabel}>Email:</Text>
              <Text style={styles.modalValue}>{user?.email}</Text>
              <Text style={styles.modalLabel}>Display Name:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter your name"
                value={displayName}
                onChangeText={setDisplayName}
                accessibilityLabel="Display Name"
                accessible
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <Pressable
                style={[styles.modalLogoutButton, { backgroundColor: '#2563eb', marginBottom: 8 }]}
                onPress={handleSaveProfile}
                accessibilityRole="button"
                accessibilityLabel="Save Profile"
                accessible
                disabled={profileLoading}
              >
                <Text style={[styles.modalLogoutButtonText, { color: 'white' }]}>Save Profile</Text>
              </Pressable>
              <Pressable
                style={styles.modalLogoutButton}
                onPress={handleSignOut}
                accessibilityRole="button"
                accessibilityLabel="Log Out"
                accessible
              >
                <Text style={styles.modalLogoutButtonText}>Log Out</Text>
              </Pressable>
              {profileError && <Text style={{ color: '#FF3B30', fontSize: 15, textAlign: 'center', marginTop: 8 }}>{profileError}</Text>}
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
  modalValue: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
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
  modalLogoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalLogoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 