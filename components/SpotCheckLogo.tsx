import React from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';

interface SpotCheckLogoProps extends Omit<ImageProps, 'source' | 'style'> {
  size?: number;
}

export default function SpotCheckLogo({ size = 120, ...props }: SpotCheckLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/spotcheck_logo.png')}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logo: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: 'white',
  },
}); 