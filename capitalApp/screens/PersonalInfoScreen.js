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
  lightGrayBg: '#f0f2f5', // Fondo de los inputs
  white: '#ffffff',
  darkText: '#333333',
  lightText: '#666666',
};

// --- Componente Reutilizable para Campo de Formulario ---
// Esto hace que el código principal sea mucho más limpio
const FormField = ({ label, icon, ...props }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          {...props}
        />
        {/* Mostramos el ícono si se proporciona */}
        {icon && <View style={styles.iconWrapper}>{icon}</View>}
      </View>
    </View>
  );
};

// --- Componente Reutilizable para el Header ---
const ScreenHeader = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color={COLORS.white} />
    </TouchableOpacity>
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitle}>Información personal</Text>
      <Text style={styles.headerSubtitle}>Paso 1 de 4</Text>
    </View>
    <View style={{ width: 24 }} /> {/* Espacio para centrar */}
  </View>
);

// --- Componente Principal de la Pantalla ---
export default function PersonalInfoScreen({ navigation }) {
  // Estados para cada campo del formulario
  // Los rellenamos con los datos de la imagen
  const [nombre, setNombre] = useState('Juan');
  const [apellidos, setApellidos] = useState('Pérez García');
  const [correo, setCorreo] = useState('tu@email.com');
  const [telefono, setTelefono] = useState('(555) 123-4567');
  const [fecha, setFecha] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Usamos ScrollView para que el formulario se pueda deslizar
          cuando aparece el teclado.
        */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <FormField
            label="Nombre"
            value={nombre}
            onChangeText={setNombre}
          />
          <FormField
            label="Apellidos"
            value={apellidos}
            onChangeText={setApellidos}
          />
          <FormField
            label="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormField
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          <FormField
            label="Fecha de nacimiento"
            value={fecha}
            onChangeText={setFecha}
            placeholder="mm/dd/yyyy"
            icon={<Ionicons name="calendar-outline" size={20} color={COLORS.lightText} />}
          />
        </ScrollView>
        
        {/* Botón de Continuar (fuera del ScrollView para que quede abajo) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Hoja de Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24, // Espacio interno para el formulario
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
    padding: 5,
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
  // --- Formulario ---
  fieldContainer: {
    marginBottom: 24, // Espacio entre cada campo
  },
  label: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Borde sutil
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.darkText,
  },
  iconWrapper: {
    paddingHorizontal: 16,
  },
  // --- Botón ---
  buttonContainer: {
    padding: 24,
    paddingTop: 8, // Menos espacio arriba
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrayBg,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});