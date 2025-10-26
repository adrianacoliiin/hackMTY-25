import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Colores de la App ---
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

// --- 1. Header ---
const PayHeader = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Paga y transfiere</Text>
    <TouchableOpacity>
      <Ionicons name="notifications-outline" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

// --- 2. Balance Card (desde donde pagarás) ---
const BalanceCard = ({ selectedAccount, onPress }) => (
  <TouchableOpacity style={styles.balanceCard} onPress={onPress}>
    <View style={styles.balanceHeader}>
      <Text style={styles.balanceLabel}>Pagar desde</Text>
      <Ionicons name="chevron-down" size={20} color={COLORS.white} />
    </View>
    <Text style={styles.accountName}>{selectedAccount.name}</Text>
    <Text style={styles.accountNumber}>...{selectedAccount.number}</Text>
    <View style={styles.balanceRow}>
      <Text style={styles.balanceAmount}>${selectedAccount.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
      <Text style={styles.balanceSubtext}>Disponible</Text>
    </View>
  </TouchableOpacity>
);

// --- 3. Quick Actions (Acciones Rápidas) ---
const QuickActions = ({ onActionPress }) => (
  <View style={styles.quickActionsContainer}>
    <Text style={styles.sectionTitle}>Acciones rápidas</Text>
    <View style={styles.actionsGrid}>
      <ActionButton
        icon="swap-horizontal"
        label="Transferir"
        color={COLORS.accentBlue}
        onPress={() => onActionPress('transfer')}
      />
      <ActionButton
        icon="card-outline"
        label="Pagar tarjeta"
        color={COLORS.successGreen}
        onPress={() => onActionPress('payCard')}
      />
      <ActionButton
        icon="cash-outline"
        label="Pagar préstamo"
        color={COLORS.warningOrange}
        onPress={() => onActionPress('payLoan')}
      />
      <ActionButton
        icon="people-outline"
        label="Enviar a contacto"
        color={COLORS.primaryBlue}
        onPress={() => onActionPress('sendContact')}
      />
    </View>
  </View>
);

const ActionButton = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={[styles.actionIconContainer, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

// --- 4. Recent Transactions ---
const RecentTransactions = ({ transactions }) => (
  <View style={styles.transactionsContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Actividad reciente</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllText}>Ver todo</Text>
      </TouchableOpacity>
    </View>
    {transactions.map((transaction, index) => (
      <TransactionItem key={index} transaction={transaction} />
    ))}
  </View>
);

const TransactionItem = ({ transaction }) => {
  const isIncoming = transaction.type === 'incoming';
  const iconName = isIncoming ? 'arrow-down-circle' : 'arrow-up-circle';
  const iconColor = isIncoming ? COLORS.successGreen : COLORS.warningOrange;
  
  return (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={[styles.transactionAmount, { color: isIncoming ? COLORS.successGreen : COLORS.darkText }]}>
          {isIncoming ? '+' : '-'}${transaction.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.transactionStatus}>{transaction.status}</Text>
      </View>
    </View>
  );
};

// --- 5. Scheduled Payments (Pagos Programados) ---
const ScheduledPayments = ({ payments }) => (
  <View style={styles.scheduledContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Pagos programados</Text>
      <TouchableOpacity>
        <Ionicons name="add-circle-outline" size={24} color={COLORS.primaryBlue} />
      </TouchableOpacity>
    </View>
    {payments.length === 0 ? (
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={48} color={COLORS.lightText} />
        <Text style={styles.emptyText}>No tienes pagos programados</Text>
        <TouchableOpacity style={styles.emptyButton}>
          <Text style={styles.emptyButtonText}>Programar pago</Text>
        </TouchableOpacity>
      </View>
    ) : (
      payments.map((payment, index) => (
        <ScheduledPaymentItem key={index} payment={payment} />
      ))
    )}
  </View>
);

const ScheduledPaymentItem = ({ payment }) => (
  <View style={styles.scheduledItem}>
    <View style={styles.scheduledLeft}>
      <MaterialCommunityIcons name={payment.icon} size={24} color={COLORS.primaryBlue} />
      <View style={styles.scheduledDetails}>
        <Text style={styles.scheduledName}>{payment.name}</Text>
        <Text style={styles.scheduledDate}>Próximo: {payment.nextDate}</Text>
      </View>
    </View>
    <View style={styles.scheduledRight}>
      <Text style={styles.scheduledAmount}>${payment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</Text>
      <View style={[styles.scheduledBadge, { backgroundColor: payment.active ? COLORS.successGreen + '15' : COLORS.borderGray }]}>
        <Text style={[styles.scheduledBadgeText, { color: payment.active ? COLORS.successGreen : COLORS.lightText }]}>
          {payment.active ? 'Activo' : 'Pausado'}
        </Text>
      </View>
    </View>
  </View>
);

// --- 6. Modal de Transferencia ---
const TransferModal = ({ visible, onClose, accounts, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [concept, setConcept] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleTransfer = () => {
    if (!amount || !recipient || !selectedAccount) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const transferData = {
      amount: parseFloat(amount),
      recipient,
      concept,
      fromAccount: selectedAccount,
    };

    onSubmit(transferData);
    // Reset form
    setAmount('');
    setRecipient('');
    setConcept('');
    setSelectedAccount(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva transferencia</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Monto */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monto *</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            {/* Destinatario */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Destinatario *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre o cuenta"
                value={recipient}
                onChangeText={setRecipient}
              />
            </View>

            {/* Concepto */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Concepto (opcional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Descripción del pago"
                value={concept}
                onChangeText={setConcept}
                multiline
              />
            </View>

            {/* Cuenta de origen */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Desde cuenta *</Text>
              {accounts.map((account, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.accountOption,
                    selectedAccount?.id === account.id && styles.accountOptionSelected
                  ]}
                  onPress={() => setSelectedAccount(account)}
                >
                  <View style={styles.accountOptionLeft}>
                    <Ionicons 
                      name={selectedAccount?.id === account.id ? 'radio-button-on' : 'radio-button-off'} 
                      size={24} 
                      color={COLORS.primaryBlue} 
                    />
                    <View style={styles.accountOptionDetails}>
                      <Text style={styles.accountOptionName}>{account.name}</Text>
                      <Text style={styles.accountOptionNumber}>...{account.number}</Text>
                    </View>
                  </View>
                  <Text style={styles.accountOptionBalance}>
                    ${account.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleTransfer}>
              <Text style={styles.confirmButtonText}>Transferir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- Componente Principal ---
export default function PayAndTransferScreen() {
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  
  // Mock data - será reemplazado por datos reales de Supabase
  const [selectedAccount] = useState({
    id: '1',
    name: 'CHASE COLLEGE',
    number: '3882',
    balance: 1500.10,
  });

  const accounts = [
    { id: '1', name: 'CHASE COLLEGE', number: '3882', balance: 1500.10 },
    { id: '2', name: 'Cuenta de Ahorro', number: '5621', balance: 5000.00 },
  ];

  const recentTransactions = [
    { name: 'Netflix', date: 'Hoy, 10:30 AM', amount: 199.00, type: 'outgoing', status: 'Completado' },
    { name: 'Transferencia recibida', date: 'Ayer, 3:45 PM', amount: 500.00, type: 'incoming', status: 'Completado' },
    { name: 'Amazon', date: '23 Oct', amount: 1250.50, type: 'outgoing', status: 'Completado' },
    { name: 'Pago de nómina', date: '20 Oct', amount: 8000.00, type: 'incoming', status: 'Completado' },
  ];

  const scheduledPayments = [
    { 
      name: 'Tarjeta Freedom', 
      nextDate: '20 Nov 2025', 
      amount: 500.00, 
      active: true,
      icon: 'credit-card'
    },
    { 
      name: 'Netflix', 
      nextDate: '25 Nov 2025', 
      amount: 199.00, 
      active: true,
      icon: 'netflix'
    },
  ];

  const handleActionPress = (action) => {
    switch (action) {
      case 'transfer':
        setTransferModalVisible(true);
        break;
      case 'payCard':
        Alert.alert('Pagar tarjeta', 'Funcionalidad próximamente');
        break;
      case 'payLoan':
        Alert.alert('Pagar préstamo', 'Funcionalidad próximamente');
        break;
      case 'sendContact':
        Alert.alert('Enviar a contacto', 'Funcionalidad próximamente');
        break;
    }
  };

  const handleTransferSubmit = (transferData) => {
    console.log('Transfer data:', transferData);
    // TODO: Aquí conectar con el backend
    setTransferModalVisible(false);
    Alert.alert(
      'Transferencia exitosa',
      `Se transfirieron $${transferData.amount.toFixed(2)} a ${transferData.recipient}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <PayHeader />

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard selectedAccount={selectedAccount} onPress={() => {}} />
        <QuickActions onActionPress={handleActionPress} />
        <RecentTransactions transactions={recentTransactions} />
        <ScheduledPayments payments={scheduledPayments} />
        
        <View style={{ height: 20 }} />
      </ScrollView>

      <TransferModal
        visible={transferModalVisible}
        onClose={() => setTransferModalVisible(false)}
        accounts={accounts}
        onSubmit={handleTransferSubmit}
      />
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  scrollContent: {
    paddingBottom: 16,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
  },
  accountName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountNumber: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceSubtext: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
  },

  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    textAlign: 'center',
  },

  // Transactions
  transactionsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.accentBlue,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  transactionAmountContainer: {
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

  // Scheduled Payments
  scheduledContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  scheduledItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  scheduledLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduledDetails: {
    marginLeft: 12,
  },
  scheduledName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  scheduledDate: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  scheduledRight: {
    alignItems: 'flex-end',
  },
  scheduledAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 6,
  },
  scheduledBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scheduledBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.lightText,
    marginTop: 16,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.darkText,
    backgroundColor: COLORS.white,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
    paddingVertical: 16,
  },
  accountOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  accountOptionSelected: {
    borderColor: COLORS.primaryBlue,
    borderWidth: 2,
    backgroundColor: COLORS.primaryBlue + '05',
  },
  accountOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountOptionDetails: {
    marginLeft: 12,
  },
  accountOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  accountOptionNumber: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  accountOptionBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
