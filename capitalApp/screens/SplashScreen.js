import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Mantener el splash nativo visible hasta que hagamos la transición
SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent({ navigation }) {
  useEffect(() => {
    // Esperar 2 segundos mostrando el splash nativo (fondo blanco + flecha roja)
    const timer = setTimeout(async () => {
      // Ocultar el splash nativo y navegar directamente a Login
      await SplashScreen.hideAsync();
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // No renderizamos nada porque el splash nativo se encarga de todo
  return null;
}