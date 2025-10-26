/**
 * EJEMPLOS DE USO - Validaciones y Auth Service
 * 
 * Este archivo contiene ejemplos de cómo usar las utilidades
 * de validación y autenticación en diferentes partes de la app.
 */

// ============================================
// EJEMPLO 1: Validar un formulario de perfil
// ============================================

import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { validateEmail, validatePhone, validateName } from '../utils/validation';

const ProfileForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};

    // Validar nombre
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    // Validar email
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validar teléfono
    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Formulario válido, proceder
      Alert.alert('Success', 'Profile updated!');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      {errors.phone && <Text style={{ color: 'red' }}>{errors.phone}</Text>}

      <Button title="Update Profile" onPress={handleSubmit} />
    </View>
  );
};

// ============================================
// EJEMPLO 2: Validar tarjeta de crédito
// ============================================

import { 
  validateCreditCard, 
  validateCVV, 
  validateExpiryDate,
  formatCardNumber 
} from '../utils/validation';

const AddCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleAddCard = () => {
    // Validar número de tarjeta
    if (!validateCreditCard(cardNumber)) {
      Alert.alert('Error', 'Invalid card number');
      return;
    }

    // Validar CVV
    if (!validateCVV(cvv)) {
      Alert.alert('Error', 'Invalid CVV');
      return;
    }

    // Validar fecha de expiración
    const expiryValidation = validateExpiryDate(expiry);
    if (!expiryValidation.isValid) {
      Alert.alert('Error', expiryValidation.message);
      return;
    }

    // Tarjeta válida
    console.log('Card added successfully');
  };

  const handleCardNumberChange = (text) => {
    // Formatear automáticamente mientras escribe
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  return (
    <View>
      <TextInput
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        maxLength={19} // 16 dígitos + 3 espacios
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        maxLength={4}
        keyboardType="number-pad"
        secureTextEntry
      />
      <TextInput
        placeholder="MM/YY"
        value={expiry}
        onChangeText={setExpiry}
        maxLength={5}
        keyboardType="number-pad"
      />
      <Button title="Add Card" onPress={handleAddCard} />
    </View>
  );
};

// ============================================
// EJEMPLO 3: Transferencia bancaria con validación
// ============================================

import { validateCLABE, validateAmount, formatCurrency } from '../utils/validation';

const TransferScreen = () => {
  const [clabe, setClabe] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    // Validar CLABE
    if (!validateCLABE(clabe)) {
      Alert.alert('Error', 'Invalid CLABE (must be 18 digits)');
      return;
    }

    // Validar monto
    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      Alert.alert('Error', amountValidation.message);
      return;
    }

    // Confirmar transferencia
    Alert.alert(
      'Confirm Transfer',
      `Transfer ${formatCurrency(amount)} to account ${clabe}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Proceder con la transferencia
            console.log('Transfer initiated');
          },
        },
      ]
    );
  };

  return (
    <View>
      <TextInput
        placeholder="CLABE (18 digits)"
        value={clabe}
        onChangeText={setClabe}
        maxLength={18}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      <Button title="Transfer" onPress={handleTransfer} />
    </View>
  );
};

// ============================================
// EJEMPLO 4: Login con Auth Service
// ============================================

import { loginUser, getCurrentUser } from '../services/authService';

const CustomLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si ya hay sesión activa
    checkSession();
  }, []);

  const checkSession = async () => {
    const user = await getCurrentUser();
    if (user) {
      // Usuario ya está logueado, ir al dashboard
      navigation.replace('MainTabs');
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      
      // Guardar token en AsyncStorage si es necesario
      // await AsyncStorage.setItem('userToken', result.session.access_token);
      
      // Navegar al dashboard
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Loading...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

// ============================================
// EJEMPLO 5: Logout
// ============================================

import { logoutUser } from '../services/authService';

const SettingsScreen = ({ navigation }) => {
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              // Limpiar AsyncStorage
              // await AsyncStorage.clear();
              // Navegar al login
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

// ============================================
// EJEMPLO 6: Forgot Password
// ============================================

import { resetPassword } from '../services/authService';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Email Sent',
        'Check your email for password reset instructions',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Enter your email to reset password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button
        title={loading ? 'Sending...' : 'Reset Password'}
        onPress={handleResetPassword}
        disabled={loading}
      />
    </View>
  );
};

// ============================================
// EJEMPLO 7: Validación en tiempo real con debounce
// ============================================

import { useEffect } from 'react';

const EmailInputWithValidation = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Debounce: esperar 500ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(() => {
      if (email) {
        setIsValidating(true);
        const isValid = validateEmail(email);
        setEmailError(isValid ? '' : 'Invalid email format');
        setIsValidating(false);
      } else {
        setEmailError('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email]);

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {isValidating && <Text>Validating...</Text>}
      {emailError && <Text style={{ color: 'red' }}>{emailError}</Text>}
      {email && !emailError && !isValidating && (
        <Text style={{ color: 'green' }}>✓ Valid email</Text>
      )}
    </View>
  );
};

// ============================================
// EJEMPLO 8: Formatear montos mientras escribes
// ============================================

import { formatCurrency } from '../utils/validation';

const AmountInput = () => {
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');

  const handleAmountChange = (text) => {
    // Remover todo excepto números y punto decimal
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Permitir solo un punto decimal
    const parts = cleanedText.split('.');
    const formatted = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : cleanedText;
    
    setAmount(formatted);
    
    // Mostrar versión formateada
    if (formatted) {
      setDisplayAmount(formatCurrency(formatted));
    } else {
      setDisplayAmount('');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter amount"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="decimal-pad"
      />
      <Text>You'll transfer: {displayAmount}</Text>
    </View>
  );
};

// ============================================
// EJEMPLO 9: Validación de contraseña con indicador de fuerza
// ============================================

import { validatePassword } from '../utils/validation';

const PasswordInputWithStrength = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(null);

  const handlePasswordChange = (text) => {
    setPassword(text);
    
    if (text) {
      const validation = validatePassword(text);
      
      // Calcular fuerza
      let strengthLevel = 0;
      if (text.length >= 8) strengthLevel++;
      if (/[A-Z]/.test(text)) strengthLevel++;
      if (/[a-z]/.test(text)) strengthLevel++;
      if (/\d/.test(text)) strengthLevel++;
      if (/[^A-Za-z0-9]/.test(text)) strengthLevel++; // Caracteres especiales
      
      setStrength({
        isValid: validation.isValid,
        message: validation.message,
        level: strengthLevel,
      });
    } else {
      setStrength(null);
    }
  };

  const getStrengthColor = () => {
    if (!strength) return 'gray';
    if (strength.level <= 2) return 'red';
    if (strength.level === 3) return 'orange';
    if (strength.level === 4) return 'yellowgreen';
    return 'green';
  };

  const getStrengthText = () => {
    if (!strength) return '';
    if (strength.level <= 2) return 'Weak';
    if (strength.level === 3) return 'Medium';
    if (strength.level === 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <View>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      {strength && (
        <View>
          <View style={{ 
            height: 4, 
            width: '100%', 
            backgroundColor: '#e0e0e0',
            borderRadius: 2,
            marginTop: 8,
          }}>
            <View style={{
              height: '100%',
              width: `${(strength.level / 5) * 100}%`,
              backgroundColor: getStrengthColor(),
              borderRadius: 2,
            }} />
          </View>
          <Text style={{ color: getStrengthColor(), fontSize: 12, marginTop: 4 }}>
            {getStrengthText()}
          </Text>
          {!strength.isValid && (
            <Text style={{ color: 'red', fontSize: 12 }}>
              {strength.message}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// ============================================
// EJEMPLO 10: Proteger rutas con autenticación
// ============================================

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';

const ProtectedScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      // No hay usuario logueado, redirigir al login
      navigation.replace('Login');
    } else {
      setUser(currentUser);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Text>Welcome, {user.email}!</Text>
      {/* Contenido protegido */}
    </View>
  );
};

export {
  ProfileForm,
  AddCardForm,
  TransferScreen,
  CustomLoginScreen,
  SettingsScreen,
  ForgotPasswordScreen,
  EmailInputWithValidation,
  AmountInput,
  PasswordInputWithStrength,
  ProtectedScreen,
};
