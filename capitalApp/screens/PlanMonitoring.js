import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
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
  goldBadge: '#FFD700',
  silverBadge: '#C0C0C0',
};

// --- 1. Header Component ---
const PlanHeader = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Planifica y Monitorea</Text>
  </View>
);

// --- 2. Metas de Ahorro Component ---
const SavingsGoals = ({ goals, onAddGoal, onGoalPress }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Ionicons name="flag" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.sectionTitle}>Metas de ahorro</Text>
      </View>
      <TouchableOpacity onPress={onAddGoal}>
        <Ionicons name="add-circle" size={24} color={COLORS.accentBlue} />
      </TouchableOpacity>
    </View>
    
    {goals.map((goal, index) => (
      <TouchableOpacity key={index} style={styles.goalCard} onPress={() => onGoalPress(goal)}>
        <View style={styles.goalHeader}>
          <View style={styles.goalIconContainer}>
            <MaterialCommunityIcons name={goal.icon} size={28} color={COLORS.accentBlue} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{goal.name}</Text>
            <Text style={styles.goalProgress}>
              ${goal.currentAmount.toLocaleString('es-MX')} de ${goal.targetAmount.toLocaleString('es-MX')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.lightText} />
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${goal.progress}%` }]} />
        </View>
        
        <View style={styles.goalFooter}>
          <Text style={styles.goalPercentage}>{goal.progress}%</Text>
          <Text style={styles.goalDeadline}>Meta: {goal.deadline}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// --- 3. Préstamos Activos Component ---
const ActiveLoans = ({ loans, onLoanPress }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <MaterialCommunityIcons name="cash-multiple" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.sectionTitle}>Préstamos activos</Text>
      </View>
    </View>
    
    {loans.map((loan, index) => (
      <TouchableOpacity key={index} style={styles.loanCard} onPress={() => onLoanPress(loan)}>
        <View style={styles.loanHeader}>
          <Text style={styles.loanType}>{loan.type}</Text>
          <View style={[styles.loanStatusBadge, { backgroundColor: loan.statusColor + '20' }]}>
            <Text style={[styles.loanStatus, { color: loan.statusColor }]}>{loan.status}</Text>
          </View>
        </View>
        
        <View style={styles.loanDetails}>
          <View style={styles.loanDetailRow}>
            <Text style={styles.loanLabel}>Saldo pendiente</Text>
            <Text style={styles.loanAmount}>${loan.balance.toLocaleString('es-MX')}</Text>
          </View>
          <View style={styles.loanDetailRow}>
            <Text style={styles.loanLabel}>Próximo pago</Text>
            <Text style={styles.loanNextPayment}>${loan.nextPayment.toLocaleString('es-MX')} - {loan.nextPaymentDate}</Text>
          </View>
          <View style={styles.loanDetailRow}>
            <Text style={styles.loanLabel}>Tasa de interés</Text>
            <Text style={styles.loanRate}>{loan.interestRate}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// --- 4. Suscripciones Component ---
const Subscriptions = ({ subscriptions, onSubscriptionPress }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Ionicons name="calendar" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.sectionTitle}>Suscripciones</Text>
      </View>
    </View>
    
    <View style={styles.subscriptionSummary}>
      <Text style={styles.subscriptionTotalLabel}>Gasto mensual total</Text>
      <Text style={styles.subscriptionTotalAmount}>
        ${subscriptions.reduce((sum, sub) => sum + sub.amount, 0).toLocaleString('es-MX')}/mes
      </Text>
    </View>
    
    {subscriptions.map((sub, index) => (
      <TouchableOpacity key={index} style={styles.subscriptionCard} onPress={() => onSubscriptionPress(sub)}>
        <View style={styles.subscriptionIcon}>
          <MaterialCommunityIcons name={sub.icon} size={24} color={sub.color} />
        </View>
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionName}>{sub.name}</Text>
          <Text style={styles.subscriptionFrequency}>{sub.frequency}</Text>
        </View>
        <View style={styles.subscriptionRight}>
          <Text style={styles.subscriptionAmount}>${sub.amount.toLocaleString('es-MX')}</Text>
          <Text style={styles.subscriptionNextDate}>Próximo: {sub.nextBilling}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// --- 5. Inversiones Component ---
const Investments = ({ investments, onInvestmentPress }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Ionicons name="trending-up" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.sectionTitle}>Inversiones</Text>
      </View>
    </View>
    
    {investments.map((investment, index) => (
      <TouchableOpacity key={index} style={styles.investmentCard} onPress={() => onInvestmentPress(investment)}>
        <View style={styles.investmentHeader}>
          <Text style={styles.investmentName}>{investment.name}</Text>
          <View style={[styles.investmentChangeBadge, { 
            backgroundColor: investment.change >= 0 ? COLORS.successGreen + '20' : COLORS.warningOrange + '20' 
          }]}>
            <Ionicons 
              name={investment.change >= 0 ? "trending-up" : "trending-down"} 
              size={14} 
              color={investment.change >= 0 ? COLORS.successGreen : COLORS.warningOrange} 
            />
            <Text style={[styles.investmentChange, { 
              color: investment.change >= 0 ? COLORS.successGreen : COLORS.warningOrange 
            }]}>
              {investment.change >= 0 ? '+' : ''}{investment.change}%
            </Text>
          </View>
        </View>
        
        <View style={styles.investmentDetails}>
          <View style={styles.investmentDetailColumn}>
            <Text style={styles.investmentLabel}>Valor actual</Text>
            <Text style={styles.investmentValue}>${investment.currentValue.toLocaleString('es-MX')}</Text>
          </View>
          <View style={styles.investmentDetailColumn}>
            <Text style={styles.investmentLabel}>Ganancia/Pérdida</Text>
            <Text style={[styles.investmentProfit, { 
              color: investment.profit >= 0 ? COLORS.successGreen : COLORS.warningOrange 
            }]}>
              {investment.profit >= 0 ? '+' : ''}${investment.profit.toLocaleString('es-MX')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// --- 6. Presupuestos Component ---
const Budgets = ({ budgets, onBudgetPress, onAddBudget }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Ionicons name="wallet" size={24} color={COLORS.primaryBlue} />
        <Text style={styles.sectionTitle}>Presupuestos</Text>
      </View>
      <TouchableOpacity onPress={onAddBudget}>
        <Ionicons name="add-circle" size={24} color={COLORS.accentBlue} />
      </TouchableOpacity>
    </View>
    
    {budgets.map((budget, index) => {
      const percentage = (budget.spent / budget.limit) * 100;
      const isOverBudget = percentage > 100;
      const isNearLimit = percentage > 80 && !isOverBudget;
      
      return (
        <TouchableOpacity key={index} style={styles.budgetCard} onPress={() => onBudgetPress(budget)}>
          <View style={styles.budgetHeader}>
            <View style={styles.budgetIconContainer}>
              <MaterialCommunityIcons name={budget.icon} size={24} color={COLORS.accentBlue} />
            </View>
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetName}>{budget.category}</Text>
              <Text style={styles.budgetPeriod}>{budget.period}</Text>
            </View>
          </View>
          
          <View style={styles.budgetAmounts}>
            <Text style={styles.budgetSpent}>
              ${budget.spent.toLocaleString('es-MX')} de ${budget.limit.toLocaleString('es-MX')}
            </Text>
            {isOverBudget && (
              <Text style={styles.budgetWarning}>¡Límite excedido!</Text>
            )}
            {isNearLimit && (
              <Text style={styles.budgetNearLimit}>Cerca del límite</Text>
            )}
          </View>
          
          <View style={styles.budgetProgressContainer}>
            <View style={[
              styles.budgetProgressFill, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isOverBudget ? COLORS.warningOrange : isNearLimit ? '#FFB800' : COLORS.successGreen
              }
            ]} />
          </View>
          
          <Text style={styles.budgetPercentage}>{percentage.toFixed(0)}% utilizado</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// --- 7. Goal Detail Modal ---
const GoalDetailModal = ({ visible, onClose, goal, onContribute, onWithdraw, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, history, insights

  if (!goal) return null;

  // Mock contribution history
  const contributionHistory = [
    { id: 1, date: '25 Oct 2025', amount: 500, type: 'deposit', source: 'Cuenta Corriente' },
    { id: 2, date: '18 Oct 2025', amount: 300, type: 'deposit', source: 'Transferencia' },
    { id: 3, date: '11 Oct 2025', amount: 400, type: 'deposit', source: 'Cuenta Corriente' },
    { id: 4, date: '4 Oct 2025', amount: 700, type: 'deposit', source: 'Depósito directo' },
  ];

  // Calculate insights
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const daysRemaining = 26; // Mock calculation
  const monthlyTarget = (remainingAmount / (daysRemaining / 30)).toFixed(2);
  const onTrack = goal.progress >= 50;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.goalDetailContainer}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View style={styles.goalDetailHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkText} />
          </TouchableOpacity>
          <Text style={styles.goalDetailTitle}>{goal.name}</Text>
          <TouchableOpacity onPress={() => Alert.alert('Más opciones', 'Editar o eliminar meta', [
            { text: 'Editar meta', onPress: () => onEdit(goal) },
            { text: 'Eliminar meta', onPress: () => onDelete(goal), style: 'destructive' },
            { text: 'Cancelar', style: 'cancel' }
          ])}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.darkText} />
          </TouchableOpacity>
        </View>

        {/* Progress Hero */}
        <View style={styles.goalProgressHero}>
          <View style={styles.circularProgressContainer}>
            <View style={styles.circularProgress}>
              <Text style={styles.circularProgressPercent}>{goal.progress}%</Text>
              <Text style={styles.circularProgressLabel}>Completado</Text>
            </View>
          </View>
          
          <View style={styles.goalAmounts}>
            <Text style={styles.currentAmountLabel}>Ahorro actual</Text>
            <Text style={styles.currentAmountValue}>${goal.currentAmount.toLocaleString('es-MX')}</Text>
            <Text style={styles.targetAmountLabel}>de ${goal.targetAmount.toLocaleString('es-MX')}</Text>
          </View>

          <View style={styles.goalStats}>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.lightText} />
              <Text style={styles.statLabel}>{daysRemaining} días restantes</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={20} color={onTrack ? COLORS.successGreen : COLORS.warningOrange} />
              <Text style={[styles.statLabel, { color: onTrack ? COLORS.successGreen : COLORS.warningOrange }]}>
                {onTrack ? 'En camino' : 'Retrasado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.goalDetailTabs}>
          <TouchableOpacity 
            style={[styles.goalDetailTab, activeTab === 'overview' && styles.goalDetailTabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.goalDetailTabText, activeTab === 'overview' && styles.goalDetailTabTextActive]}>
              Vista General
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.goalDetailTab, activeTab === 'history' && styles.goalDetailTabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.goalDetailTabText, activeTab === 'history' && styles.goalDetailTabTextActive]}>
              Historial
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.goalDetailTab, activeTab === 'insights' && styles.goalDetailTabActive]}
            onPress={() => setActiveTab('insights')}
          >
            <Text style={[styles.goalDetailTabText, activeTab === 'insights' && styles.goalDetailTabTextActive]}>
              Insights
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.goalDetailContent}>
          {activeTab === 'overview' && (
            <View>
              {/* Quick Actions */}
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity style={styles.primaryActionButton} onPress={() => onContribute(goal)}>
                  <Ionicons name="add-circle" size={24} color={COLORS.white} />
                  <Text style={styles.primaryActionText}>Contribuir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryActionButton} onPress={() => onWithdraw(goal)}>
                  <Ionicons name="arrow-down-circle-outline" size={24} color={COLORS.primaryBlue} />
                  <Text style={styles.secondaryActionText}>Retirar</Text>
                </TouchableOpacity>
              </View>

              {/* Recent Contributions */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Últimas contribuciones</Text>
                {contributionHistory.slice(0, 3).map(contribution => (
                  <View key={contribution.id} style={styles.contributionItem}>
                    <View style={styles.contributionIconContainer}>
                      <Ionicons 
                        name={contribution.type === 'deposit' ? 'arrow-up' : 'arrow-down'} 
                        size={20} 
                        color={contribution.type === 'deposit' ? COLORS.successGreen : COLORS.warningOrange} 
                      />
                    </View>
                    <View style={styles.contributionInfo}>
                      <Text style={styles.contributionSource}>{contribution.source}</Text>
                      <Text style={styles.contributionDate}>{contribution.date}</Text>
                    </View>
                    <Text style={[styles.contributionAmount, { color: contribution.type === 'deposit' ? COLORS.successGreen : COLORS.warningOrange }]}>
                      {contribution.type === 'deposit' ? '+' : '-'}${contribution.amount.toLocaleString('es-MX')}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Goal Milestones */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Hitos de progreso</Text>
                <View style={styles.milestonesContainer}>
                  {[25, 50, 75, 100].map(milestone => {
                    const achieved = goal.progress >= milestone;
                    const milestoneAmount = (goal.targetAmount * milestone / 100);
                    return (
                      <View key={milestone} style={styles.milestoneItem}>
                        <View style={[styles.milestoneIcon, achieved && styles.milestoneIconAchieved]}>
                          {achieved ? (
                            <Ionicons name="checkmark" size={16} color={COLORS.white} />
                          ) : (
                            <Text style={styles.milestonePercentText}>{milestone}%</Text>
                          )}
                        </View>
                        <Text style={styles.milestoneLabel}>${milestoneAmount.toLocaleString('es-MX')}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'history' && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Historial completo de movimientos</Text>
              {contributionHistory.map(contribution => (
                <View key={contribution.id} style={styles.historyItem}>
                  <View style={styles.historyIconContainer}>
                    <Ionicons 
                      name={contribution.type === 'deposit' ? 'arrow-up-circle' : 'arrow-down-circle'} 
                      size={32} 
                      color={contribution.type === 'deposit' ? COLORS.successGreen : COLORS.warningOrange} 
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historySource}>{contribution.source}</Text>
                    <Text style={styles.historyDate}>{contribution.date}</Text>
                    <Text style={styles.historyType}>
                      {contribution.type === 'deposit' ? 'Depósito' : 'Retiro'}
                    </Text>
                  </View>
                  <Text style={[styles.historyAmount, { 
                    color: contribution.type === 'deposit' ? COLORS.successGreen : COLORS.warningOrange 
                  }]}>
                    {contribution.type === 'deposit' ? '+' : '-'}${contribution.amount.toLocaleString('es-MX')}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'insights' && (
            <View>
              {/* Recommendations */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Recomendaciones</Text>
                <View style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <Ionicons name="bulb" size={24} color={COLORS.accentBlue} />
                    <Text style={styles.insightTitle}>Ahorro mensual sugerido</Text>
                  </View>
                  <Text style={styles.insightAmount}>${monthlyTarget}/mes</Text>
                  <Text style={styles.insightDescription}>
                    Para alcanzar tu meta de ${goal.targetAmount.toLocaleString('es-MX')} en {daysRemaining} días, 
                    te recomendamos ahorrar aproximadamente ${monthlyTarget} al mes.
                  </Text>
                </View>

                <View style={[styles.insightCard, { backgroundColor: onTrack ? COLORS.successGreen + '10' : COLORS.warningOrange + '10' }]}>
                  <View style={styles.insightHeader}>
                    <Ionicons 
                      name={onTrack ? 'checkmark-circle' : 'alert-circle'} 
                      size={24} 
                      color={onTrack ? COLORS.successGreen : COLORS.warningOrange} 
                    />
                    <Text style={styles.insightTitle}>Estado de tu meta</Text>
                  </View>
                  <Text style={styles.insightDescription}>
                    {onTrack 
                      ? '¡Excelente! Vas por buen camino para alcanzar tu meta a tiempo.' 
                      : 'Tu meta está un poco retrasada. Considera aumentar tus contribuciones mensuales.'}
                  </Text>
                </View>

                <View style={styles.insightCard}>
                  <View style={styles.insightHeader}>
                    <Ionicons name="calendar" size={24} color={COLORS.primaryBlue} />
                    <Text style={styles.insightTitle}>Fecha estimada de cumplimiento</Text>
                  </View>
                  <Text style={styles.insightAmount}>{goal.deadline}</Text>
                  <Text style={styles.insightDescription}>
                    Basado en tu patrón actual de ahorro, alcanzarás tu meta alrededor de esta fecha.
                  </Text>
                </View>
              </View>

              {/* Statistics */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Estadísticas</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statCardLabel}>Contribuciones totales</Text>
                    <Text style={styles.statCardValue}>4</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statCardLabel}>Promedio mensual</Text>
                    <Text style={styles.statCardValue}>$475</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statCardLabel}>Días activo</Text>
                    <Text style={styles.statCardValue}>21</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statCardLabel}>Retiros</Text>
                    <Text style={styles.statCardValue}>0</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// --- 8. Add Goal Modal ---
const AddGoalModal = ({ visible, onClose, onSave }) => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('piggy-bank');

  const icons = [
    { name: 'piggy-bank', label: 'Ahorro' },
    { name: 'car', label: 'Auto' },
    { name: 'home', label: 'Casa' },
    { name: 'airplane', label: 'Viaje' },
    { name: 'school', label: 'Educación' },
    { name: 'gift', label: 'Regalo' },
  ];

  const handleSave = () => {
    if (!goalName || !targetAmount || !deadline) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    onSave({
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      progress: 0,
      deadline,
      icon: selectedIcon,
    });
    
    // Reset form
    setGoalName('');
    setTargetAmount('');
    setDeadline('');
    setSelectedIcon('piggy-bank');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Meta de Ahorro</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Nombre de la meta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Vacaciones en Europa"
              value={goalName}
              onChangeText={setGoalName}
            />

            <Text style={styles.inputLabel}>Monto objetivo</Text>
            <TextInput
              style={styles.input}
              placeholder="10000"
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
            />

            <Text style={styles.inputLabel}>Fecha límite</Text>
            <TextInput
              style={styles.input}
              placeholder="Diciembre 2025"
              value={deadline}
              onChangeText={setDeadline}
            />

            <Text style={styles.inputLabel}>Ícono</Text>
            <View style={styles.iconGrid}>
              {icons.map((icon) => (
                <TouchableOpacity
                  key={icon.name}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon.name && styles.iconOptionSelected
                  ]}
                  onPress={() => setSelectedIcon(icon.name)}
                >
                  <MaterialCommunityIcons name={icon.name} size={28} color={COLORS.accentBlue} />
                  <Text style={styles.iconLabel}>{icon.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Meta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- 9. Contribute Modal ---
const ContributeModal = ({ visible, onClose, goal, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('checking');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');

  const accounts = [
    { id: 'checking', name: 'Cuenta Corriente', balance: 15420, icon: 'wallet' },
    { id: 'savings', name: 'Cuenta de Ahorros', balance: 8750, icon: 'briefcase' },
    { id: 'credit', name: 'Tarjeta de Crédito', balance: 25000, icon: 'card' },
  ];

  const handleContribute = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    const selectedAcc = accounts.find(acc => acc.id === selectedAccount);
    if (parseFloat(amount) > selectedAcc.balance) {
      Alert.alert('Fondos insuficientes', 'No tienes suficiente saldo en esta cuenta');
      return;
    }

    onConfirm({
      amount: parseFloat(amount),
      account: selectedAccount,
      isRecurring,
      frequency: isRecurring ? frequency : null,
    });

    setAmount('');
    setIsRecurring(false);
    onClose();
  };

  if (!goal) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Contribuir a {goal.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Goal Progress Summary */}
            <View style={styles.contributeGoalSummary}>
              <Text style={styles.contributeGoalLabel}>Progreso actual</Text>
              <Text style={styles.contributeGoalAmount}>
                ${goal.currentAmount.toLocaleString('es-MX')} / ${goal.targetAmount.toLocaleString('es-MX')}
              </Text>
              <View style={styles.contributeProgressBar}>
                <View style={[styles.contributeProgressFill, { width: `${goal.progress}%` }]} />
              </View>
              <Text style={styles.contributeGoalRemaining}>
                Faltan ${(goal.targetAmount - goal.currentAmount).toLocaleString('es-MX')} para tu meta
              </Text>
            </View>

            {/* Amount Input */}
            <Text style={styles.inputLabel}>Monto a contribuir</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountButtons}>
              {[100, 500, 1000, 2000].map(quickAmount => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(quickAmount.toString())}
                >
                  <Text style={styles.quickAmountText}>${quickAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Source Account Selection */}
            <Text style={styles.inputLabel}>Cuenta de origen</Text>
            {accounts.map(account => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  selectedAccount === account.id && styles.accountOptionSelected
                ]}
                onPress={() => setSelectedAccount(account.id)}
              >
                <View style={styles.accountOptionLeft}>
                  <View style={styles.accountIconContainer}>
                    <Ionicons name={account.icon} size={24} color={COLORS.accentBlue} />
                  </View>
                  <View>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountBalance}>Disponible: ${account.balance.toLocaleString('es-MX')}</Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedAccount === account.id && styles.radioButtonSelected
                ]}>
                  {selectedAccount === account.id && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}

            {/* Recurring Contribution */}
            <TouchableOpacity 
              style={styles.recurringToggle}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <View style={styles.recurringLeft}>
                <Ionicons name="repeat" size={24} color={COLORS.accentBlue} />
                <View style={styles.recurringTextContainer}>
                  <Text style={styles.recurringTitle}>Contribución recurrente</Text>
                  <Text style={styles.recurringDescription}>Programa aportes automáticos</Text>
                </View>
              </View>
              <View style={[styles.toggle, isRecurring && styles.toggleActive]}>
                <View style={[styles.toggleCircle, isRecurring && styles.toggleCircleActive]} />
              </View>
            </TouchableOpacity>

            {isRecurring && (
              <View style={styles.frequencyOptions}>
                {[
                  { value: 'weekly', label: 'Semanal' },
                  { value: 'biweekly', label: 'Quincenal' },
                  { value: 'monthly', label: 'Mensual' },
                ].map(freq => (
                  <TouchableOpacity
                    key={freq.value}
                    style={[
                      styles.frequencyOption,
                      frequency === freq.value && styles.frequencyOptionSelected
                    ]}
                    onPress={() => setFrequency(freq.value)}
                  >
                    <Text style={[
                      styles.frequencyText,
                      frequency === freq.value && styles.frequencyTextSelected
                    ]}>{freq.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleContribute}>
              <Text style={styles.confirmButtonText}>Contribuir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- 10. Withdraw Modal ---
const WithdrawModal = ({ visible, onClose, goal, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('emergency');

  const withdrawReasons = [
    { id: 'emergency', label: 'Emergencia médica', penalty: 5 },
    { id: 'urgent', label: 'Gasto urgente', penalty: 10 },
    { id: 'other', label: 'Otro motivo', penalty: 15 },
  ];

  const selectedReasonData = withdrawReasons.find(r => r.id === selectedReason);
  const penaltyAmount = amount ? (parseFloat(amount) * selectedReasonData.penalty / 100) : 0;
  const finalAmount = amount ? (parseFloat(amount) - penaltyAmount) : 0;

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    if (parseFloat(amount) > goal.currentAmount) {
      Alert.alert('Error', 'No puedes retirar más del saldo disponible');
      return;
    }

    Alert.alert(
      '⚠️ Confirmar Retiro Anticipado',
      `Retirarás: $${parseFloat(amount).toLocaleString('es-MX')}\nPenalización (${selectedReasonData.penalty}%): -$${penaltyAmount.toLocaleString('es-MX')}\n\nRecibirás: $${finalAmount.toLocaleString('es-MX')}\n\nEsto puede afectar tu progreso hacia la meta.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Retiro',
          style: 'destructive',
          onPress: () => {
            onConfirm({
              amount: parseFloat(amount),
              reason: selectedReasonData.label,
              penalty: penaltyAmount,
              finalAmount,
            });
            setAmount('');
            setReason('');
            onClose();
          },
        },
      ]
    );
  };

  if (!goal) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Retiro Anticipado</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Warning Banner */}
            <View style={styles.warningBanner}>
              <Ionicons name="warning" size={24} color={COLORS.warningOrange} />
              <Text style={styles.warningText}>
                El retiro anticipado de tu meta de ahorro incluye una penalización
              </Text>
            </View>

            {/* Available Balance */}
            <View style={styles.withdrawBalanceCard}>
              <Text style={styles.withdrawBalanceLabel}>Saldo disponible</Text>
              <Text style={styles.withdrawBalanceAmount}>
                ${goal.currentAmount.toLocaleString('es-MX')}
              </Text>
            </View>

            {/* Amount Input */}
            <Text style={styles.inputLabel}>Monto a retirar</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountButtons}>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => setAmount((goal.currentAmount * 0.25).toFixed(0))}
              >
                <Text style={styles.quickAmountText}>25%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => setAmount((goal.currentAmount * 0.50).toFixed(0))}
              >
                <Text style={styles.quickAmountText}>50%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => setAmount((goal.currentAmount * 0.75).toFixed(0))}
              >
                <Text style={styles.quickAmountText}>75%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAmountButton}
                onPress={() => setAmount(goal.currentAmount.toString())}
              >
                <Text style={styles.quickAmountText}>Todo</Text>
              </TouchableOpacity>
            </View>

            {/* Reason Selection */}
            <Text style={styles.inputLabel}>Motivo del retiro</Text>
            {withdrawReasons.map(reasonOption => (
              <TouchableOpacity
                key={reasonOption.id}
                style={[
                  styles.reasonOption,
                  selectedReason === reasonOption.id && styles.reasonOptionSelected
                ]}
                onPress={() => setSelectedReason(reasonOption.id)}
              >
                <View style={styles.reasonLeft}>
                  <Text style={styles.reasonLabel}>{reasonOption.label}</Text>
                  <Text style={styles.reasonPenalty}>Penalización: {reasonOption.penalty}%</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedReason === reasonOption.id && styles.radioButtonSelected
                ]}>
                  {selectedReason === reasonOption.id && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}

            {/* Penalty Calculation */}
            {amount && parseFloat(amount) > 0 && (
              <View style={styles.penaltyCalculation}>
                <View style={styles.penaltyRow}>
                  <Text style={styles.penaltyLabel}>Monto a retirar</Text>
                  <Text style={styles.penaltyValue}>${parseFloat(amount).toLocaleString('es-MX')}</Text>
                </View>
                <View style={styles.penaltyRow}>
                  <Text style={styles.penaltyLabel}>Penalización ({selectedReasonData.penalty}%)</Text>
                  <Text style={[styles.penaltyValue, { color: COLORS.warningOrange }]}>
                    -${penaltyAmount.toLocaleString('es-MX')}
                  </Text>
                </View>
                <View style={styles.penaltyDivider} />
                <View style={styles.penaltyRow}>
                  <Text style={styles.penaltyLabelTotal}>Recibirás</Text>
                  <Text style={styles.penaltyValueTotal}>${finalAmount.toLocaleString('es-MX')}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.withdrawButton]} 
              onPress={handleWithdraw}
            >
              <Text style={styles.confirmButtonText}>Retirar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- 11. Add Budget Modal ---
const AddBudgetModal = ({ visible, onClose, onSave }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState('Mensual');
  const [selectedIcon, setSelectedIcon] = useState('food');

  const categories = [
    { icon: 'food', label: 'Comida' },
    { icon: 'cart', label: 'Compras' },
    { icon: 'car', label: 'Transporte' },
    { icon: 'lightbulb', label: 'Servicios' },
    { icon: 'music', label: 'Entretenimiento' },
    { icon: 'heart', label: 'Salud' },
  ];

  const handleSave = () => {
    if (!category || !limit) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    onSave({
      category,
      limit: parseFloat(limit),
      spent: 0,
      period,
      icon: selectedIcon,
    });
    
    // Reset form
    setCategory('');
    setLimit('');
    setPeriod('Mensual');
    setSelectedIcon('food');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Presupuesto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Categoría</Text>
            <View style={styles.iconGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.icon}
                  style={[
                    styles.categoryOption,
                    selectedIcon === cat.icon && styles.iconOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedIcon(cat.icon);
                    setCategory(cat.label);
                  }}
                >
                  <MaterialCommunityIcons name={cat.icon} size={28} color={COLORS.accentBlue} />
                  <Text style={styles.iconLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Límite de gasto</Text>
            <TextInput
              style={styles.input}
              placeholder="5000"
              keyboardType="numeric"
              value={limit}
              onChangeText={setLimit}
            />

            <Text style={styles.inputLabel}>Periodo</Text>
            <View style={styles.periodOptions}>
              {['Semanal', 'Quincenal', 'Mensual'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodOption,
                    period === p && styles.periodOptionSelected
                  ]}
                  onPress={() => setPeriod(p)}
                >
                  <Text style={[
                    styles.periodText,
                    period === p && styles.periodTextSelected
                  ]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Presupuesto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- MAIN COMPONENT ---
export default function PlanMonitoring() {
  // Sample data - esto se reemplazará con datos de Supabase
  const [savingsGoals, setSavingsGoals] = useState([
    {
      name: 'Maestro del Ahorro',
      icon: 'piggy-bank',
      currentAmount: 1900,
      targetAmount: 2500,
      progress: 82,
      deadline: 'Nov 20, 2025',
    },
  ]);

  const [activeLoans, setActiveLoans] = useState([
    {
      type: 'Préstamo Personal',
      balance: 15000,
      nextPayment: 500,
      nextPaymentDate: 'Nov 5, 2025',
      interestRate: 8.5,
      status: 'Al corriente',
      statusColor: COLORS.successGreen,
    },
  ]);

  const [subscriptions, setSubscriptions] = useState([
    {
      name: 'Netflix',
      amount: 199,
      frequency: 'Mensual',
      nextBilling: 'Nov 1, 2025',
      icon: 'netflix',
      color: '#E50914',
    },
    {
      name: 'Spotify',
      amount: 115,
      frequency: 'Mensual',
      nextBilling: 'Nov 15, 2025',
      icon: 'spotify',
      color: '#1DB954',
    },
    {
      name: 'Amazon Prime',
      amount: 99,
      frequency: 'Mensual',
      nextBilling: 'Nov 10, 2025',
      icon: 'amazon',
      color: '#FF9900',
    },
  ]);

  const [investments, setInvestments] = useState([
    {
      name: 'Fondo de Inversión CETES',
      currentValue: 25000,
      profit: 1250,
      change: 5.26,
    },
    {
      name: 'Acciones Tech',
      currentValue: 18500,
      profit: -450,
      change: -2.37,
    },
  ]);

  const [budgets, setBudgets] = useState([
    {
      category: 'Comida',
      limit: 3000,
      spent: 2450,
      period: 'Octubre 2025',
      icon: 'food',
    },
    {
      category: 'Transporte',
      limit: 1500,
      spent: 890,
      period: 'Octubre 2025',
      icon: 'car',
    },
  ]);

  const [addGoalModalVisible, setAddGoalModalVisible] = useState(false);
  const [addBudgetModalVisible, setAddBudgetModalVisible] = useState(false);
  const [goalDetailModalVisible, setGoalDetailModalVisible] = useState(false);
  const [contributeModalVisible, setContributeModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleAddGoal = (newGoal) => {
    setSavingsGoals([...savingsGoals, newGoal]);
    Alert.alert('¡Meta creada!', `Tu meta "${newGoal.name}" ha sido creada exitosamente.`);
  };

  const handleAddBudget = (newBudget) => {
    setBudgets([...budgets, newBudget]);
    Alert.alert('¡Presupuesto creado!', `Tu presupuesto de ${newBudget.category} ha sido creado.`);
  };

  const handleGoalPress = (goal) => {
    setSelectedGoal(goal);
    setGoalDetailModalVisible(true);
  };

  const handleContribute = (goal) => {
    setSelectedGoal(goal);
    setGoalDetailModalVisible(false);
    setTimeout(() => setContributeModalVisible(true), 300);
  };

  const handleWithdraw = (goal) => {
    setSelectedGoal(goal);
    setGoalDetailModalVisible(false);
    setTimeout(() => setWithdrawModalVisible(true), 300);
  };

  const handleContributeConfirm = (contributionData) => {
    const updatedGoals = savingsGoals.map(goal => {
      if (goal.name === selectedGoal.name) {
        const newAmount = goal.currentAmount + contributionData.amount;
        const newProgress = Math.min(Math.round((newAmount / goal.targetAmount) * 100), 100);
        return {
          ...goal,
          currentAmount: newAmount,
          progress: newProgress,
        };
      }
      return goal;
    });
    
    setSavingsGoals(updatedGoals);
    
    const updatedGoal = updatedGoals.find(g => g.name === selectedGoal.name);
    if (updatedGoal.progress >= 100) {
      setTimeout(() => {
        Alert.alert(
          '🎉 ¡Meta Alcanzada!',
          `¡Felicidades! Has completado tu meta "${updatedGoal.name}".\n\n¿Qué te gustaría hacer?`,
          [
            { text: 'Crear nueva meta', onPress: () => setAddGoalModalVisible(true) },
            { text: 'Ver detalles', onPress: () => handleGoalPress(updatedGoal) },
            { text: 'Cerrar', style: 'cancel' },
          ]
        );
      }, 500);
    } else {
      Alert.alert(
        '✅ Contribución exitosa',
        `Has agregado $${contributionData.amount.toLocaleString('es-MX')} a tu meta.\n\n${contributionData.isRecurring ? `Se programó una contribución ${contributionData.frequency === 'weekly' ? 'semanal' : contributionData.frequency === 'biweekly' ? 'quincenal' : 'mensual'}.` : ''}`
      );
    }
  };

  const handleWithdrawConfirm = (withdrawData) => {
    const updatedGoals = savingsGoals.map(goal => {
      if (goal.name === selectedGoal.name) {
        const newAmount = goal.currentAmount - withdrawData.amount;
        const newProgress = Math.round((newAmount / goal.targetAmount) * 100);
        return {
          ...goal,
          currentAmount: newAmount,
          progress: newProgress,
        };
      }
      return goal;
    });
    
    setSavingsGoals(updatedGoals);
    
    Alert.alert(
      '💰 Retiro procesado',
      `Se han retirado $${withdrawData.amount.toLocaleString('es-MX')} de tu meta.\n\nPenalización: -$${withdrawData.penalty.toLocaleString('es-MX')}\nMonto recibido: $${withdrawData.finalAmount.toLocaleString('es-MX')}\n\nMotivo: ${withdrawData.reason}`
    );
  };

  const handleEditGoal = (goal) => {
    setGoalDetailModalVisible(false);
    Alert.alert('Editar meta', 'Funcionalidad en desarrollo');
  };

  const handleDeleteGoal = (goal) => {
    setGoalDetailModalVisible(false);
    Alert.alert(
      '⚠️ Eliminar meta',
      `¿Estás seguro de eliminar la meta "${goal.name}"?\n\nTu saldo de $${goal.currentAmount.toLocaleString('es-MX')} será devuelto a tu cuenta.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setSavingsGoals(savingsGoals.filter(g => g.name !== goal.name));
            Alert.alert('Meta eliminada', `$${goal.currentAmount.toLocaleString('es-MX')} han sido devueltos a tu cuenta.`);
          },
        },
      ]
    );
  };

  const handleLoanPress = (loan) => {
    Alert.alert(
      loan.type,
      `Saldo: $${loan.balance.toLocaleString('es-MX')}\nPróximo pago: $${loan.nextPayment.toLocaleString('es-MX')} el ${loan.nextPaymentDate}\nTasa: ${loan.interestRate}%`,
      [{ text: 'Cerrar' }]
    );
  };

  const handleSubscriptionPress = (sub) => {
    Alert.alert(
      sub.name,
      `Monto: $${sub.amount.toLocaleString('es-MX')}/${sub.frequency}\nPróximo cobro: ${sub.nextBilling}`,
      [
        { text: 'Cancelar suscripción', style: 'destructive', onPress: () => {} },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  };

  const handleInvestmentPress = (investment) => {
    Alert.alert(
      investment.name,
      `Valor actual: $${investment.currentValue.toLocaleString('es-MX')}\nGanancia: $${investment.profit.toLocaleString('es-MX')}\nCambio: ${investment.change}%`,
      [{ text: 'Cerrar' }]
    );
  };

  const handleBudgetPress = (budget) => {
    const percentage = ((budget.spent / budget.limit) * 100).toFixed(0);
    Alert.alert(
      `Presupuesto: ${budget.category}`,
      `Gastado: $${budget.spent.toLocaleString('es-MX')} de $${budget.limit.toLocaleString('es-MX')}\n${percentage}% utilizado\nPeriodo: ${budget.period}`,
      [
        { text: 'Editar', onPress: () => {} },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <PlanHeader />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <SavingsGoals 
          goals={savingsGoals} 
          onAddGoal={() => setAddGoalModalVisible(true)}
          onGoalPress={handleGoalPress}
        />
        
        <ActiveLoans loans={activeLoans} onLoanPress={handleLoanPress} />
        
        <Subscriptions subscriptions={subscriptions} onSubscriptionPress={handleSubscriptionPress} />
        
        <Investments investments={investments} onInvestmentPress={handleInvestmentPress} />
        
        <Budgets 
          budgets={budgets} 
          onBudgetPress={handleBudgetPress}
          onAddBudget={() => setAddBudgetModalVisible(true)}
        />
        
        <View style={{ height: 30 }} />
      </ScrollView>

      <AddGoalModal 
        visible={addGoalModalVisible}
        onClose={() => setAddGoalModalVisible(false)}
        onSave={handleAddGoal}
      />

      <AddBudgetModal
        visible={addBudgetModalVisible}
        onClose={() => setAddBudgetModalVisible(false)}
        onSave={handleAddBudget}
      />

      <GoalDetailModal
        visible={goalDetailModalVisible}
        onClose={() => setGoalDetailModalVisible(false)}
        goal={selectedGoal}
        onContribute={handleContribute}
        onWithdraw={handleWithdraw}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
      />

      <ContributeModal
        visible={contributeModalVisible}
        onClose={() => setContributeModalVisible(false)}
        goal={selectedGoal}
        onConfirm={handleContributeConfirm}
      />

      <WithdrawModal
        visible={withdrawModalVisible}
        onClose={() => setWithdrawModalVisible(false)}
        goal={selectedGoal}
        onConfirm={handleWithdrawConfirm}
      />
    </SafeAreaView>
  );
}

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
  
  // Section Styles
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginLeft: 8,
  },
  
  // Goals Styles
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accentBlue + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.borderGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accentBlue,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accentBlue,
  },
  goalDeadline: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  
  // Loans Styles
  loanCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  loanStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loanStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  loanDetails: {
    gap: 8,
  },
  loanDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  loanLabel: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  loanAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  loanNextPayment: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.warningOrange,
  },
  loanRate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  
  // Subscriptions Styles
  subscriptionSummary: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  subscriptionTotalLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  subscriptionTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subscriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  subscriptionFrequency: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  subscriptionRight: {
    alignItems: 'flex-end',
  },
  subscriptionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  subscriptionNextDate: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  
  // Investments Styles
  investmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    flex: 1,
  },
  investmentChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  investmentChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  investmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  investmentDetailColumn: {
    flex: 1,
  },
  investmentLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  investmentValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  investmentProfit: {
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Budgets Styles
  budgetCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentBlue + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  budgetPeriod: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetSpent: {
    fontSize: 14,
    color: COLORS.darkText,
  },
  budgetWarning: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warningOrange,
  },
  budgetNearLimit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB800',
  },
  budgetProgressContainer: {
    height: 8,
    backgroundColor: COLORS.borderGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  budgetProgressFill: {
    height: '100%',
  },
  budgetPercentage: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.darkText,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  iconOption: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
  },
  categoryOption: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
  },
  iconOptionSelected: {
    borderColor: COLORS.accentBlue,
    backgroundColor: COLORS.accentBlue + '10',
  },
  iconLabel: {
    fontSize: 12,
    color: COLORS.darkText,
    marginTop: 4,
  },
  periodOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  periodOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    alignItems: 'center',
  },
  periodOptionSelected: {
    backgroundColor: COLORS.accentBlue,
    borderColor: COLORS.accentBlue,
  },
  periodText: {
    fontSize: 14,
    color: COLORS.darkText,
  },
  periodTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  saveButton: {
    margin: 20,
    backgroundColor: COLORS.primaryBlue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Goal Detail Modal Styles
  goalDetailContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  goalDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  goalDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
    flex: 1,
    textAlign: 'center',
  },
  goalProgressHero: {
    padding: 24,
    backgroundColor: COLORS.lightGrayBg,
    alignItems: 'center',
  },
  circularProgressContainer: {
    marginBottom: 16,
  },
  circularProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: COLORS.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  circularProgressPercent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.successGreen,
  },
  circularProgressLabel: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  goalAmounts: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentAmountLabel: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  currentAmountValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  targetAmountLabel: {
    fontSize: 14,
    color: COLORS.lightText,
    marginTop: 4,
  },
  goalStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  goalDetailTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  goalDetailTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  goalDetailTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryBlue,
  },
  goalDetailTabText: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  goalDetailTabTextActive: {
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  goalDetailContent: {
    flex: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  primaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryBlue,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryActionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    gap: 8,
  },
  secondaryActionText: {
    color: COLORS.primaryBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  detailSection: {
    padding: 16,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 12,
  },
  contributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  contributionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contributionInfo: {
    flex: 1,
  },
  contributionSource: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  contributionDate: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  milestonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  milestoneItem: {
    alignItems: 'center',
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  milestoneIconAchieved: {
    backgroundColor: COLORS.successGreen,
    borderColor: COLORS.successGreen,
  },
  milestonePercentText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.lightText,
  },
  milestoneLabel: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  historyIconContainer: {
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historySource: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },
  historyType: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  insightCard: {
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  insightAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    padding: 16,
  },
  statCardLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  
  // Contribute Modal Styles
  contributeGoalSummary: {
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contributeGoalLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  contributeGoalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 12,
  },
  contributeProgressBar: {
    height: 8,
    backgroundColor: COLORS.borderGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  contributeProgressFill: {
    height: '100%',
    backgroundColor: COLORS.successGreen,
  },
  contributeGoalRemaining: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accentBlue,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accentBlue,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
    paddingVertical: 16,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  quickAmountButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accentBlue,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accentBlue,
  },
  accountOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    marginBottom: 12,
  },
  accountOptionSelected: {
    borderColor: COLORS.accentBlue,
    backgroundColor: COLORS.accentBlue + '05',
  },
  accountOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  accountBalance: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.accentBlue,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accentBlue,
  },
  recurringToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    marginTop: 16,
  },
  recurringLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recurringTextContainer: {
    marginLeft: 12,
  },
  recurringTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  recurringDescription: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderGray,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.successGreen,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    alignItems: 'center',
  },
  frequencyOptionSelected: {
    backgroundColor: COLORS.accentBlue,
    borderColor: COLORS.accentBlue,
  },
  frequencyText: {
    fontSize: 14,
    color: COLORS.darkText,
  },
  frequencyTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.successGreen,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  
  // Withdraw Modal Styles
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningOrange + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.warningOrange,
    fontWeight: '500',
  },
  withdrawBalanceCard: {
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawBalanceLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  withdrawBalanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  reasonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    marginBottom: 12,
  },
  reasonOptionSelected: {
    borderColor: COLORS.warningOrange,
    backgroundColor: COLORS.warningOrange + '05',
  },
  reasonLeft: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  reasonPenalty: {
    fontSize: 12,
    color: COLORS.warningOrange,
    marginTop: 2,
  },
  penaltyCalculation: {
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  penaltyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  penaltyLabel: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  penaltyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  penaltyDivider: {
    height: 1,
    backgroundColor: COLORS.borderGray,
    marginVertical: 8,
  },
  penaltyLabelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  penaltyValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.successGreen,
  },
  withdrawButton: {
    backgroundColor: COLORS.warningOrange,
  },
});
