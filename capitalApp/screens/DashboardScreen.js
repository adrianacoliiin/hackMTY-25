import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Colores de la App ---
const COLORS = {
  primaryBlue: '#004a77', // Azul principal (Chase/Capital One)
  lightGrayBg: '#f4f6f9', // Fondo de la pantalla
  white: '#ffffff',
  darkText: '#222222',
  lightText: '#555555',
  borderGray: '#e0e0e0',
  notificationGray: '#3f3f3f',
  chatBlue: '#0070c0',
  greenCheck: '#008000',
};

// --- 1. Cabecera Superior ---
const AppHeader = () => (
  <View style={styles.header}>
    <TouchableOpacity>
      <Feather name="menu" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
    {/* Usamos el logo de Capital One como en la imagen */}
    <Image
      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Capital_One_logo.svg/1280px-Capital_One_logo.svg.png' }}
      style={styles.logo}
      resizeMode="contain"
    />
    <TouchableOpacity>
      <Feather name="user" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

// --- 2. Banner de Notificación ---
const NotificationBanner = () => (
  <TouchableOpacity style={styles.notificationBanner}>
    <Ionicons name="information-circle" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.notificationText}>¿Te afectó el cierre del gobierno?</Text>
      <Text style={styles.notificationSubText}>Quizás podamos ayudar. Ver detalles</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
  </TouchableOpacity>
);

// --- 3. Barra de Búsqueda y Chat ---
const SearchAndChat = () => (
  <View style={styles.searchChatContainer}>
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />
      <TextInput
        placeholder="What are you looking for?"
        placeholderTextColor={COLORS.lightText}
        style={{ flex: 1 }}
      />
    </View>
    <TouchableOpacity style={styles.chatButton}>
      <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.white} />
    </TouchableOpacity>
  </View>
);

// --- 4. Acciones Rápidas ---
const QuickActions = () => (
  <View style={styles.quickActionsContainer}>
    <TouchableOpacity style={styles.actionItem}>
      <Ionicons name="add-circle" size={32} color={COLORS.chatBlue} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionItem}>
      <Text style={styles.actionText}>Enviar | Zelle®</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionItem}>
      <Text style={styles.actionText}>Deposita cheques</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionItem}>
      <Text style={styles.actionText}>Paga</Text>
    </TouchableOpacity>
  </View>
);

// --- 5. Tarjeta de Cuenta Bancaria ---
const AccountCard = () => (
  <TouchableOpacity style={styles.cardBlue}>
    <Text style={styles.cardTypeTitle}>Cuentas bancarias (1)</Text>
    <Text style={styles.cardAccountName}>CHASE COLLEGE (...3882) ›</Text>
    <Text style={styles.balanceBlue}>$1,500.10</Text>
    <Text style={styles.balanceLabelBlue}>Saldo disponible</Text>
  </TouchableOpacity>
);

// --- 6. Tarjeta de Crédito ---
const CreditCard = () => (
  <TouchableOpacity style={styles.cardWhite}>
    <Text style={styles.cardTypeTitleDark}>Tarjetas de crédito (1)</Text>
    <Text style={styles.cardAccountNameDark}>Freedom Student (...7081) ›</Text>
    
    {/* Miniatura de la tarjeta */}
    <View style={styles.miniCard}>
      <Text style={styles.miniCardText}>Freedom</Text>
      <Text style={styles.miniCardText}>VISA</Text>
    </View>

    <Text style={styles.balanceWhite}>$0.00</Text>
    <Text style={styles.balanceLabelWhite}>Saldo actual</Text>

    <View style={styles.paymentInfo}>
      <Ionicons name="checkmark-circle" size={20} color={COLORS.greenCheck} style={{ marginRight: 8 }} />
      <Text style={styles.paymentText}>
        Has programado tu pago automático para nov 20, 2025.
      </Text>
    </View>
  </TouchableOpacity>
);

// --- Componente Principal de la Pantalla ---
export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <AppHeader />
      
      {/* El ScrollView permite que el contenido del medio sea deslizable */}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NotificationBanner />
        <SearchAndChat />
        <QuickActions />

        {/* --- Sección de Cuentas --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cuentas</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.primaryBlue} />
          </TouchableOpacity>
        </View>

        <AccountCard />
        <CreditCard />

        {/* Espacio adicional para evitar que el último elemento quede bajo el tab bar */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Hoja de Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white, // Fondo blanco para el header y tabs
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrayBg, // Fondo gris claro para el contenido
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  logo: {
    width: 150,
    height: 25,
  },
  // Notification
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.notificationGray,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  notificationText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  notificationSubText: {
    color: COLORS.white,
    fontSize: 12,
  },
  // Search & Chat
  searchChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  chatButton: {
    backgroundColor: COLORS.chatBlue,
    borderRadius: 25,
    padding: 10,
    marginLeft: 12,
  },
  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.chatBlue,
    fontWeight: '500',
    fontSize: 13,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  // Card (Blue)
  cardBlue: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTypeTitle: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 8,
  },
  cardAccountName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceBlue: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  balanceLabelBlue: {
    color: COLORS.white,
    fontSize: 14,
  },
  // Card (White)
  cardWhite: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  cardTypeTitleDark: {
    color: COLORS.darkText,
    fontSize: 14,
    marginBottom: 8,
  },
  cardAccountNameDark: {
    color: COLORS.darkText,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  miniCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 6,
    padding: 10,
    height: 50,
    width: 80,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  miniCardText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  balanceWhite: {
    color: COLORS.darkText,
    fontSize: 28,
    fontWeight: 'bold',
  },
  balanceLabelWhite: {
    color: COLORS.lightText,
    fontSize: 14,
    marginBottom: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    paddingTop: 16,
  },
  paymentText: {
    flex: 1,
    color: COLORS.darkText,
    fontSize: 13,
  },
  scrollContent: {
    paddingBottom: 16,
  },
});