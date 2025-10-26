import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primaryBlue: '#004a77',
  accentBlue: '#0070c0',
  successGreen: '#00a86b',
  warningOrange: '#ff8c00',
  redAlert: '#dc3545',
  white: '#ffffff',
  darkText: '#222222',
  lightText: '#666666',
  borderGray: '#e0e0e0',
  lightGrayBg: '#f4f6f9',
};

// Componente de Beneficio Activo
export const BenefitCard = ({ benefit, onPress }) => {
  const getBenefitIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'cashback':
        return { name: 'cash-refund', library: 'MaterialCommunityIcons', color: COLORS.successGreen };
      case 'discount':
      case 'descuento':
        return { name: 'tag', library: 'Ionicons', color: COLORS.warningOrange };
      case 'interest_boost':
      case 'tasa_preferencial':
        return { name: 'trending-up', library: 'Ionicons', color: COLORS.accentBlue };
      case 'fee_waiver':
      case 'sin_comisiones':
        return { name: 'receipt-outline', library: 'Ionicons', color: COLORS.primaryBlue };
      default:
        return { name: 'gift', library: 'Ionicons', color: COLORS.accentBlue };
    }
  };

  const getBenefitTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'cashback':
        return 'Cashback';
      case 'discount':
      case 'descuento':
        return 'Descuento';
      case 'interest_boost':
      case 'tasa_preferencial':
        return 'Tasa Preferencial';
      case 'fee_waiver':
      case 'sin_comisiones':
        return 'Sin Comisiones';
      default:
        return 'Beneficio';
    }
  };

  const formatBenefitValue = (type, value) => {
    if (type?.toLowerCase() === 'cashback' || type?.toLowerCase() === 'discount' || type?.toLowerCase() === 'descuento') {
      return `${value}%`;
    }
    if (type?.toLowerCase() === 'interest_boost' || type?.toLowerCase() === 'tasa_preferencial') {
      return `+${value}%`;
    }
    return `$${value.toLocaleString('es-MX')}`;
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const icon = getBenefitIcon(benefit.benefit_type);
  const daysRemaining = getDaysRemaining(benefit.end_date);
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining !== null && daysRemaining <= 0;

  const IconComponent = icon.library === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;

  return (
    <TouchableOpacity 
      style={[
        styles.benefitCard, 
        isExpired && styles.benefitCardExpired
      ]} 
      onPress={onPress}
      disabled={isExpired}
    >
      <View style={styles.benefitHeader}>
        <View style={[styles.benefitIconContainer, { backgroundColor: icon.color + '15' }]}>
          <IconComponent name={icon.name} size={24} color={icon.color} />
        </View>
        <View style={styles.benefitInfo}>
          <Text style={styles.benefitType}>{getBenefitTypeLabel(benefit.benefit_type)}</Text>
          <Text style={styles.benefitValue}>
            {formatBenefitValue(benefit.benefit_type, benefit.benefit_value)}
          </Text>
        </View>
        {benefit.is_active && !isExpired && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Activo</Text>
          </View>
        )}
        {isExpired && (
          <View style={styles.expiredBadge}>
            <Text style={styles.expiredBadgeText}>Expirado</Text>
          </View>
        )}
      </View>

      {benefit.badge_name && (
        <View style={styles.benefitSource}>
          <MaterialCommunityIcons name="trophy-variant" size={14} color={COLORS.lightText} />
          <Text style={styles.benefitSourceText}>De: {benefit.badge_name}</Text>
        </View>
      )}

      {daysRemaining !== null && !isExpired && (
        <View style={styles.benefitExpiry}>
          <Ionicons 
            name="time-outline" 
            size={14} 
            color={isExpiringSoon ? COLORS.warningOrange : COLORS.lightText} 
          />
          <Text style={[
            styles.benefitExpiryText,
            isExpiringSoon && styles.benefitExpiryWarning
          ]}>
            {isExpiringSoon 
              ? `¡Expira en ${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'}!` 
              : `Válido por ${daysRemaining} días`
            }
          </Text>
        </View>
      )}

      {!benefit.end_date && benefit.is_active && (
        <View style={styles.benefitExpiry}>
          <Ionicons name="infinite" size={14} color={COLORS.successGreen} />
          <Text style={[styles.benefitExpiryText, { color: COLORS.successGreen }]}>
            Beneficio permanente
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  benefitCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  benefitCardExpired: {
    opacity: 0.5,
    backgroundColor: COLORS.lightGrayBg,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitType: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  benefitValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  activeBadge: {
    backgroundColor: COLORS.successGreen + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.successGreen,
  },
  expiredBadge: {
    backgroundColor: COLORS.redAlert + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.redAlert,
  },
  benefitSource: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  benefitSourceText: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  benefitExpiry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitExpiryText: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  benefitExpiryWarning: {
    color: COLORS.warningOrange,
    fontWeight: '600',
  },
});
