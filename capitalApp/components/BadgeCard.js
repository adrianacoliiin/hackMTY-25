import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primaryBlue: '#004a77',
  accentBlue: '#0070c0',
  successGreen: '#00a86b',
  warningOrange: '#ff8c00',
  goldBadge: '#FFD700',
  silverBadge: '#C0C0C0',
  bronzeBadge: '#CD7F32',
  white: '#ffffff',
  darkText: '#222222',
  lightText: '#666666',
  borderGray: '#e0e0e0',
  lightGrayBg: '#f4f6f9',
};

// Componente de Badge Ganado
export const EarnedBadge = ({ badge, onPress }) => {
  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'gold':
      case 'oro':
        return COLORS.goldBadge;
      case 'silver':
      case 'plata':
        return COLORS.silverBadge;
      case 'bronze':
      case 'bronce':
        return COLORS.bronzeBadge;
      default:
        return COLORS.accentBlue;
    }
  };

  const getIconName = (badgeName) => {
    const name = badgeName?.toLowerCase() || '';
    if (name.includes('ahorro') || name.includes('saving')) return 'piggy-bank';
    if (name.includes('pago') || name.includes('payment')) return 'cash-check';
    if (name.includes('transacci') || name.includes('transaction')) return 'swap-horizontal';
    if (name.includes('préstamo') || name.includes('loan')) return 'hand-coin';
    if (name.includes('inversión') || name.includes('investment')) return 'chart-line';
    if (name.includes('responsable')) return 'shield-check';
    if (name.includes('tiempo') || name.includes('puntual')) return 'clock-check';
    return 'trophy-variant';
  };

  const badgeColor = getBadgeColor(badge.badge_type);
  const iconName = getIconName(badge.badge_name);

  return (
    <TouchableOpacity style={styles.earnedBadge} onPress={onPress}>
      <View style={[styles.badgeIconContainer, { backgroundColor: badgeColor + '20' }]}>
        <MaterialCommunityIcons name={iconName} size={32} color={badgeColor} />
        {/* Shine effect */}
        <View style={styles.badgeShine} />
      </View>
      <Text style={styles.badgeName} numberOfLines={2}>
        {badge.badge_name}
      </Text>
      <Text style={styles.badgeDate}>
        {formatBadgeDate(badge.earned_at)}
      </Text>
    </TouchableOpacity>
  );
};

// Componente de Badge en Progreso
export const ProgressBadge = ({ badge, userPoints, onPress }) => {
  const progress = Math.min((userPoints / badge.points_required) * 100, 100);
  const pointsRemaining = Math.max(badge.points_required - userPoints, 0);

  const getIconName = (badgeName) => {
    const name = badgeName?.toLowerCase() || '';
    if (name.includes('ahorro') || name.includes('saving')) return 'piggy-bank';
    if (name.includes('pago') || name.includes('payment')) return 'cash-check';
    if (name.includes('transacci') || name.includes('transaction')) return 'swap-horizontal';
    if (name.includes('préstamo') || name.includes('loan')) return 'hand-coin';
    if (name.includes('inversión') || name.includes('investment')) return 'chart-line';
    if (name.includes('responsable')) return 'shield-check';
    if (name.includes('tiempo') || name.includes('puntual')) return 'clock-check';
    return 'trophy-variant';
  };

  return (
    <TouchableOpacity style={styles.progressBadge} onPress={onPress}>
      <View style={styles.progressBadgeHeader}>
        <View style={styles.lockedBadgeIcon}>
          <MaterialCommunityIcons 
            name={getIconName(badge.badge_name)} 
            size={28} 
            color={COLORS.lightText} 
          />
          <Ionicons 
            name="lock-closed" 
            size={14} 
            color={COLORS.lightText} 
            style={styles.lockIcon}
          />
        </View>
        <View style={styles.progressBadgeInfo}>
          <Text style={styles.progressBadgeName} numberOfLines={1}>
            {badge.badge_name}
          </Text>
          <Text style={styles.progressBadgePoints}>
            {pointsRemaining} puntos restantes
          </Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
    </TouchableOpacity>
  );
};

// Componente de Badge Bloqueado
export const LockedBadge = ({ badge, onPress }) => {
  const getIconName = (badgeName) => {
    const name = badgeName?.toLowerCase() || '';
    if (name.includes('ahorro') || name.includes('saving')) return 'piggy-bank';
    if (name.includes('pago') || name.includes('payment')) return 'cash-check';
    if (name.includes('transacci') || name.includes('transaction')) return 'swap-horizontal';
    if (name.includes('préstamo') || name.includes('loan')) return 'hand-coin';
    if (name.includes('inversión') || name.includes('investment')) return 'chart-line';
    if (name.includes('responsable')) return 'shield-check';
    if (name.includes('tiempo') || name.includes('puntual')) return 'clock-check';
    return 'trophy-variant';
  };

  return (
    <TouchableOpacity style={styles.lockedBadge} onPress={onPress}>
      <View style={styles.lockedBadgeIconContainer}>
        <MaterialCommunityIcons 
          name={getIconName(badge.badge_name)} 
          size={28} 
          color={COLORS.lightText} 
        />
        <Ionicons 
          name="lock-closed" 
          size={16} 
          color={COLORS.lightText} 
          style={styles.lockIconLarge}
        />
      </View>
      <Text style={styles.lockedBadgeName} numberOfLines={2}>
        {badge.badge_name}
      </Text>
      <Text style={styles.lockedBadgePoints}>
        {badge.points_required} pts
      </Text>
    </TouchableOpacity>
  );
};

// Helper function
const formatBadgeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

const styles = StyleSheet.create({
  // Earned Badge
  earnedBadge: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    position: 'relative',
  },
  badgeIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeShine: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    opacity: 0.3,
    borderRadius: 20,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  badgeDate: {
    fontSize: 10,
    color: COLORS.lightText,
    textAlign: 'center',
  },

  // Progress Badge
  progressBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  progressBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockedBadgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGrayBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  lockIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 2,
  },
  progressBadgeInfo: {
    flex: 1,
  },
  progressBadgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  progressBadgePoints: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accentBlue,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accentBlue,
    textAlign: 'right',
  },

  // Locked Badge
  lockedBadge: {
    width: '31%',
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    opacity: 0.6,
  },
  lockedBadgeIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  lockIconLarge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 4,
  },
  lockedBadgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  lockedBadgePoints: {
    fontSize: 10,
    color: COLORS.lightText,
    textAlign: 'center',
  },
});
