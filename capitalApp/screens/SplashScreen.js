import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000, // <-- Duración de la animación (5 segundos)
      useNativeDriver: true,
    }).start(() => {
      // Callback: se ejecuta después de que termina la animación
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        navigation.replace('Login');
      }, 3000); // <-- CAMBIO AQUÍ: Tiempo de espera después de la animación (3 segundos)
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/splash-one.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '65%',
  },
});
// 094b77