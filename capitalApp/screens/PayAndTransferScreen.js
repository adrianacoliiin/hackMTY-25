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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

// ============================================================================
// MODAL 1: TRANSFERENCIA BANCARIA
// ============================================================================
const TransferModal = ({ visible, onClose, accounts, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [concept, setConcept] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleTransfer = () => {
    if (!amount || !recipient || !accountNumber || !selectedAccount) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (parseFloat(amount) > selectedAccount.balance) {
      Alert.alert('Fondos insuficientes', 'No tienes saldo suficiente para esta transferencia');
      return;
    }

    const transferData = {
      type: 'transfer',
      amount: parseFloat(amount),
      recipient,
      accountNumber,
      concept: concept || 'Transferencia',
      fromAccount: selectedAccount,
    };

    onSubmit(transferData);
    // Reset
    setAmount('');
    setRecipient('');
    setAccountNumber('');
    setConcept('');
    setSelectedAccount(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
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
              <Text style={styles.inputLabel}>Nombre del beneficiario *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre completo"
                value={recipient}
                onChangeText={setRecipient}
              />
            </View>

            {/* Número de cuenta */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de cuenta *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ingresa el número de cuenta"
                keyboardType="number-pad"
                value={accountNumber}
                onChangeText={setAccountNumber}
                maxLength={18}
              />
            </View>

            {/* Concepto */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Concepto</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Descripción del pago"
                value={concept}
                onChangeText={setConcept}
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ============================================================================
// MODAL 2: PAGO DE TARJETA
// ============================================================================
const PayCardModal = ({ visible, onClose, accounts, cards, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentType, setPaymentType] = useState('minimum');

  const handlePayCard = () => {
    if (!selectedCard || !selectedAccount) {
      Alert.alert('Error', 'Selecciona una tarjeta y cuenta de origen');
      return;
    }

    let paymentAmount = 0;
    if (paymentType === 'minimum') {
      paymentAmount = selectedCard.minimumPayment;
    } else if (paymentType === 'full') {
      paymentAmount = selectedCard.balance;
    } else {
      paymentAmount = parseFloat(amount);
    }

    if (!paymentAmount || paymentAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }

    if (paymentAmount > selectedAccount.balance) {
      Alert.alert('Fondos insuficientes', 'No tienes saldo suficiente');
      return;
    }

    const paymentData = {
      type: 'cardPayment',
      amount: paymentAmount,
      card: selectedCard,
      fromAccount: selectedAccount,
      paymentType,
    };

    onSubmit(paymentData);
    setAmount('');
    setSelectedCard(null);
    setSelectedAccount(null);
    setPaymentType('minimum');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pagar tarjeta</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Seleccionar tarjeta */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tarjeta a pagar *</Text>
              {cards.map((card, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cardOption,
                    selectedCard?.id === card.id && styles.cardOptionSelected
                  ]}
                  onPress={() => setSelectedCard(card)}
                >
                  <View style={styles.cardOptionLeft}>
                    <Ionicons 
                      name={selectedCard?.id === card.id ? 'radio-button-on' : 'radio-button-off'} 
                      size={24} 
                      color={COLORS.primaryBlue} 
                    />
                    <View style={styles.cardOptionDetails}>
                      <Text style={styles.cardOptionName}>{card.name}</Text>
                      <Text style={styles.cardOptionNumber}>...{card.number}</Text>
                      <Text style={styles.cardOptionBalance}>Saldo: ${card.balance.toLocaleString('es-MX')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tipo de pago */}
            {selectedCard && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tipo de pago</Text>
                <TouchableOpacity
                  style={[styles.paymentTypeOption, paymentType === 'minimum' && styles.paymentTypeSelected]}
                  onPress={() => setPaymentType('minimum')}
                >
                  <Ionicons 
                    name={paymentType === 'minimum' ? 'radio-button-on' : 'radio-button-off'} 
                    size={20} 
                    color={COLORS.primaryBlue} 
                  />
                  <View style={styles.paymentTypeDetails}>
                    <Text style={styles.paymentTypeLabel}>Pago mínimo</Text>
                    <Text style={styles.paymentTypeAmount}>
                      ${selectedCard.minimumPayment.toLocaleString('es-MX')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentTypeOption, paymentType === 'full' && styles.paymentTypeSelected]}
                  onPress={() => setPaymentType('full')}
                >
                  <Ionicons 
                    name={paymentType === 'full' ? 'radio-button-on' : 'radio-button-off'} 
                    size={20} 
                    color={COLORS.primaryBlue} 
                  />
                  <View style={styles.paymentTypeDetails}>
                    <Text style={styles.paymentTypeLabel}>Pago total</Text>
                    <Text style={styles.paymentTypeAmount}>
                      ${selectedCard.balance.toLocaleString('es-MX')}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentTypeOption, paymentType === 'custom' && styles.paymentTypeSelected]}
                  onPress={() => setPaymentType('custom')}
                >
                  <Ionicons 
                    name={paymentType === 'custom' ? 'radio-button-on' : 'radio-button-off'} 
                    size={20} 
                    color={COLORS.primaryBlue} 
                  />
                  <Text style={styles.paymentTypeLabel}>Otra cantidad</Text>
                </TouchableOpacity>

                {paymentType === 'custom' && (
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
                )}
              </View>
            )}

            {/* Cuenta de origen */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pagar desde *</Text>
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
            <TouchableOpacity style={styles.confirmButton} onPress={handlePayCard}>
              <Text style={styles.confirmButtonText}>Pagar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// MODAL 3: ENVÍO A CONTACTO
// ============================================================================
const SendContactModal = ({ visible, onClose, accounts, contacts, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!amount || !selectedContact || !selectedAccount) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    if (parseFloat(amount) > selectedAccount.balance) {
      Alert.alert('Fondos insuficientes', 'No tienes saldo suficiente');
      return;
    }

    const sendData = {
      type: 'contactSend',
      amount: parseFloat(amount),
      contact: selectedContact,
      fromAccount: selectedAccount,
      message: message || 'Pago enviado',
    };

    onSubmit(sendData);
    setAmount('');
    setSelectedContact(null);
    setSelectedAccount(null);
    setMessage('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enviar a contacto</Text>
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

            {/* Contactos */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enviar a *</Text>
              {contacts.map((contact, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.contactOption,
                    selectedContact?.id === contact.id && styles.contactOptionSelected
                  ]}
                  onPress={() => setSelectedContact(contact)}
                >
                  <View style={styles.contactOptionLeft}>
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.contactOptionDetails}>
                      <Text style={styles.contactOptionName}>{contact.name}</Text>
                      <Text style={styles.contactOptionPhone}>{contact.phone}</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={selectedContact?.id === contact.id ? 'checkmark-circle' : 'ellipse-outline'} 
                    size={24} 
                    color={COLORS.primaryBlue} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Mensaje */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mensaje (opcional)</Text>
              <TextInput
                style={[styles.modalInput, { height: 60 }]}
                placeholder="Agrega un mensaje"
                value={message}
                onChangeText={setMessage}
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
            <TouchableOpacity style={styles.confirmButton} onPress={handleSend}>
              <Text style={styles.confirmButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// MODAL 4: CONFIRMACIÓN
// ============================================================================
const ConfirmationModal = ({ visible, onClose, transaction }) => {
  if (!transaction) return null;

  const getTypeLabel = () => {
    switch(transaction.type) {
      case 'transfer': return 'Transferencia';
      case 'cardPayment': return 'Pago de tarjeta';
      case 'contactSend': return 'Envío a contacto';
      default: return 'Transacción';
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.confirmationContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.successGreen} />
          </View>
          
          <Text style={styles.confirmationTitle}>¡{getTypeLabel()} exitosa!</Text>
          
          <View style={styles.confirmationDetails}>
            <View style={styles.confirmationRow}>
              <Text style={styles.confirmationLabel}>Monto</Text>
              <Text style={styles.confirmationValue}>
                ${transaction.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            
            {transaction.recipient && (
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Beneficiario</Text>
                <Text style={styles.confirmationValue}>{transaction.recipient}</Text>
              </View>
            )}
            
            {transaction.card && (
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Tarjeta</Text>
                <Text style={styles.confirmationValue}>{transaction.card.name}</Text>
              </View>
            )}
            
            {transaction.contact && (
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Contacto</Text>
                <Text style={styles.confirmationValue}>{transaction.contact.name}</Text>
              </View>
            )}
            
            <View style={styles.confirmationRow}>
              <Text style={styles.confirmationLabel}>Desde</Text>
              <Text style={styles.confirmationValue}>{transaction.fromAccount.name}</Text>
            </View>
            
            <View style={styles.confirmationRow}>
              <Text style={styles.confirmationLabel}>Fecha</Text>
              <Text style={styles.confirmationValue}>
                {new Date().toLocaleDateString('es-MX', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.confirmationButton} onPress={onClose}>
            <Text style={styles.confirmationButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// COMPONENTES UI
// ============================================================================
const PayHeader = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Paga y transfiere</Text>
    <TouchableOpacity>
      <Ionicons name="notifications-outline" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

const BalanceCard = ({ selectedAccount }) => (
  <View style={styles.balanceCard}>
    <Text style={styles.balanceLabel}>Cuenta principal</Text>
    <Text style={styles.accountName}>{selectedAccount.name}</Text>
    <Text style={styles.accountNumber}>...{selectedAccount.number}</Text>
    <View style={styles.balanceRow}>
      <Text style={styles.balanceAmount}>
        ${selectedAccount.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
      </Text>
      <Text style={styles.balanceSubtext}>Disponible</Text>
    </View>
  </View>
);

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
        icon="people-outline"
        label="A contacto"
        color={COLORS.primaryBlue}
        onPress={() => onActionPress('sendContact')}
      />
      <ActionButton
        icon="receipt-outline"
        label="Servicios"
        color={COLORS.warningOrange}
        onPress={() => onActionPress('services')}
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

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function PayAndTransferScreen() {
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [payCardModalVisible, setPayCardModalVisible] = useState(false);
  const [sendContactModalVisible, setSendContactModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  
  const selectedAccount = {
    id: '1',
    name: 'CAPITAL ONE COLLEGE',
    number: '3882',
    balance: 1500.10,
  };

  const accounts = [
    { id: '1', name: 'CAPITAL ONE COLLEGE', number: '3882', balance: 1500.10 },
    { id: '2', name: 'Cuenta de Ahorro', number: '5621', balance: 5000.00 },
  ];

  const cards = [
    { 
      id: '1', 
      name: 'Freedom Student', 
      number: '7081', 
      balance: 850.50,
      minimumPayment: 50.00
    },
  ];

  const contacts = [
    { id: '1', name: 'María González', phone: '+52 555 123 4567' },
    { id: '2', name: 'Juan Pérez', phone: '+52 555 987 6543' },
    { id: '3', name: 'Ana Martínez', phone: '+52 555 456 7890' },
  ];

  const recentTransactions = [
    { name: 'Netflix', date: 'Hoy, 10:30 AM', amount: 199.00, type: 'outgoing', status: 'Completado' },
    { name: 'Depósito directo', date: 'Ayer, 3:45 PM', amount: 2500.00, type: 'incoming', status: 'Completado' },
    { name: 'Amazon', date: '23 Oct', amount: 450.50, type: 'outgoing', status: 'Completado' },
  ];

  const handleActionPress = (action) => {
    switch (action) {
      case 'transfer':
        setTransferModalVisible(true);
        break;
      case 'payCard':
        setPayCardModalVisible(true);
        break;
      case 'sendContact':
        setSendContactModalVisible(true);
        break;
      case 'services':
        Alert.alert('Pagar servicios', 'Funcionalidad próximamente disponible');
        break;
    }
  };

  const handleTransactionSubmit = (transactionData) => {
    console.log('Transaction:', transactionData);
    
    setTransferModalVisible(false);
    setPayCardModalVisible(false);
    setSendContactModalVisible(false);
    
    setLastTransaction(transactionData);
    setConfirmationModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <PayHeader />

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        <BalanceCard selectedAccount={selectedAccount} />
        <QuickActions onActionPress={handleActionPress} />
        <RecentTransactions transactions={recentTransactions} />
        
        <View style={{ height: 20 }} />
      </ScrollView>

      <TransferModal
        visible={transferModalVisible}
        onClose={() => setTransferModalVisible(false)}
        accounts={accounts}
        onSubmit={handleTransactionSubmit}
      />

      <PayCardModal
        visible={payCardModalVisible}
        onClose={() => setPayCardModalVisible(false)}
        accounts={accounts}
        cards={cards}
        onSubmit={handleTransactionSubmit}
      />

      <SendContactModal
        visible={sendContactModalVisible}
        onClose={() => setSendContactModalVisible(false)}
        accounts={accounts}
        contacts={contacts}
        onSubmit={handleTransactionSubmit}
      />

      <ConfirmationModal
        visible={confirmationModalVisible}
        onClose={() => setConfirmationModalVisible(false)}
        transaction={lastTransaction}
      />
    </SafeAreaView>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================
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
  balanceCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
  },
  balanceLabel: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceSubtext: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  quickActionsContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.darkText,
    textAlign: 'center',
  },
  transactionsContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  modalBody: {
    padding: 20,
    maxHeight: 500,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    gap: 12,
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
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.darkText,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    paddingHorizontal: 14,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
    padding: 14,
  },
  accountOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  accountOptionSelected: {
    borderColor: COLORS.primaryBlue,
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
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  accountOptionNumber: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  accountOptionBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  cardOptionSelected: {
    borderColor: COLORS.primaryBlue,
    backgroundColor: COLORS.primaryBlue + '05',
  },
  cardOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardOptionDetails: {
    marginLeft: 12,
  },
  cardOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  cardOptionNumber: {
    fontSize: 13,
    color: COLORS.lightText,
    marginBottom: 2,
  },
  cardOptionBalance: {
    fontSize: 12,
    color: COLORS.warningOrange,
  },
  paymentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  paymentTypeSelected: {
    borderColor: COLORS.primaryBlue,
    backgroundColor: COLORS.primaryBlue + '05',
  },
  paymentTypeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentTypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkText,
    marginLeft: 12,
  },
  paymentTypeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  contactOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  contactOptionSelected: {
    borderColor: COLORS.primaryBlue,
    backgroundColor: COLORS.primaryBlue + '05',
  },
  contactOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  contactOptionDetails: {
    flex: 1,
  },
  contactOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  contactOptionPhone: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.borderGray,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  confirmationContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    margin: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 24,
    textAlign: 'center',
  },
  confirmationDetails: {
    width: '100%',
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  confirmationLabel: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  confirmationButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
  },
  confirmationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});