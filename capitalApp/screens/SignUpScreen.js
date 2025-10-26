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
  ScrollView,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

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

export default function SignUpScreen({ navigation }) {
  const [step, setStep] = useState(1);
  
  // Paso 1
  const [name, setName] = useState('');
  const [surnames, setSurnames] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Paso 2
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Focus states
  const [focusedField, setFocusedField] = useState(null);

  // Estados de validación
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validaciones
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Al menos 8 caracteres, una mayúscula, una minúscula, un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    // Formato: 10 dígitos
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateAge = (birthDate) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  // Validar campos del paso 1
  const validateStep1 = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!surnames.trim()) {
      newErrors.surnames = 'Surnames are required';
    } else if (surnames.trim().length < 2) {
      newErrors.surnames = 'Surnames must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be 8+ chars, with uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar campos del paso 2
  const validateStep2 = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!validateAge(dateOfBirth)) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (!selectedImage) {
      newErrors.image = 'ID photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      setErrors({});
    } else {
      Alert.alert('Validation Error', 'Please correct the errors before continuing');
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
    setErrors({});
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to upload your ID');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      // Limpiar error de imagen
      const newErrors = { ...errors };
      delete newErrors.image;
      setErrors(newErrors);
    }
  };

  const handleSignUp = async () => {
    if (!validateStep2()) {
      Alert.alert('Validation Error', 'Please correct the errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Preparar datos para enviar al backend
      const userData = {
        name: name.trim(),
        surnames: surnames.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        phone: phone.replace(/\s/g, ''),
        dateOfBirth: dateOfBirth.toISOString(),
        address: address.trim(),
        idPhoto: selectedImage, // Este será un URI local, necesitarás subirlo como FormData
      };

      console.log('Sign up data:', userData);

      // TODO: Subir imagen primero
      // const formData = new FormData();
      // formData.append('idPhoto', {
      //   uri: selectedImage,
      //   type: 'image/jpeg',
      //   name: 'id-photo.jpg',
      // });
      
      // TODO: Llamada al backend
      // const response = await fetch('YOUR_API_URL/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();

      // Simulación de llamada al backend
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Si el registro es exitoso
      Alert.alert(
        'Success!',
        'Your account has been created successfully. Please verify your email.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      // Validar edad
      if (!validateAge(selectedDate)) {
        setErrors({ ...errors, dateOfBirth: 'You must be at least 18 years old' });
      } else {
        const newErrors = { ...errors };
        delete newErrors.dateOfBirth;
        setErrors(newErrors);
      }
    }
  };

  // Limpiar errores al cambiar valores
  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
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

          {/* Header con botón de regreso */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryBlue} />
            <Text style={styles.backText}>Back to login</Text>
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.title}>Sign Up</Text>
          
          {/* Indicador de pasos */}
          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, step === 1 && styles.stepDotActive]} />
            <View style={[styles.stepDot, step === 2 && styles.stepDotActive]} />
          </View>

          {/* Tarjeta de formulario */}
          <View style={styles.formCard}>
            {step === 1 ? (
              // PASO 1
              <>
                <InputField
                  icon="person-outline"
                  placeholder="Name"
                  value={name}
                  onChangeText={(text) => handleFieldChange('name', text, setName)}
                  focused={focusedField === 'name'}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.name}
                  editable={!isLoading}
                />

                <InputField
                  icon="people-outline"
                  placeholder="Surnames"
                  value={surnames}
                  onChangeText={(text) => handleFieldChange('surnames', text, setSurnames)}
                  focused={focusedField === 'surnames'}
                  onFocus={() => setFocusedField('surnames')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.surnames}
                  editable={!isLoading}
                />

                <InputField
                  icon="mail-outline"
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => handleFieldChange('email', text, setEmail)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  focused={focusedField === 'email'}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.email}
                  editable={!isLoading}
                />

                <InputField
                  icon="lock-closed-outline"
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => handleFieldChange('password', text, setPassword)}
                  secureTextEntry={!showPassword}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={COLORS.lightText}
                      />
                    </TouchableOpacity>
                  }
                  focused={focusedField === 'password'}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.password}
                  editable={!isLoading}
                />

                <InputField
                  icon="lock-closed-outline"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => handleFieldChange('confirmPassword', text, setConfirmPassword)}
                  secureTextEntry={!showConfirmPassword}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={COLORS.lightText}
                      />
                    </TouchableOpacity>
                  }
                  focused={focusedField === 'confirmPassword'}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.confirmPassword}
                  editable={!isLoading}
                />

                <TouchableOpacity
                  style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
                  onPress={handleNextStep}
                  activeOpacity={0.9}
                  disabled={isLoading}
                >
                  <Text style={styles.signUpButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            ) : (
              // PASO 2
              <>
                <InputField
                  icon="call-outline"
                  placeholder="Phone (10 digits)"
                  value={phone}
                  onChangeText={(text) => handleFieldChange('phone', text, setPhone)}
                  keyboardType="phone-pad"
                  focused={focusedField === 'phone'}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.phone}
                  editable={!isLoading}
                />

                <TouchableOpacity
                  style={[styles.inputWrapper, focusedField === 'date' && styles.inputFocused]}
                  onPress={() => !isLoading && setShowDatePicker(true)}
                  disabled={isLoading}
                >
                  <Ionicons name="calendar-outline" size={20} color={COLORS.lightText} style={styles.inputIcon} />
                  <Text style={styles.dateText}>
                    {dateOfBirth.toLocaleDateString('es-MX')}
                  </Text>
                </TouchableOpacity>
                {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}

                {showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                )}

                <InputField
                  icon="location-outline"
                  placeholder="Complete Address"
                  value={address}
                  onChangeText={(text) => handleFieldChange('address', text, setAddress)}
                  multiline
                  focused={focusedField === 'address'}
                  onFocus={() => setFocusedField('address')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.address}
                  editable={!isLoading}
                />

                {/* Selector de imagen */}
                <TouchableOpacity 
                  style={styles.imagePickerButton} 
                  onPress={pickImage}
                  disabled={isLoading}
                >
                  <Ionicons name="image-outline" size={24} color={COLORS.primaryBlue} />
                  <Text style={styles.imagePickerText}>
                    {selectedImage ? 'Image selected ✓' : 'Upload ID Photo (PNG/JPG)'}
                  </Text>
                </TouchableOpacity>
                {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}

                {selectedImage && (
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.backStepButton, isLoading && styles.buttonDisabled]}
                    onPress={handlePreviousStep}
                    activeOpacity={0.9}
                    disabled={isLoading}
                  >
                    <Text style={styles.backStepButtonText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
                    onPress={handleSignUp}
                    activeOpacity={0.9}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <Text style={styles.signUpButtonText}>Sign Up</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Componente reutilizable para inputs
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  rightIcon,
  focused,
  onFocus,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'words',
  multiline = false,
  error,
  editable = true,
}) => (
  <>
    <View style={[styles.inputWrapper, focused && styles.inputFocused]}>
      <Ionicons name={icon} size={20} color={COLORS.lightText} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.lightText}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        editable={editable}
      />
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </>
);

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

  // Header
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
    zIndex: 2,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.primaryBlue,
    fontWeight: '500',
  },
  
  // Título
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 16,
    zIndex: 2,
  },

  // Indicador de pasos
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
    zIndex: 2,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.borderGray,
  },
  stepDotActive: {
    backgroundColor: COLORS.primaryBlue,
    width: 24,
  },

  // Tarjeta
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 2,
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
    minHeight: 56,
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
    paddingVertical: 16,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'center',
    paddingTop: 16,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkText,
    paddingVertical: 16,
  },

  // Error text
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 16,
  },

  // Image Picker
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    borderRadius: 12,
    borderStyle: 'dashed',
    paddingVertical: 16,
    marginBottom: 16,
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.primaryBlue,
    fontWeight: '500',
  },
  selectedImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },

  // Botones
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  signUpButton: {
    flex: 1,
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
  signUpButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  backStepButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backStepButtonText: {
    color: COLORS.primaryBlue,
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
