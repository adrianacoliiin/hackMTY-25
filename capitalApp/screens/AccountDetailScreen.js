import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primaryBlue: '#004a77',
  lightGrayBg: '#f4f6f9',
  white: '#ffffff',
  darkText: '#222222',
  lightText: '#666666',
  borderGray: '#e0e0e0',
  successGreen: '#00a86b',
  warningOrange: '#ff8c00',
  accentBlue: '#0070c0',
};

// --- 1. Header Component ---
const AccountHeader = ({ navigation, accountName }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{accountName}</Text>
    <TouchableOpacity>
      <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

// --- 2. Balance Card ---
const BalanceCard = ({ balance, accountNumber, navigation }) => (
  <View style={styles.balanceCard}>
    <Text style={styles.balanceLabel}>Saldo disponible</Text>
    <Text style={styles.balanceAmount}>${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
    <Text style={styles.accountNumber}>Cuenta terminada en {accountNumber}</Text>
    
    <View style={styles.balanceActions}>
      <TouchableOpacity 
        style={styles.balanceButton}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Paga y transfiere' })}
      >
        <Ionicons name="swap-horizontal" size={20} color={COLORS.white} />
        <Text style={styles.balanceButtonText}>Transferir</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.balanceButton, styles.balanceButtonSecondary]}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Paga y transfiere' })}
      >
        <Ionicons name="add-circle-outline" size={20} color={COLORS.primaryBlue} />
        <Text style={[styles.balanceButtonText, styles.balanceButtonTextSecondary]}>Depositar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- 3. Quick Stats ---
const QuickStats = ({ stats }) => (
  <View style={styles.statsContainer}>
    <View style={styles.statItem}>
      <Ionicons name="trending-up" size={24} color={COLORS.successGreen} />
      <Text style={styles.statLabel}>Ingresos del mes</Text>
      <Text style={styles.statValue}>${stats.income.toLocaleString('es-MX')}</Text>
    </View>
    <View style={styles.statDivider} />
    <View style={styles.statItem}>
      <Ionicons name="trending-down" size={24} color={COLORS.warningOrange} />
      <Text style={styles.statLabel}>Gastos del mes</Text>
      <Text style={styles.statValue}>${stats.expenses.toLocaleString('es-MX')}</Text>
    </View>
  </View>
);

// --- 4. Transaction List ---
const TransactionList = ({ transactions, navigation }) => (
  <View style={styles.transactionsSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Transacciones recientes</Text>
      <TouchableOpacity onPress={() => navigation.navigate('TransactionSearch')}>
        <Text style={styles.seeAllText}>Ver todas</Text>
      </TouchableOpacity>
    </View>
    
    {transactions.map((transaction, index) => (
      <TransactionItem key={index} transaction={transaction} />
    ))}
  </View>
);

const TransactionItem = ({ transaction }) => {
  const isIncoming = transaction.type === 'incoming';
  const iconName = transaction.icon || (isIncoming ? 'arrow-down-circle' : 'arrow-up-circle');
  const iconColor = isIncoming ? COLORS.successGreen : COLORS.warningOrange;
  
  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: isIncoming ? COLORS.successGreen : COLORS.darkText }]}>
          {isIncoming ? '+' : '-'}${transaction.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.transactionStatus}>{transaction.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- 5. Account Actions ---
const AccountActions = () => (
  <View style={styles.actionsSection}>
    <Text style={styles.sectionTitle}>Acciones de cuenta</Text>
    
    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="file-document-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Estado de cuenta</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="shield-check-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Configurar alertas</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="lock-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Bloquear/Desbloquear</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Detalles de cuenta</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>
  </View>
);

// --- Main Component ---
export default function AccountDetailScreen({ route, navigation }) {
  // Datos de ejemplo - en producción vendrían de Supabase
  const accountData = {
    name: 'CAPITAL ONE COLLEGE',
    number: '3882',
    balance: 1500.10,
    stats: {
      income: 2500.00,
      expenses: 1200.50,
    },
    transactions: [
      {
        name: 'Netflix',
        date: 'Hoy, 10:30 AM',
        amount: 199.00,
        type: 'outgoing',
        status: 'Completado',
        icon: 'film-outline',
      },
      {
        name: 'Depósito directo',
        date: 'Ayer, 3:15 PM',
        amount: 2500.00,
        type: 'incoming',
        status: 'Completado',
        icon: 'briefcase-outline',
      },
      {
        name: 'Walmart',
        date: '24 Oct, 2025',
        amount: 450.75,
        type: 'outgoing',
        status: 'Completado',
        icon: 'cart-outline',
      },
      {
        name: 'Spotify',
        date: '20 Oct, 2025',
        amount: 115.00,
        type: 'outgoing',
        status: 'Completado',
        icon: 'musical-notes-outline',
      },
      {
        name: 'Starbucks',
        date: '18 Oct, 2025',
        amount: 85.50,
        type: 'outgoing',
        status: 'Completado',
        icon: 'cafe-outline',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <AccountHeader navigation={navigation} accountName={accountData.name} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <BalanceCard balance={accountData.balance} accountNumber={accountData.number} navigation={navigation} />
        <QuickStats stats={accountData.stats} />
        <TransactionList transactions={accountData.transactions} navigation={navigation} />
        <AccountActions />
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrayBg,
  },
  
  // Balance Card
  balanceCard: {
    backgroundColor: COLORS.primaryBlue,
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  accountNumber: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  balanceButtonSecondary: {
    backgroundColor: COLORS.white,
  },
  balanceButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  balanceButtonTextSecondary: {
    color: COLORS.primaryBlue,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.borderGray,
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  
  // Transactions
  transactionsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.accentBlue,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  
  // Actions
  actionsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    color: COLORS.darkText,
    fontWeight: '500',
  },
});
