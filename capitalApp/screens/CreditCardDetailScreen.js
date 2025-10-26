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
const CardHeader = ({ navigation, cardName }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{cardName}</Text>
    <TouchableOpacity>
      <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

// --- 2. Card Visual ---
const CreditCardVisual = ({ cardData }) => (
  <View style={styles.cardVisualContainer}>
    <View style={styles.creditCard}>
      <View style={styles.cardChip}>
        <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="#FFD700" />
      </View>
      
      <Text style={styles.cardNumber}>•••• •••• •••• {cardData.lastDigits}</Text>
      
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardLabel}>Titular</Text>
          <Text style={styles.cardInfo}>{cardData.holder}</Text>
        </View>
        <View>
          <Text style={styles.cardLabel}>Vence</Text>
          <Text style={styles.cardInfo}>{cardData.expires}</Text>
        </View>
      </View>
      
      <View style={styles.cardBrand}>
        <Text style={styles.cardBrandText}>{cardData.brand}</Text>
        <Text style={styles.cardType}>{cardData.type}</Text>
      </View>
    </View>
  </View>
);

// --- 3. Balance & Limit Card ---
const BalanceLimitCard = ({ balance, limit, available }) => {
  const usedPercentage = ((limit - available) / limit) * 100;
  
  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceRow}>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Saldo actual</Text>
          <Text style={styles.balanceAmount}>${balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.balanceDivider} />
        <View style={styles.balanceItem}>
          <Text style={styles.balanceLabel}>Crédito disponible</Text>
          <Text style={[styles.balanceAmount, { color: COLORS.successGreen }]}>
            ${available.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
      
      <View style={styles.creditLimitSection}>
        <View style={styles.creditLimitHeader}>
          <Text style={styles.creditLimitLabel}>Límite de crédito: ${limit.toLocaleString('es-MX')}</Text>
          <Text style={styles.creditLimitPercent}>{usedPercentage.toFixed(0)}% usado</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { 
            width: `${usedPercentage}%`,
            backgroundColor: usedPercentage > 80 ? COLORS.warningOrange : COLORS.accentBlue 
          }]} />
        </View>
      </View>
    </View>
  );
};

// --- 4. Payment Info ---
const PaymentInfo = ({ nextPayment, navigation }) => (
  <View style={styles.paymentCard}>
    <View style={styles.paymentHeader}>
      <Ionicons name="checkmark-circle" size={24} color={COLORS.successGreen} />
      <Text style={styles.paymentTitle}>Pago automático programado</Text>
    </View>
    <View style={styles.paymentDetails}>
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>Próximo pago</Text>
        <Text style={styles.paymentValue}>${nextPayment.amount.toLocaleString('es-MX')}</Text>
      </View>
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>Fecha de pago</Text>
        <Text style={styles.paymentValue}>{nextPayment.date}</Text>
      </View>
    </View>
    <TouchableOpacity 
      style={styles.paymentButton}
      onPress={() => navigation.navigate('MainTabs', { screen: 'Paga y transfiere' })}
    >
      <Text style={styles.paymentButtonText}>Hacer pago adicional</Text>
      <Ionicons name="arrow-forward" size={20} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

// --- 5. Rewards Section ---
const RewardsSection = ({ rewards, navigation }) => (
  <View style={styles.rewardsCard}>
    <View style={styles.rewardsHeader}>
      <Ionicons name="star" size={24} color="#FFD700" />
      <Text style={styles.rewardsTitle}>Recompensas disponibles</Text>
    </View>
    <Text style={styles.rewardsPoints}>{rewards.points.toLocaleString('es-MX')} puntos</Text>
    <Text style={styles.rewardsValue}>≈ ${rewards.cashValue.toLocaleString('es-MX')} en efectivo</Text>
    <TouchableOpacity 
      style={styles.rewardsButton}
      onPress={() => {
        Alert.alert(
          '¡Recompensas!',
          'Funcionalidad de canje de recompensas próximamente disponible. Podrás canjear por efectivo, millas o gift cards.',
          [{ text: 'Entendido', style: 'default' }]
        );
      }}
    >
      <Text style={styles.rewardsButtonText}>Canjear recompensas</Text>
    </TouchableOpacity>
  </View>
);

// --- 6. Transaction List ---
const TransactionList = ({ transactions, navigation }) => (
  <View style={styles.transactionsSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Compras recientes</Text>
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
  const isPending = transaction.status === 'Pendiente';
  
  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: transaction.color + '15' }]}>
        <MaterialCommunityIcons name={transaction.icon} size={24} color={transaction.color} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          ${transaction.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.transactionStatus, { color: isPending ? COLORS.warningOrange : COLORS.lightText }]}>
          {transaction.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- 7. Card Actions ---
const CardActions = () => (
  <View style={styles.actionsSection}>
    <Text style={styles.sectionTitle}>Gestión de tarjeta</Text>
    
    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="lock-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Bloquear/Congelar tarjeta</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="credit-card-settings-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Solicitar aumento de límite</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Configurar alertas</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="file-document-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Ver estado de cuenta</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>
      <View style={styles.actionLeft}>
        <MaterialCommunityIcons name="shield-check-outline" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.actionText}>Reportar robo o fraude</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
    </TouchableOpacity>
  </View>
);

// --- Main Component ---
export default function CreditCardDetailScreen({ route, navigation }) {
  // Datos de ejemplo - en producción vendrían de Supabase
  const cardData = {
    name: 'Freedom Student',
    lastDigits: '7081',
    holder: 'USUARIO CAPITAL ONE',
    expires: '12/28',
    brand: 'VISA',
    type: 'Freedom',
    balance: 0.00,
    limit: 3000.00,
    available: 3000.00,
    nextPayment: {
      amount: 0.00,
      date: 'Nov 20, 2025',
    },
    rewards: {
      points: 1250,
      cashValue: 12.50,
    },
    transactions: [
      {
        name: 'Amazon',
        date: 'Hoy, 2:45 PM',
        amount: 89.99,
        status: 'Pendiente',
        icon: 'amazon',
        color: '#FF9900',
      },
      {
        name: 'Uber Eats',
        date: 'Ayer, 8:30 PM',
        amount: 145.50,
        status: 'Completado',
        icon: 'food',
        color: '#00A86B',
      },
      {
        name: 'Netflix',
        date: '24 Oct, 2025',
        amount: 199.00,
        status: 'Completado',
        icon: 'netflix',
        color: '#E50914',
      },
      {
        name: 'Walmart',
        date: '22 Oct, 2025',
        amount: 320.75,
        status: 'Completado',
        icon: 'cart',
        color: '#0071CE',
      },
      {
        name: 'Starbucks',
        date: '20 Oct, 2025',
        amount: 95.00,
        status: 'Completado',
        icon: 'coffee',
        color: '#00704A',
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <CardHeader navigation={navigation} cardName={cardData.name} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <CreditCardVisual cardData={cardData} />
        <BalanceLimitCard 
          balance={cardData.balance} 
          limit={cardData.limit} 
          available={cardData.available} 
        />
        <PaymentInfo nextPayment={cardData.nextPayment} navigation={navigation} />
        <RewardsSection rewards={cardData.rewards} navigation={navigation} />
        <TransactionList transactions={cardData.transactions} navigation={navigation} />
        <CardActions />
        
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
  
  // Credit Card Visual
  cardVisualContainer: {
    padding: 16,
  },
  creditCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 16,
    padding: 24,
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardChip: {
    width: 50,
    height: 40,
    marginBottom: 20,
  },
  cardNumber: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardLabel: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 4,
  },
  cardInfo: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cardBrand: {
    position: 'absolute',
    top: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  cardBrandText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardType: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
  },
  
  // Balance Card
  balanceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: COLORS.borderGray,
    marginHorizontal: 16,
  },
  balanceLabel: {
    fontSize: 13,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  creditLimitSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  creditLimitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  creditLimitLabel: {
    fontSize: 14,
    color: COLORS.darkText,
  },
  creditLimitPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.borderGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Payment Info
  paymentCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  paymentDetails: {
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  paymentButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.accentBlue + '15',
    padding: 12,
    borderRadius: 8,
  },
  paymentButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  
  // Rewards
  rewardsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  rewardsPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 4,
  },
  rewardsValue: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 16,
  },
  rewardsButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  rewardsButtonText: {
    fontSize: 15,
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
    color: COLORS.darkText,
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
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
