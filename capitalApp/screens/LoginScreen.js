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
  Image,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// --- Colores de la App ---
const COLORS = {
  primaryBlue: '#004a77', // Azul oscuro de fondo
  white: '#ffffff',
  darkText: '#222222',
  lightText: '#666666',
  borderGray: '#cccccc',
};

export default function LoginScreen({ navigation }) {
  // --- Estados para el formulario ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Marcado por defecto en la imagen
  const [useIdentifier, setUseIdentifier] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          {/* --- 1. Logo --- */}
          <View style={styles.logoContainer}>
            <Image
              // Logo de Capital One (similar al de la imagen)
              source={require('../assets/splash-one.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* --- 2. Tarjeta de Formulario --- */}
          <View style={styles.formCard}>
            
            {/* Input de Usuario */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Usuario"
                placeholderTextColor={COLORS.lightText}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <TouchableOpacity>
                <Ionicons name="expand-outline" size={20} color={COLORS.lightText} />
              </TouchableOpacity>
            </View>

            {/* Input de Contraseña */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe tu contraseña"
                placeholderTextColor={COLORS.lightText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword} // Lógica para mostrar/ocultar
              />
              <TouchableOpacity 
                style={styles.showButton} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showButtonText}>Mostrar</Text>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color={COLORS.primaryBlue} 
                />
              </TouchableOpacity>
            </View>

            {/* Checkboxes */}
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setRememberMe(!rememberMe)}
            >
              <MaterialIcons 
                name={rememberMe ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color={COLORS.darkText} 
              />
              <Text style={styles.checkboxLabel}>Recuérdame</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setUseIdentifier(!useIdentifier)}
            >
              <MaterialIcons 
                name={useIdentifier ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color={COLORS.darkText} 
              />
              <Text style={styles.checkboxLabel}>Usar identificador</Text>
            </TouchableOpacity>

            {/* Botón de Ingresar */}
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Ingresar</Text>
            </TouchableOpacity>

            {/* Link de Olvidar Contraseña */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotButtonText}>¿Olvidaste tu nombre de usuario o contraseña?</Text>
            </TouchableOpacity>

          </View>

          {/* --- 3. Links y Footer --- */}
          <View style={styles.footerArea}>
            
            {/* Links inferiores */}
            <View style={styles.footerLinksContainer}>
              <TouchableOpacity><Text style={styles.footerLink}>Inscríbete</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Abre una cuenta</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Privacidad</Text></TouchableOpacity>
              <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={24} color={COLORS.white} /></TouchableOpacity>
            </View>

            {/* Texto Legal */}
            <View style={styles.legalContainer}>
              <Text style={styles.legalText}>
                <Ionicons name="home" size={10} color={COLORS.white} /> Igualdad de Oportunidad en la Vivienda
              </Text>
              <Text style={styles.legalText}>
                Los productos de depósito se ofrecen a través de JPMorgan
                Chase Bank, N.A. Miembro de FDIC
              </Text>
              <Text style={styles.legalText}>
                Las tarjetas de crédito son emitidas por JPMorgan Chase Bank,
                N.A. Miembro de FDIC
              </Text>
            </View>
          </View>

        </ScrollView>
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
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between', // Empuja el logo arriba y el footer abajo
  },
  // --- Logo ---
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 80,
  },
  // --- Formulario ---
  formCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.darkText,
  },
  showButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showButtonText: {
    marginRight: 8,
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
  },
  // Checkboxes
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.darkText,
  },
  // Botones
  loginButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  forgotButtonText: {
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // --- Footer ---
  footerArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32, // Espacio entre la tarjeta y los links
  },
  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16, // Para no pegar a los bordes
  },
  footerLink: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  legalContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF50', // Línea blanca semi-transparente
    width: '100%',
  },
  legalText: {
    color: COLORS.white,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
});