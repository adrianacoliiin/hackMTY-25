import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Colores de la App ---
const COLORS = {
  primaryBlue: '#004a77',
  lightGrayBg: '#f0f2f5',
  white: '#ffffff',
  darkText: '#333333',
  lightText: '#666666',
  lightBlueBg: '#e6f0f6', // Fondo azul claro para la notificación
  stepGreen: '#28a745', // Verde de la barra de progreso
};

// --- COMPONENTE DE HEADER REUTILIZABLE ---
// Ambas pantallas usan este header
const StepHeader = ({ title, step, totalSteps, navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color={COLORS.white} />
    </TouchableOpacity>
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>Paso {step} de {totalSteps}</Text>
    </View>
    <View style={{ width: 24 }} />
    {/* Barra de progreso */}
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
    </View>
  </View>
);

// --- Componente Reutilizable para Campo de Formulario ---
const FormField = ({ label, ...props }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholderTextColor="#999"
      {...props}
    />
  </View>
);

// --- PANTALLA 1: VERIFICACIÓN DE IDENTIDAD ---
export default function IdentityVerificationScreen({ navigation }) {
  // Estados para el formulario
  const [ssn, setSsn] = useState('');
  const [address, setAddress] = useState('Calle Principal 123');
  const [city, setCity] = useState('Ciudad de México');
  const [state, setState] = useState('CDMX');
  const [zip, setZip] = useState('12345');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <StepHeader 
        title="Verificación de identidad" 
        step={2} 
        totalSteps={4} 
        navigation={navigation} 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Caja de Notificación */}
          <View style={styles.notificationBox}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.primaryBlue} style={{ marginRight: 12 }} />
            <Text style={styles.notificationText}>
              Tu seguridad es nuestra prioridad. Esta información nos ayuda a verificar tu identidad y proteger tu cuenta.
            </Text>
          </View>

          {/* Formulario */}
          <FormField
            label="Número de Seguro Social (SSN)"
            value={ssn}
            onChangeText={setSsn}
            placeholder="***-**-****"
            secureTextEntry={true}
            keyboardType="number-pad"
            maxLength={9}
          />
          <FormField
            label="Dirección"
            value={address}
            onChangeText={setAddress}
          />
          <FormField
            label="Ciudad"
            value={city}
            onChangeText={setCity}
          />
          
          {/* Fila para Estado y Código Postal */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <FormField
                label="Estado"
                value={state}
                onChangeText={setState}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <FormField
                label="Código Postal"
                value={zip}
                onChangeText={setZip}
                keyboardType="number-pad"
              />
            </View>
          </View>

        </ScrollView>
        
        {/* Botones Fijos Abajo */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Hoja de Estilos (Compartida por ambas pantallas) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primaryBlue },
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { padding: 24 },
  // Header
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 16,
    paddingTop: 12, // Menos padding abajo para la barra
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative', // Para la barra de progreso
  },
  backButton: { padding: 5 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: COLORS.white, fontSize: 14 },
  // Barra de Progreso
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.stepGreen,
  },
  // Notificación
  notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlueBg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  notificationText: {
    flex: 1,
    color: COLORS.primaryBlue,
    fontSize: 14,
  },
  // Formulario
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.darkText,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Botones
  buttonContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrayBg,
    backgroundColor: COLORS.white,
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