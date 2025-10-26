import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primaryBlue: '#004a77',
  lightGrayBg: '#f4f6f9',
  white: '#ffffff',
  darkText: '#222222',
  lightText: '#666666',
  borderGray: '#e0e0e0',
};

export default function PlanMonitoring() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Planifica y Monitorea</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="stats-chart-outline" size={80} color={COLORS.primaryBlue} />
          <Text style={styles.emptyTitle}>Planificación próximamente</Text>
          <Text style={styles.emptySubtitle}>
            Aquí podrás ver tus metas de ahorro, préstamos y suscripciones
          </Text>
          
          <View style={styles.featureList}>
            <FeatureItem icon="flag" text="Metas de ahorro" />
            <FeatureItem icon="cash" text="Préstamos activos" />
            <FeatureItem icon="calendar" text="Suscripciones" />
            <FeatureItem icon="trending-up" text="Inversiones" />
            <FeatureItem icon="wallet" text="Presupuestos" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color={COLORS.primaryBlue} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrayBg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 32,
  },
  featureList: {
    width: '100%',
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.darkText,
    marginLeft: 16,
    fontWeight: '500',
  },
});
