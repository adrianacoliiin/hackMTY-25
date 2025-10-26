/**
 * Plan Monitoring Service
 * 
 * Servicio para gestionar:
 * - Metas de ahorro
 * - Préstamos activos
 * - Suscripciones
 * - Inversiones
 * - Presupuestos
 */

import { supabase } from '../config/supabase';

// ============= SAVINGS GOALS (Metas de Ahorro) =============

/**
 * Obtener todas las metas de ahorro del usuario
 */
export const getSavingsGoals = async (userId) => {
  try {
    if (!supabase) {
      // Datos de prueba si Supabase no está configurado
      return {
        success: true,
        data: [
          {
            id: '1',
            name: 'Maestro del Ahorro',
            icon: 'piggy-bank',
            currentAmount: 1900,
            targetAmount: 2500,
            progress: 76,
            deadline: 'Nov 20, 2025',
          },
        ],
      };
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calcular progreso para cada meta
    const goalsWithProgress = data.map(goal => ({
      ...goal,
      progress: Math.round((goal.current_amount / goal.target_amount) * 100),
    }));

    return { success: true, data: goalsWithProgress };
  } catch (error) {
    console.error('Error getting savings goals:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crear nueva meta de ahorro
 */
export const createSavingsGoal = async (userId, goalData) => {
  try {
    if (!supabase) {
      return { success: true, data: { id: Date.now().toString(), ...goalData, user_id: userId } };
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .insert([
        {
          user_id: userId,
          name: goalData.name,
          target_amount: goalData.targetAmount,
          current_amount: goalData.currentAmount || 0,
          icon: goalData.icon || 'piggy-bank',
          deadline: goalData.deadline,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating savings goal:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar monto de una meta de ahorro
 */
export const updateSavingsGoalAmount = async (goalId, newAmount) => {
  try {
    if (!supabase) {
      return { success: true };
    }

    const { data, error } = await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating savings goal amount:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Eliminar meta de ahorro
 */
export const deleteSavingsGoal = async (goalId) => {
  try {
    if (!supabase) {
      return { success: true };
    }

    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    return { success: false, error: error.message };
  }
};

// ============= ACTIVE LOANS (Préstamos Activos) =============

/**
 * Obtener todos los préstamos activos del usuario
 */
export const getActiveLoans = async (userId) => {
  try {
    if (!supabase) {
      return {
        success: true,
        data: [
          {
            id: '1',
            type: 'Préstamo Personal',
            balance: 15000,
            nextPayment: 500,
            nextPaymentDate: 'Nov 5, 2025',
            interestRate: 8.5,
            status: 'Al corriente',
            statusColor: '#00a86b',
          },
        ],
      };
    }

    const { data, error } = await supabase
      .from('active_loans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error getting active loans:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crear nuevo préstamo
 */
export const createLoan = async (userId, loanData) => {
  try {
    if (!supabase) {
      return { success: true, data: { id: Date.now().toString(), ...loanData, user_id: userId } };
    }

    const { data, error } = await supabase
      .from('active_loans')
      .insert([
        {
          user_id: userId,
          loan_type: loanData.type,
          balance: loanData.balance,
          original_amount: loanData.originalAmount,
          next_payment: loanData.nextPayment,
          next_payment_date: loanData.nextPaymentDate,
          interest_rate: loanData.interestRate,
          status: 'active',
          status_color: '#00a86b',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating loan:', error);
    return { success: false, error: error.message };
  }
};

// ============= SUBSCRIPTIONS (Suscripciones) =============

/**
 * Obtener todas las suscripciones del usuario
 */
export const getSubscriptions = async (userId) => {
  try {
    if (!supabase) {
      return {
        success: true,
        data: [
          {
            id: '1',
            name: 'Netflix',
            amount: 199,
            frequency: 'Mensual',
            nextBilling: 'Nov 1, 2025',
            icon: 'netflix',
            color: '#E50914',
          },
          {
            id: '2',
            name: 'Spotify',
            amount: 115,
            frequency: 'Mensual',
            nextBilling: 'Nov 15, 2025',
            icon: 'spotify',
            color: '#1DB954',
          },
        ],
      };
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('amount', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crear nueva suscripción
 */
export const createSubscription = async (userId, subscriptionData) => {
  try {
    if (!supabase) {
      return { success: true, data: { id: Date.now().toString(), ...subscriptionData, user_id: userId } };
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          name: subscriptionData.name,
          amount: subscriptionData.amount,
          frequency: subscriptionData.frequency,
          next_billing: subscriptionData.nextBilling,
          icon: subscriptionData.icon || 'apps',
          color: subscriptionData.color || '#0070c0',
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cancelar suscripción
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    if (!supabase) {
      return { success: true };
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return { success: false, error: error.message };
  }
};

// ============= INVESTMENTS (Inversiones) =============

/**
 * Obtener todas las inversiones del usuario
 */
export const getInvestments = async (userId) => {
  try {
    if (!supabase) {
      return {
        success: true,
        data: [
          {
            id: '1',
            name: 'Fondo de Inversión CETES',
            currentValue: 25000,
            profit: 1250,
            change: 5.26,
          },
          {
            id: '2',
            name: 'Acciones Tech',
            currentValue: 18500,
            profit: -450,
            change: -2.37,
          },
        ],
      };
    }

    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('current_value', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error getting investments:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crear nueva inversión
 */
export const createInvestment = async (userId, investmentData) => {
  try {
    if (!supabase) {
      return { success: true, data: { id: Date.now().toString(), ...investmentData, user_id: userId } };
    }

    const { data, error } = await supabase
      .from('investments')
      .insert([
        {
          user_id: userId,
          name: investmentData.name,
          investment_type: investmentData.type,
          current_value: investmentData.initialInvestment,
          initial_investment: investmentData.initialInvestment,
          profit_loss: 0,
          change_percentage: 0,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating investment:', error);
    return { success: false, error: error.message };
  }
};

// ============= BUDGETS (Presupuestos) =============

/**
 * Obtener todos los presupuestos del usuario
 */
export const getBudgets = async (userId) => {
  try {
    if (!supabase) {
      return {
        success: true,
        data: [
          {
            id: '1',
            category: 'Comida',
            limit: 3000,
            spent: 2450,
            period: 'Octubre 2025',
            icon: 'food',
          },
          {
            id: '2',
            category: 'Transporte',
            limit: 1500,
            spent: 890,
            period: 'Octubre 2025',
            icon: 'car',
          },
        ],
      };
    }

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error getting budgets:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crear nuevo presupuesto
 */
export const createBudget = async (userId, budgetData) => {
  try {
    if (!supabase) {
      return { success: true, data: { id: Date.now().toString(), ...budgetData, user_id: userId } };
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: userId,
          category: budgetData.category,
          limit_amount: budgetData.limit,
          spent_amount: budgetData.spent || 0,
          period: budgetData.period,
          icon: budgetData.icon || 'wallet',
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error creating budget:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar gasto de un presupuesto
 */
export const updateBudgetSpent = async (budgetId, newSpent) => {
  try {
    if (!supabase) {
      return { success: true };
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({ spent_amount: newSpent })
      .eq('id', budgetId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error updating budget spent:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Eliminar presupuesto
 */
export const deleteBudget = async (budgetId) => {
  try {
    if (!supabase) {
      return { success: true };
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', budgetId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting budget:', error);
    return { success: false, error: error.message };
  }
};

// ============= UTILIDADES =============

/**
 * Obtener resumen completo de planificación
 */
export const getPlanningOverview = async (userId) => {
  try {
    const [goals, loans, subscriptions, investments, budgets] = await Promise.all([
      getSavingsGoals(userId),
      getActiveLoans(userId),
      getSubscriptions(userId),
      getInvestments(userId),
      getBudgets(userId),
    ]);

    return {
      success: true,
      data: {
        savingsGoals: goals.data || [],
        activeLoans: loans.data || [],
        subscriptions: subscriptions.data || [],
        investments: investments.data || [],
        budgets: budgets.data || [],
      },
    };
  } catch (error) {
    console.error('Error getting planning overview:', error);
    return { success: false, error: error.message };
  }
};
