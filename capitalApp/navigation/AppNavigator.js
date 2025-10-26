import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TabNavigator from './TabNavigator';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import IdentityVerificationScreen from '../screens/IdentityVerificationScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import CreatePinScreen from '../screens/CreatePinScreen';
import AccountDetailScreen from '../screens/AccountDetailScreen';
import CreditCardDetailScreen from '../screens/CreditCardDetailScreen';
import SupportChatScreen from '../screens/SupportChatScreen';
import TransactionSearchScreen from '../screens/TransactionSearchScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      {/* Pantalla inicial */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Pantalla de inicio de sesión */}
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* Pantalla de registro */}
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Proceso de registro paso a paso */}
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
      <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} />
      <Stack.Screen name="CreatePin" component={CreatePinScreen} />

      {/* Dashboard con tabs (pantalla principal después del login) */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Detalles de cuenta */}
      <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
      
      {/* Detalles de tarjeta de crédito */}
      <Stack.Screen name="CreditCardDetail" component={CreditCardDetailScreen} />
      
      {/* Chat de soporte */}
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />
      
      {/* Búsqueda de transacciones */}
      <Stack.Screen name="TransactionSearch" component={TransactionSearchScreen} />
    </Stack.Navigator>
  );
}
