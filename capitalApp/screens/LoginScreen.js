import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  Animated,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Ellipse } from 'react-native-svg';

// --- Colores de la App ---
const COLORS = {
  primaryBlue: '#004879',
  white: '#ffffff',
  darkText: '#1a1a1a',
  lightText: '#666666',
  borderGray: '#e0e0e0',
  inputBorder: '#d1d1d1',
  background: '#f8f9fa',
};

// Componente de decoración - Manchas orgánicas
const DecorativeBlobs = () => (
  <View style={styles.decorationsContainer}>
    {/* Mancha superior izquierda */}
    <Svg height="120" width="120" style={styles.blobTopLeft}>
      <Path
        d="M50,10 Q80,15 90,40 T85,80 Q60,95 30,80 T20,40 Q25,15 50,10"
        fill={COLORS.primaryBlue}
        opacity="0.15"
      />
    </Svg>

    {/* Mancha superior derecha (más grande) */}
    <Svg height="150" width="150" style={styles.blobTopRight}>
      <Path
        d="M75,10 Q120,20 130,60 T115,110 Q80,130 40,110 T25,60 Q35,20 75,10"
        fill={COLORS.primaryBlue}
        opacity="0.12"
      />
    </Svg>
  </View>
);

// Componente decorativo - Planta/Maceta
const PlantDecoration = () => (
  <Svg height="100" width="80" style={styles.plantContainer}>
    {/* Maceta */}
    <Path
      d="M20,70 L25,90 L55,90 L60,70 Z"
      fill={COLORS.primaryBlue}
      opacity="0.2"
    />
    {/* Plato de la maceta */}
    <Ellipse cx="40" cy="92" rx="22" ry="4" fill={COLORS.primaryBlue} opacity="0.15" />
    
    {/* Hojas */}
    <Path
      d="M40,70 Q30,50 25,35 Q30,40 40,45"
      fill={COLORS.primaryBlue}
      opacity="0.25"
    />
    <Path
      d="M40,70 Q50,45 55,30 Q50,35 40,42"
      fill={COLORS.primaryBlue}
      opacity="0.25"
    />
    <Path
      d="M40,70 Q35,55 32,40 Q35,45 40,50"
      fill={COLORS.primaryBlue}
      opacity="0.2"
    />
    
    {/* Tallo */}
    <Path
      d="M40,70 L40,40"
      stroke={COLORS.primaryBlue}
      strokeWidth="2"
      opacity="0.3"
    />
  </Svg>
);

export default function LoginScreen({ navigation }) {
  // --- Estados para el formulario ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Estados de validación y carga
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar email en tiempo real
  const handleEmailChange = (text) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  // Validar contraseña en tiempo real
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text && text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    // Resetear errores
    setEmailError('');
    setPasswordError('');

    // Validaciones
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Aquí conectar con tu backend
      // const response = await fetch('YOUR_API_URL/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // Simulación de llamada al backend (2 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Login attempt:', { email, password });

      // Si el login es exitoso, navegar al dashboard
      // TODO: Verificar la respuesta del backend antes de navegar
      // if (data.success) {
      //   navigation.replace('MainTabs');
      // }

      // Por ahora, simular login exitoso
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('MainTabs'),
        },
      ]);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implementar Google Sign In
      // Necesitarás instalar: expo-auth-session y expo-google-app-auth
      console.log('Google Sign In');
      Alert.alert('Info', 'Google Sign In will be implemented with backend');
    } catch (error) {
      console.error('Google Sign In error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navegar a pantalla de recuperación de contraseña
    Alert.alert(
      'Forgot Password',
      'Enter your email to receive reset instructions',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: () => console.log('Password reset for:', email),
        },
      ]
    );
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Decoraciones */}
          <DecorativeBlobs />
          <PlantDecoration />

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Texto de bienvenida */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Hello!</Text>
              <Text style={styles.welcomeSubtitle}>Welcome to Capital One</Text>
            </View>

            {/* Tarjeta de Login */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Login</Text>

              {/* Input de Email */}
              <View style={[styles.inputWrapper, emailFocused && styles.inputFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.lightText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.lightText}
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              {/* Input de Contraseña */}
              <View style={[styles.inputWrapper, passwordFocused && styles.inputFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.lightText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.lightText}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={COLORS.lightText}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Botón de Login */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.9}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Log In</Text>
                )}
              </TouchableOpacity>


              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have account? </Text>
                <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Hoja de Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },

  // Decoraciones
  decorationsContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 0,
  },
  blobTopLeft: {
    position: 'absolute',
    top: 0,
    left: -10,
  },
  blobTopRight: {
    position: 'absolute',
    top: 0,
    right: -10,
  },
  plantContainer: {
    position: 'absolute',
    top: 60,
    right: 30,
    zIndex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },

  // Welcome
  welcomeContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.lightText,
  },

  // Tarjeta de Formulario
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 24,
  },

  // Inputs
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: COLORS.background,
  },
  inputFocused: {
    borderColor: COLORS.primaryBlue,
    borderWidth: 2,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkText,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    padding: 4,
  },

  // Error text
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 16,
  },

  // Forgot Password
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: COLORS.primaryBlue,
    fontSize: 14,
    fontWeight: '500',
  },

  // Botón de Login
  loginButton: {
    backgroundColor: COLORS.primaryBlue,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.lightText,
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.lightText,
    fontSize: 14,
  },

  

  // Sign Up
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    color: COLORS.lightText,
    fontSize: 14,
  },
  signUpLink: {
    color: COLORS.primaryBlue,
    fontSize: 14,
    fontWeight: '700',
  },
});