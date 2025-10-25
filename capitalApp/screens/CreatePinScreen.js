import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para los íconos

// --- Definimos los colores de la imagen ---
const COLORS = {
  primaryBlue: '#004a77', // Azul oscuro del header y botones
  lightGray: '#f0f2f5',  // Fondo de los inputs
  white: '#ffffff',
  darkText: '#333333',
  lightText: '#666666',
};

export default function CreatePinScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cambiamos el color de los íconos de la barra de estado (hora, batería) a claro */}
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* --- 1. Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Crear tu PIN</Text>
            <Text style={styles.headerSubtitle}>Paso 4 de 4</Text>
          </View>
          {/* Un espacio vacío para centrar el título correctamente */}
          <View style={{ width: 24 }} /> 
        </View>

        {/* --- 2. Contenido del Cuerpo --- */}
        <View style={styles.body}>
          <Ionicons name="lock-closed-outline" size={48} color={COLORS.primaryBlue} style={styles.lockIcon} />

          <Text style={styles.title}>Crea tu PIN de seguridad</Text>
          <Text style={styles.subtitle}>Usarás este PIN para acceder rápidamente a tu cuenta</Text>

          {/* --- 3. Formulario --- */}
          <View style={styles.form}>
            <Text style={styles.label}>PIN (4 dígitos)</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true} // Oculta el texto
              keyboardType="numeric"  // Muestra teclado numérico
              maxLength={4}           // Límite de 4 dígitos
              value={pin}
              onChangeText={setPin}
              placeholder="••••"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Confirmar PIN</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              keyboardType="numeric"
              maxLength={4}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="••••"
              placeholderTextColor="#999"
            />
          </View>

          {/* --- 4. Botones --- */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Crear cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()} // Asumimos que "Regresar" te lleva atrás
            >
              <Text style={styles.secondaryButtonText}>Regresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue, // Fondo azul para el área de la barra de estado
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Fondo blanco para el contenido
  },
  // --- Header ---
  header: {
    backgroundColor: COLORS.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 5, // Área táctil más grande
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.white,
    fontSize: 14,
  },
  // --- Body ---
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  lockIcon: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 32,
  },
  // --- Formulario ---
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 24,
    color: COLORS.darkText,
  },
  // --- Botones ---
  buttonContainer: {
    marginTop: 'auto', // Empuja los botones al fondo
    paddingBottom: 24, // Espacio en la parte inferior
  },
  primaryButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryBlue,
  },
  secondaryButtonText: {
    color: COLORS.primaryBlue,
    fontSize: 16,
    fontWeight: 'bold',
  },
});