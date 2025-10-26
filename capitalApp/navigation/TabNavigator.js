import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import Benefits from '../screens/Benefits';
import Profile from '../screens/Profile';
import PlanMonitoring from '../screens/PlanMonitoring';

// Pantalla temporal para "Paga y transfiere"
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  primaryBlue: '#004a77',
  lightText: '#666666',
  white: '#ffffff',
  borderGray: '#e0e0e0',
};

// Pantalla temporal para "Paga y transfiere"
function PayAndTransferScreen() {
  return (
    <View style={styles.tempScreen}>
      <Ionicons name="swap-horizontal" size={64} color={COLORS.primaryBlue} />
      <Text style={styles.tempTitle}>Paga y transfiere</Text>
      <Text style={styles.tempSubtitle}>Esta pantalla estará disponible próximamente</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryBlue,
        tabBarInactiveTintColor: COLORS.lightText,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderGray,
          paddingVertical: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 5,
        },
      }}
    >
      {/* Tab 1: Cuentas (Dashboard) */}
      <Tab.Screen
        name="Cuentas"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 2: Paga y transfiere */}
      <Tab.Screen
        name="Paga y transfiere"
        component={PayAndTransferScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal" size={size} color={color} />
          ),
          tabBarLabel: 'Paga y transfiere',
        }}
      />

      {/* Tab 3: Planifica */}
      <Tab.Screen
        name="Planifica"
        component={PlanMonitoring}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 4: Beneficios */}
      <Tab.Screen
        name="Beneficios"
        component={Benefits}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 5: Más */}
      <Tab.Screen
        name="Más"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tempScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 24,
  },
  tempTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginTop: 16,
    marginBottom: 8,
  },
  tempSubtitle: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: 'center',
  },
});
