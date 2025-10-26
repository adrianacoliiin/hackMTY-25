// services/benefitsService.js
// Servicio para manejar badges, puntos y beneficios
// Tu compañera puede integrar el backend de Supabase aquí

import { supabase } from '../config/supabase';

/**
 * Obtiene los puntos totales del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Información de puntos del usuario
 */
export const getUserPoints = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    return data || { total_points: 0, lifetime_points: 0 };
  } catch (error) {
    console.error('Error al obtener puntos:', error);
    throw error;
  }
};

/**
 * Obtiene todos los badges disponibles en el sistema
 * @returns {Promise<Array>} Lista de todos los badges
 */
export const getAllBadges = async () => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('points_required', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener badges:', error);
    throw error;
  }
};

/**
 * Obtiene los badges que el usuario ha ganado
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de badges ganados con información completa
 */
export const getUserEarnedBadges = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    
    // Flatten la estructura para facilitar el uso
    return (data || []).map(item => ({
      ...item.badge,
      user_badge_id: item.id,
      earned_at: item.earned_at,
      is_active: item.is_active
    }));
  } catch (error) {
    console.error('Error al obtener badges ganados:', error);
    throw error;
  }
};

/**
 * Obtiene badges que el usuario aún no ha ganado
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de badges disponibles
 */
export const getAvailableBadges = async (userId) => {
  try {
    // Obtener todos los badges
    const allBadges = await getAllBadges();
    
    // Obtener badges ganados
    const earnedBadges = await getUserEarnedBadges(userId);
    const earnedBadgeIds = earnedBadges.map(b => b.id);
    
    // Filtrar badges no ganados
    return allBadges.filter(badge => !earnedBadgeIds.includes(badge.id));
  } catch (error) {
    console.error('Error al obtener badges disponibles:', error);
    throw error;
  }
};

/**
 * Obtiene beneficios activos del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de beneficios activos
 */
export const getActiveBenefits = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('active_benefits')
      .select(`
        *,
        badge:badges(badge_name, icon_url)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('end_date', { ascending: true });

    if (error) throw error;
    
    // Flatten estructura y añadir badge_name
    return (data || []).map(item => ({
      ...item,
      badge_name: item.badge?.badge_name || null
    }));
  } catch (error) {
    console.error('Error al obtener beneficios activos:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de puntos del usuario
 * @param {string} userId - ID del usuario
 * @param {number} limit - Número máximo de registros
 * @returns {Promise<Array>} Historial de puntos
 */
export const getPointsHistory = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('points_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener historial de puntos:', error);
    throw error;
  }
};

/**
 * Otorga puntos al usuario por una acción específica
 * @param {Object} pointsData - Datos del otorgamiento de puntos
 * @param {string} pointsData.userId - ID del usuario
 * @param {number} pointsData.points - Puntos a otorgar
 * @param {string} pointsData.reason - Razón del otorgamiento
 * @param {string} pointsData.referenceType - Tipo de referencia (transaction, loan_payment, etc.)
 * @param {string} pointsData.referenceId - ID de la referencia
 * @returns {Promise<Object>} Resultado del otorgamiento
 */
export const awardPoints = async (pointsData) => {
  try {
    const { userId, points, reason, referenceType, referenceId } = pointsData;

    // 1. Obtener puntos actuales
    const currentPoints = await getUserPoints(userId);

    // 2. Actualizar puntos totales y lifetime
    const { error: updateError } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        total_points: (currentPoints.total_points || 0) + points,
        lifetime_points: (currentPoints.lifetime_points || 0) + points,
        updated_at: new Date().toISOString()
      });

    if (updateError) throw updateError;

    // 3. Registrar en historial
    const { data: history, error: historyError } = await supabase
      .from('points_history')
      .insert({
        user_id: userId,
        points_change: points,
        reason: reason,
        reference_type: referenceType,
        reference_id: referenceId
      })
      .select()
      .single();

    if (historyError) throw historyError;

    // 4. Verificar si el usuario ganó algún badge
    await checkAndAwardBadges(userId, (currentPoints.total_points || 0) + points);

    return {
      success: true,
      newTotal: (currentPoints.total_points || 0) + points,
      pointsAdded: points,
      history
    };
  } catch (error) {
    console.error('Error al otorgar puntos:', error);
    throw error;
  }
};

/**
 * Verifica si el usuario ganó nuevos badges basado en sus puntos
 * @param {string} userId - ID del usuario
 * @param {number} totalPoints - Total de puntos del usuario
 * @returns {Promise<Array>} Badges ganados en esta verificación
 */
export const checkAndAwardBadges = async (userId, totalPoints) => {
  try {
    // Obtener badges disponibles que el usuario puede ganar
    const availableBadges = await getAvailableBadges(userId);
    
    // Filtrar badges que el usuario ya cumplió requisitos
    const earnedBadges = availableBadges.filter(
      badge => badge.points_required && totalPoints >= badge.points_required
    );

    if (earnedBadges.length === 0) {
      return [];
    }

    // Otorgar badges al usuario
    const newUserBadges = [];
    for (const badge of earnedBadges) {
      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badge.id,
          is_active: true
        })
        .select()
        .single();

      if (!error && data) {
        newUserBadges.push({ ...badge, user_badge_id: data.id });

        // Si el badge otorga un beneficio, crear el beneficio activo
        if (badge.benefit_type && badge.benefit_value) {
          await createActiveBenefit({
            userId,
            badgeId: badge.id,
            benefitType: badge.benefit_type,
            benefitValue: badge.benefit_value
          });
        }
      }
    }

    return newUserBadges;
  } catch (error) {
    console.error('Error al verificar y otorgar badges:', error);
    throw error;
  }
};

/**
 * Crea un beneficio activo para el usuario
 * @param {Object} benefitData - Datos del beneficio
 * @returns {Promise<Object>} Beneficio creado
 */
export const createActiveBenefit = async (benefitData) => {
  try {
    const { userId, badgeId, benefitType, benefitValue, endDate } = benefitData;

    const { data, error } = await supabase
      .from('active_benefits')
      .insert({
        user_id: userId,
        badge_id: badgeId,
        benefit_type: benefitType,
        benefit_value: benefitValue,
        start_date: new Date().toISOString(),
        end_date: endDate || null,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al crear beneficio activo:', error);
    throw error;
  }
};

/**
 * Desactiva beneficios expirados
 * @param {string} userId - ID del usuario
 * @returns {Promise<number>} Número de beneficios desactivados
 */
export const deactivateExpiredBenefits = async (userId) => {
  try {
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from('active_benefits')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true)
      .not('end_date', 'is', null)
      .lt('end_date', today)
      .select();

    if (error) throw error;
    return (data || []).length;
  } catch (error) {
    console.error('Error al desactivar beneficios expirados:', error);
    throw error;
  }
};

/**
 * Formatea el historial de puntos para la UI
 * @param {Array} history - Historial de puntos
 * @returns {Array} Historial formateado
 */
export const formatPointsHistoryForUI = (history) => {
  return history.map(item => {
    const isPositive = item.points_change > 0;
    
    return {
      id: item.id,
      points: Math.abs(item.points_change),
      isPositive,
      reason: item.reason,
      date: formatPointsDate(item.created_at),
      icon: getReasonIcon(item.reason),
      color: isPositive ? '#00a86b' : '#ff8c00'
    };
  });
};

/**
 * Obtiene el icono apropiado según la razón de los puntos
 * @param {string} reason - Razón del cambio de puntos
 * @returns {string} Nombre del icono
 */
const getReasonIcon = (reason) => {
  const reasonLower = reason?.toLowerCase() || '';
  
  if (reasonLower.includes('pago') || reasonLower.includes('payment')) return 'cash';
  if (reasonLower.includes('transferencia') || reasonLower.includes('transfer')) return 'swap-horizontal';
  if (reasonLower.includes('ahorro') || reasonLower.includes('saving')) return 'piggy-bank';
  if (reasonLower.includes('préstamo') || reasonLower.includes('loan')) return 'hand-coin';
  if (reasonLower.includes('tiempo') || reasonLower.includes('puntual')) return 'clock-check';
  if (reasonLower.includes('badge') || reasonLower.includes('insignia')) return 'trophy-variant';
  if (reasonLower.includes('bonus') || reasonLower.includes('bono')) return 'gift';
  
  return 'star';
};

/**
 * Formatea una fecha para el historial de puntos
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
const formatPointsDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Hoy, ${date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday) {
    return `Ayer, ${date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }
};

/**
 * Calcula el nivel del usuario basado en puntos lifetime
 * @param {number} lifetimePoints - Puntos totales acumulados
 * @returns {Object} Información del nivel
 */
export const calculateUserLevel = (lifetimePoints) => {
  const levels = [
    { level: 1, name: 'Bronce', min: 0, max: 999, color: '#CD7F32' },
    { level: 2, name: 'Plata', min: 1000, max: 4999, color: '#C0C0C0' },
    { level: 3, name: 'Oro', min: 5000, max: 9999, color: '#FFD700' },
    { level: 4, name: 'Platino', min: 10000, max: 24999, color: '#E5E4E2' },
    { level: 5, name: 'Diamante', min: 25000, max: Infinity, color: '#B9F2FF' },
  ];

  const currentLevel = levels.find(l => lifetimePoints >= l.min && lifetimePoints <= l.max);
  const nextLevel = levels.find(l => l.level === (currentLevel?.level || 0) + 1);

  const progressToNext = nextLevel 
    ? ((lifetimePoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  return {
    ...currentLevel,
    nextLevel,
    progressToNext: Math.min(progressToNext, 100),
    pointsToNext: nextLevel ? nextLevel.min - lifetimePoints : 0
  };
};
