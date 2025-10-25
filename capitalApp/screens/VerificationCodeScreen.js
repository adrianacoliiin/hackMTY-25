import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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
  lightBlueBg: '#e6f0f6',
  stepGreen: '#28a745',
};

// --- COMPONENTE DE HEADER REUTILIZABLE ---
// (Definido en el código anterior, asegúrate de importarlo o copiarlo aquí)
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
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${(step / totalSteps) * 100}%` }]} />
    </View>
  </View>
);


// --- PANTALLA 2: CÓDIGO DE VERIFICACIÓN ---
export default function VerificationCodeScreen({ navigation }) {
  const [code, setCode] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <StepHeader 
        title="Código de verificación" 
        step={3} 
        totalSteps={4} 
        navigation={navigation} 
      />

      <View style={styles.container}>
        {/* Contenido principal centrado */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={32} color={COLORS.primaryBlue} />
          </View>
          
          <Text style={styles.title}>Revisa tu correo</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un código de 6 dígitos a 
            <Text style={{ fontWeight: 'bold' }}> 123@gmail.com</Text>
          </Text>

          {/* Input de Código */}
          <Text style={styles.label}>Código de verificación</Text>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            placeholder="000000"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />

          <TouchableOpacity>
            <Text style={styles.resendLink}>Reenviar código</Text>
          </TouchableOpacity>
        </View>
        
        {/* Botones Fijos Abajo */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Regresar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Hoja de Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primaryBlue },
  container: { flex: 1, backgroundColor: COLORS.white },
  // Header
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  backButton: { padding: 5 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: COLORS.white, fontSize: 14 },
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
  // Contenido
  content: {
    flex: 1, // Ocupa el espacio disponible
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.lightBlueBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  codeInput: {
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 8,
    paddingVertical: 14,
    fontSize: 24, // Letra más grande
    fontWeight: 'bold',
    color: COLORS.darkText,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '80%', // Más angosto que el 100%
    marginBottom: 24,
  },
  resendLink: {
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Botones
  buttonContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrayBg,
    backgroundColor: COLORS.white,
    marginTop: 'auto', // Empuja los botones al fondo
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