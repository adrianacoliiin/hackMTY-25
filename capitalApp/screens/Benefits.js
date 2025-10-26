import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { EarnedBadge, ProgressBadge, LockedBadge } from '../components/BadgeCard';
import { BenefitCard } from '../components/BenefitCard';

const COLORS = {
  primaryBlue: '#004a77',
  accentBlue: '#0070c0',
  successGreen: '#00a86b',
  warningOrange: '#ff8c00',
  goldBadge: '#FFD700',
  lightGrayBg: '#f4f6f9',
  white: '#ffffff',
  darkText: '#222222',
  lightText: '#666666',
  borderGray: '#e0e0e0',
};

// --- 1. Header ---
const BenefitsHeader = ({ onNotificationPress }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Recompensas</Text>
    <TouchableOpacity onPress={onNotificationPress}>
      <Ionicons name="notifications-outline" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

// --- 2. Points Hero Card ---
const PointsHeroCard = ({ points, level, onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [points]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.heroCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.heroLabel}>Puntos totales</Text>
            <Text style={styles.heroPoints}>
              {points?.total_points?.toLocaleString('es-MX') || '0'}
            </Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: level?.color + '30' || COLORS.accentBlue + '30' }]}>
            <MaterialCommunityIcons name="star-circle" size={24} color={level?.color || COLORS.accentBlue} />
            <Text style={[styles.levelText, { color: level?.color || COLORS.accentBlue }]}>
              {level?.name || 'Bronce'}
            </Text>
          </View>
        </View>
        
        <View style={styles.heroFooter}>
          <View style={styles.lifetimePoints}>
            <Ionicons name="trophy" size={16} color={COLORS.white} style={{ opacity: 0.8 }} />
            <Text style={styles.lifetimeText}>
              Históricos: {points?.lifetime_points?.toLocaleString('es-MX') || '0'}
            </Text>
          </View>
          {level?.nextLevel && (
            <View style={styles.nextLevelInfo}>
              <Text style={styles.nextLevelText}>
                {level.pointsToNext} pts para {level.nextLevel.name}
              </Text>
            </View>
          )}
        </View>

        {level?.nextLevel && (
          <View style={styles.levelProgressContainer}>
            <View style={[styles.levelProgressFill, { width: `${level.progressToNext}%` }]} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// --- 3. Tabs Selector ---
const TabSelector = ({ activeTab, onTabChange }) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'badges' && styles.tabActive]}
      onPress={() => onTabChange('badges')}
    >
      <Text style={[styles.tabText, activeTab === 'badges' && styles.tabTextActive]}>
        Insignias
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'benefits' && styles.tabActive]}
      onPress={() => onTabChange('benefits')}
    >
      <Text style={[styles.tabText, activeTab === 'benefits' && styles.tabTextActive]}>
        Beneficios
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'history' && styles.tabActive]}
      onPress={() => onTabChange('history')}
    >
      <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
        Historial
      </Text>
    </TouchableOpacity>
  </View>
);

// --- 4. Points History Item ---
const PointsHistoryItem = ({ item }) => (
  <View style={styles.historyItem}>
    <View style={[styles.historyIcon, { backgroundColor: item.color + '15' }]}>
      <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
    </View>
    <View style={styles.historyDetails}>
      <Text style={styles.historyReason}>{item.reason}</Text>
      <Text style={styles.historyDate}>{item.date}</Text>
    </View>
    <Text style={[styles.historyPoints, { color: item.color }]}>
      {item.isPositive ? '+' : '-'}{item.points}
    </Text>
  </View>
);

// --- 5. Badge Detail Modal ---
const BadgeDetailModal = ({ visible, badge, onClose }) => {
  if (!badge) return null;

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
            <Text style={styles.modalTitle}>{badge.badge_name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.badgeDetailIcon}>
              <MaterialCommunityIcons name="trophy-variant" size={80} color={COLORS.goldBadge} />
            </View>

            {badge.description && (
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            )}

            <View style={styles.badgeStats}>
              {badge.points_required && (
                <View style={styles.badgeStat}>
                  <Text style={styles.badgeStatLabel}>Puntos requeridos</Text>
                  <Text style={styles.badgeStatValue}>{badge.points_required}</Text>
                </View>
              )}
              {badge.earned_at && (
                <View style={styles.badgeStat}>
                  <Text style={styles.badgeStatLabel}>Obtenido</Text>
                  <Text style={styles.badgeStatValue}>
                    {new Date(badge.earned_at).toLocaleDateString('es-MX')}
                  </Text>
                </View>
              )}
            </View>

            {badge.benefit_type && badge.benefit_value && (
              <View style={styles.badgeBenefit}>
                <Ionicons name="gift" size={24} color={COLORS.successGreen} />
                <Text style={styles.badgeBenefitText}>
                  Otorga: {badge.benefit_type} de {badge.benefit_value}%
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- 6. Level Details Modal ---
const LevelDetailsModal = ({ visible, onClose, level, userPoints }) => {
  if (!level) return null;

  const levels = [
    { level: 1, name: 'Bronce', color: '#CD7F32', min: 0, max: 999 },
    { level: 2, name: 'Plata', color: '#C0C0C0', min: 1000, max: 4999 },
    { level: 3, name: 'Oro', color: '#FFD700', min: 5000, max: 9999 },
    { level: 4, name: 'Platino', color: '#E5E4E2', min: 10000, max: Infinity },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sistema de Niveles</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.levelModalDescription}>
              Acumula puntos para desbloquear niveles superiores y obtener beneficios exclusivos
            </Text>

            {levels.map((lvl, index) => {
              const isCurrentLevel = level.level === lvl.level;
              const isUnlocked = userPoints.total_points >= lvl.min;
              
              return (
                <View 
                  key={lvl.level} 
                  style={[
                    styles.levelDetailCard,
                    isCurrentLevel && styles.levelDetailCardActive
                  ]}
                >
                  <View style={styles.levelDetailHeader}>
                    <View style={[styles.levelDetailIcon, { backgroundColor: lvl.color + '20' }]}>
                      <MaterialCommunityIcons 
                        name="star-circle" 
                        size={32} 
                        color={lvl.color} 
                      />
                    </View>
                    <View style={styles.levelDetailInfo}>
                      <Text style={styles.levelDetailName}>{lvl.name}</Text>
                      <Text style={styles.levelDetailRange}>
                        {lvl.min.toLocaleString()} - {lvl.max === Infinity ? '∞' : lvl.max.toLocaleString()} pts
                      </Text>
                    </View>
                    {isCurrentLevel && (
                      <View style={styles.currentLevelBadge}>
                        <Text style={styles.currentLevelText}>Actual</Text>
                      </View>
                    )}
                    {!isUnlocked && (
                      <Ionicons name="lock-closed" size={20} color={COLORS.lightText} />
                    )}
                  </View>

                  <View style={styles.levelBenefits}>
                    <Text style={styles.levelBenefitsTitle}>Beneficios:</Text>
                    <View style={styles.levelBenefitItem}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.successGreen} />
                      <Text style={styles.levelBenefitText}>
                        {lvl.level === 1 && 'Cashback 1% en compras'}
                        {lvl.level === 2 && 'Cashback 2% + Sin comisiones'}
                        {lvl.level === 3 && 'Cashback 3% + Tasa preferencial'}
                        {lvl.level === 4 && 'Cashback 5% + Todos los beneficios'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- 7. Redeem Points Modal ---
const RedeemPointsModal = ({ visible, onClose, userPoints, onRedeem }) => {
  const [selectedReward, setSelectedReward] = useState(null);

  const rewards = [
    { id: '1', name: 'Cashback $50', points: 500, value: 50, type: 'cashback' },
    { id: '2', name: 'Cashback $100', points: 900, value: 100, type: 'cashback' },
    { id: '3', name: 'Descuento 10%', points: 750, value: 10, type: 'discount' },
    { id: '4', name: 'Sin comisiones 1 mes', points: 600, value: 1, type: 'fee_waiver' },
  ];

  const handleRedeem = () => {
    if (!selectedReward) {
      Alert.alert('Error', 'Selecciona una recompensa');
      return;
    }
    if (userPoints.total_points < selectedReward.points) {
      Alert.alert('Puntos insuficientes', 'No tienes suficientes puntos para esta recompensa');
      return;
    }
    onRedeem(selectedReward);
    setSelectedReward(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Canjear Puntos</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>

          <View style={styles.pointsBalance}>
            <Text style={styles.pointsBalanceLabel}>Puntos disponibles</Text>
            <Text style={styles.pointsBalanceValue}>
              {userPoints.total_points.toLocaleString('es-MX')}
            </Text>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.rewardsTitle}>Recompensas disponibles</Text>
            {rewards.map((reward) => {
              const canAfford = userPoints.total_points >= reward.points;
              return (
                <TouchableOpacity
                  key={reward.id}
                  style={[
                    styles.rewardOption,
                    selectedReward?.id === reward.id && styles.rewardOptionSelected,
                    !canAfford && styles.rewardOptionDisabled
                  ]}
                  onPress={() => canAfford && setSelectedReward(reward)}
                  disabled={!canAfford}
                >
                  <View style={styles.rewardOptionLeft}>
                    <Ionicons 
                      name={selectedReward?.id === reward.id ? 'radio-button-on' : 'radio-button-off'} 
                      size={24} 
                      color={canAfford ? COLORS.primaryBlue : COLORS.lightText} 
                    />
                    <View style={styles.rewardOptionDetails}>
                      <Text style={[styles.rewardOptionName, !canAfford && { color: COLORS.lightText }]}>
                        {reward.name}
                      </Text>
                      <Text style={styles.rewardOptionPoints}>
                        {reward.points.toLocaleString('es-MX')} puntos
                      </Text>
                    </View>
                  </View>
                  {!canAfford && (
                    <Ionicons name="lock-closed" size={20} color={COLORS.lightText} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, !selectedReward && { opacity: 0.5 }]} 
              onPress={handleRedeem}
              disabled={!selectedReward}
            >
              <Text style={styles.confirmButtonText}>Canjear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- 8. Daily Challenges Card ---
const DailyChallengesCard = ({ challenges, onChallengePress }) => (
  <View style={styles.challengesCard}>
    <View style={styles.challengesHeader}>
      <Text style={styles.challengesTitle}>Retos Diarios</Text>
      <Ionicons name="flame" size={20} color={COLORS.warningOrange} />
    </View>
    {challenges.map((challenge, index) => (
      <TouchableOpacity 
        key={index} 
        style={styles.challengeItem}
        onPress={() => onChallengePress(challenge)}
      >
        <View style={styles.challengeIconContainer}>
          <MaterialCommunityIcons 
            name={challenge.icon} 
            size={20} 
            color={challenge.completed ? COLORS.successGreen : COLORS.primaryBlue} 
          />
        </View>
        <View style={styles.challengeDetails}>
          <Text style={styles.challengeName}>{challenge.name}</Text>
          <Text style={styles.challengeProgress}>
            {challenge.current}/{challenge.target}
          </Text>
        </View>
        <View style={styles.challengeReward}>
          <Text style={styles.challengePoints}>+{challenge.points}</Text>
          {challenge.completed && (
            <Ionicons name="checkmark-circle" size={20} color={COLORS.successGreen} />
          )}
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// --- Componente Principal ---
export default function Benefits() {
  const [activeTab, setActiveTab] = useState('badges');
  const [loading, setLoading] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data - será reemplazado por datos reales de Supabase
  const [userPoints] = useState({
    total_points: 2450,
    lifetime_points: 3200,
  });

  const [level] = useState({
    level: 2,
    name: 'Plata',
    color: '#C0C0C0',
    min: 1000,
    max: 4999,
    nextLevel: { level: 3, name: 'Oro', min: 5000 },
    progressToNext: 48.67,
    pointsToNext: 2550,
  });

  const [dailyChallenges] = useState([
    { 
      id: '1',
      name: 'Realiza 3 transacciones',
      icon: 'swap-horizontal',
      current: 2,
      target: 3,
      points: 50,
      completed: false
    },
    { 
      id: '2',
      name: 'Paga una factura',
      icon: 'receipt',
      current: 1,
      target: 1,
      points: 75,
      completed: true
    },
    { 
      id: '3',
      name: 'Ahorra $100',
      icon: 'piggy-bank',
      current: 50,
      target: 100,
      points: 100,
      completed: false
    },
  ]);

  const [earnedBadges] = useState([
    {
      id: '1',
      badge_name: 'Ahorrador Novato',
      badge_type: 'bronze',
      points_required: 100,
      earned_at: '2025-10-15T10:00:00Z',
      description: 'Realizaste tu primera meta de ahorro',
      benefit_type: 'cashback',
      benefit_value: 1,
    },
    {
      id: '2',
      badge_name: 'Pagador Puntual',
      badge_type: 'silver',
      points_required: 500,
      earned_at: '2025-10-20T14:30:00Z',
      description: '5 pagos a tiempo consecutivos',
    },
    {
      id: '3',
      badge_name: 'Inversionista',
      badge_type: 'gold',
      points_required: 1000,
      earned_at: '2025-10-22T09:15:00Z',
      description: 'Primera inversión realizada',
      benefit_type: 'interest_boost',
      benefit_value: 0.5,
    },
  ]);

  const [progressBadges] = useState([
    {
      id: '4',
      badge_name: 'Maestro del Ahorro',
      points_required: 3000,
      description: '10 metas de ahorro completadas',
      benefit_type: 'cashback',
      benefit_value: 3,
    },
    {
      id: '5',
      badge_name: 'Responsable Financiero',
      points_required: 2800,
      description: 'Sin pagos tarde en 6 meses',
    },
  ]);

  const [lockedBadges] = useState([
    {
      id: '6',
      badge_name: 'Élite Premium',
      points_required: 10000,
      description: 'Alcanza nivel Platino',
    },
    {
      id: '7',
      badge_name: 'Inversor Pro',
      points_required: 5000,
      description: 'Portafolio de inversión $50,000+',
    },
  ]);

  const [activeBenefits] = useState([
    {
      id: '1',
      benefit_type: 'cashback',
      benefit_value: 1,
      badge_name: 'Ahorrador Novato',
      is_active: true,
      start_date: '2025-10-15T00:00:00Z',
      end_date: null,
    },
    {
      id: '2',
      benefit_type: 'discount',
      benefit_value: 5,
      badge_name: 'Cliente Premium',
      is_active: true,
      start_date: '2025-10-01T00:00:00Z',
      end_date: '2025-11-30T23:59:59Z',
    },
    {
      id: '3',
      benefit_type: 'interest_boost',
      benefit_value: 0.5,
      badge_name: 'Inversionista',
      is_active: true,
      start_date: '2025-10-22T00:00:00Z',
      end_date: '2025-12-31T23:59:59Z',
    },
  ]);

  const [pointsHistory] = useState([
    {
      id: '1',
      points: 100,
      isPositive: true,
      reason: 'Pago de tarjeta a tiempo',
      date: 'Hoy, 10:30 AM',
      icon: 'cash-check',
      color: COLORS.successGreen,
    },
    {
      id: '2',
      points: 50,
      isPositive: true,
      reason: 'Transferencia realizada',
      date: 'Ayer, 3:45 PM',
      icon: 'swap-horizontal',
      color: COLORS.successGreen,
    },
    {
      id: '3',
      points: 200,
      isPositive: true,
      reason: 'Meta de ahorro completada',
      date: '23 Oct',
      icon: 'piggy-bank',
      color: COLORS.successGreen,
    },
    {
      id: '4',
      points: 150,
      isPositive: true,
      reason: 'Bonus por nuevo badge',
      date: '22 Oct',
      icon: 'trophy-variant',
      color: COLORS.goldBadge,
    },
  ]);

  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const handleNotificationPress = () => {
    Alert.alert('Notificaciones', 'Tienes 2 nuevas notificaciones:\n\n1. ¡Nuevo badge desbloqueado!\n2. Reto diario completado');
  };

  const handleRedeemPoints = (reward) => {
    Alert.alert(
      '¡Canje exitoso!',
      `Has canjeado ${reward.points} puntos por ${reward.name}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setRedeemModalVisible(false);
            // Aquí se actualizaría el backend
          }
        }
      ]
    );
  };

  const handleShareBadge = (badge) => {
    Alert.alert(
      'Compartir logro',
      `¿Quieres compartir tu badge "${badge.badge_name}" en redes sociales?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Compartir', 
          onPress: () => Alert.alert('Compartido', '¡Logro compartido exitosamente!') 
        }
      ]
    );
  };

  const handleChallengePress = (challenge) => {
    if (challenge.completed) {
      Alert.alert('¡Reto completado!', `Has ganado ${challenge.points} puntos`);
    } else {
      Alert.alert(
        challenge.name,
        `Progreso: ${challenge.current}/${challenge.target}\nRecompensa: ${challenge.points} puntos`
      );
    }
  };

  const filteredBadges = () => {
    let badges = [...earnedBadges, ...progressBadges, ...lockedBadges];
    
    if (searchQuery) {
      badges = badges.filter(badge => 
        badge.badge_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      badges = badges.filter(badge => {
        if (filterType === 'earned') return badge.earned_at;
        if (filterType === 'progress') return !badge.earned_at && badge.points_required;
        if (filterType === 'locked') return !badge.earned_at && !badge.current;
        return true;
      });
    }
    
    return badges;
  };

  const renderContent = () => {
    if (activeTab === 'badges') {
      return (
        <View>
          {/* Search and Filter */}
          <View style={styles.searchFilterContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={COLORS.lightText} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar insignias..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.lightText} />
                </TouchableOpacity>
              )}
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              <TouchableOpacity
                style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
                onPress={() => setFilterType('all')}
              >
                <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>
                  Todas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, filterType === 'earned' && styles.filterChipActive]}
                onPress={() => setFilterType('earned')}
              >
                <Text style={[styles.filterChipText, filterType === 'earned' && styles.filterChipTextActive]}>
                  Ganadas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, filterType === 'progress' && styles.filterChipActive]}
                onPress={() => setFilterType('progress')}
              >
                <Text style={[styles.filterChipText, filterType === 'progress' && styles.filterChipTextActive]}>
                  En progreso
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, filterType === 'locked' && styles.filterChipActive]}
                onPress={() => setFilterType('locked')}
              >
                <Text style={[styles.filterChipText, filterType === 'locked' && styles.filterChipTextActive]}>
                  Bloqueadas
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Insignias Ganadas ({earnedBadges.length})
                </Text>
                <TouchableOpacity onPress={() => handleShareBadge(earnedBadges[0])}>
                  <Ionicons name="share-social" size={20} color={COLORS.accentBlue} />
                </TouchableOpacity>
              </View>
              <View style={styles.badgesGrid}>
                {earnedBadges.map((badge) => (
                  <EarnedBadge
                    key={badge.id}
                    badge={badge}
                    onPress={() => handleBadgePress(badge)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Progress Badges */}
          {progressBadges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>En Progreso</Text>
              {progressBadges.map((badge) => (
                <ProgressBadge
                  key={badge.id}
                  badge={badge}
                  userPoints={userPoints.total_points}
                  onPress={() => handleBadgePress(badge)}
                />
              ))}
            </View>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bloqueadas</Text>
              <View style={styles.badgesGrid}>
                {lockedBadges.map((badge) => (
                  <LockedBadge
                    key={badge.id}
                    badge={badge}
                    onPress={() => handleBadgePress(badge)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      );
    }

    if (activeTab === 'benefits') {
      return (
        <View>
          {/* Redeem Points Button */}
          <TouchableOpacity 
            style={styles.redeemButton}
            onPress={() => setRedeemModalVisible(true)}
          >
            <View style={styles.redeemButtonContent}>
              <Ionicons name="gift" size={24} color={COLORS.white} />
              <Text style={styles.redeemButtonText}>Canjear Puntos</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Beneficios Activos ({activeBenefits.filter(b => b.is_active).length})
            </Text>
            {activeBenefits.length > 0 ? (
              activeBenefits.map((benefit) => (
                <BenefitCard
                  key={benefit.id}
                  benefit={benefit}
                  onPress={() => Alert.alert('Beneficio', `Detalles de ${benefit.benefit_type}`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="gift-outline" size={64} color={COLORS.lightText} />
                <Text style={styles.emptyText}>No tienes beneficios activos</Text>
                <Text style={styles.emptySubtext}>
                  Gana badges para desbloquear beneficios exclusivos
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (activeTab === 'history') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Puntos</Text>
          {pointsHistory.map((item) => (
            <PointsHistoryItem key={item.id} item={item} />
          ))}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <BenefitsHeader onNotificationPress={handleNotificationPress} />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PointsHeroCard
          points={userPoints}
          level={level}
          onPress={() => setLevelModalVisible(true)}
        />

        {/* Daily Challenges */}
        <DailyChallengesCard 
          challenges={dailyChallenges}
          onChallengePress={handleChallengePress}
        />

        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primaryBlue} style={{ marginTop: 50 }} />
        ) : (
          renderContent()
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <BadgeDetailModal
        visible={modalVisible}
        badge={selectedBadge}
        onClose={() => setModalVisible(false)}
      />

      <LevelDetailsModal
        visible={levelModalVisible}
        level={level}
        userPoints={userPoints}
        onClose={() => setLevelModalVisible(false)}
      />

      <RedeemPointsModal
        visible={redeemModalVisible}
        userPoints={userPoints}
        onClose={() => setRedeemModalVisible(false)}
        onRedeem={handleRedeemPoints}
      />
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
    paddingBottom: 20,
  },

  // Hero Card
  heroCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 20,
    padding: 24,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroLabel: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  heroPoints: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: 'bold',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lifetimePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lifetimeText: {
    color: COLORS.white,
    fontSize: 13,
    opacity: 0.9,
  },
  nextLevelInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nextLevelText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  levelProgressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 3,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: COLORS.primaryBlue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.lightText,
  },
  tabTextActive: {
    color: COLORS.white,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 16,
  },

  // Badges Grid
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // History Item
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyReason: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  historyPoints: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
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
    flex: 1,
  },
  modalBody: {
    padding: 24,
  },
  badgeDetailIcon: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeDescription: {
    fontSize: 16,
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  badgeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  badgeStat: {
    alignItems: 'center',
  },
  badgeStatLabel: {
    fontSize: 13,
    color: COLORS.lightText,
    marginBottom: 6,
  },
  badgeStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  badgeBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.successGreen + '15',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  badgeBenefitText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.successGreen,
  },
  modalCloseButton: {
    backgroundColor: COLORS.primaryBlue,
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // Search and Filter
  searchFilterContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.darkText,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrayBg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
  },
  filterChipText: {
    fontSize: 14,
    color: COLORS.darkText,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Level Details Modal
  levelModalDescription: {
    fontSize: 15,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  levelDetailCard: {
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  levelDetailCardActive: {
    borderColor: COLORS.primaryBlue,
    borderWidth: 2,
    backgroundColor: COLORS.primaryBlue + '05',
  },
  levelDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelDetailIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelDetailInfo: {
    flex: 1,
  },
  levelDetailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  levelDetailRange: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  currentLevelBadge: {
    backgroundColor: COLORS.successGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  currentLevelText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  levelBenefits: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    paddingTop: 12,
  },
  levelBenefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  levelBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelBenefitText: {
    fontSize: 14,
    color: COLORS.darkText,
    marginLeft: 8,
  },

  // Redeem Points Modal
  pointsBalance: {
    backgroundColor: COLORS.primaryBlue,
    padding: 20,
    alignItems: 'center',
  },
  pointsBalanceLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  pointsBalanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 16,
  },
  rewardOption: {
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
  rewardOptionSelected: {
    borderColor: COLORS.primaryBlue,
    backgroundColor: COLORS.primaryBlue + '05',
    borderWidth: 2,
  },
  rewardOptionDisabled: {
    opacity: 0.5,
  },
  rewardOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardOptionDetails: {
    marginLeft: 12,
  },
  rewardOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  rewardOptionPoints: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    gap: 12,
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

  // Daily Challenges
  challengesCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  challengesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryBlue + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeDetails: {
    flex: 1,
  },
  challengeName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  challengeProgress: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  challengeReward: {
    alignItems: 'flex-end',
  },
  challengePoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.successGreen,
    marginBottom: 4,
  },

  // Redeem Button
  redeemButton: {
    backgroundColor: COLORS.successGreen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    shadowColor: COLORS.successGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  redeemButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  redeemButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
