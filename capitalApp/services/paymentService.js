// services/paymentService.js
// Este servicio maneja todas las operaciones de pagos y transferencias
// Tu compañera puede integrar el backend de Supabase aquí

import { supabase } from '../config/supabase';

/**
 * Obtiene las cuentas bancarias del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de cuentas bancarias
 */
export const getUserAccounts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    throw error;
  }
};

/**
 * Obtiene las tarjetas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de tarjetas
 */
export const getUserCards = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener tarjetas:', error);
    throw error;
  }
};

/**
 * Obtiene los préstamos activos del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de préstamos activos
 */
export const getUserLoans = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    throw error;
  }
};

/**
 * Obtiene las transacciones recientes del usuario
 * @param {string} userId - ID del usuario
 * @param {number} limit - Número máximo de transacciones a obtener
 * @returns {Promise<Array>} Lista de transacciones
 */
export const getRecentTransactions = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        account:bank_accounts(account_number, account_type),
        card:cards(card_number, card_type)
      `)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    throw error;
  }
};

/**
 * Realiza una transferencia entre cuentas
 * @param {Object} transferData - Datos de la transferencia
 * @param {string} transferData.fromAccountId - ID de cuenta origen
 * @param {string} transferData.toAccount - Cuenta destino (número o CLABE)
 * @param {number} transferData.amount - Monto a transferir
 * @param {string} transferData.description - Descripción/concepto
 * @param {string} transferData.userId - ID del usuario
 * @returns {Promise<Object>} Resultado de la transferencia
 */
export const makeTransfer = async (transferData) => {
  try {
    const { fromAccountId, toAccount, amount, description, userId } = transferData;

    // 1. Verificar saldo disponible
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('id', fromAccountId)
      .single();

    if (accountError) throw accountError;

    if (account.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // 2. Actualizar saldo de cuenta origen
    const { error: updateError } = await supabase
      .from('bank_accounts')
      .update({ 
        balance: account.balance - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', fromAccountId);

    if (updateError) throw updateError;

    // 3. Crear registro de transacción
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: fromAccountId,
        transaction_type: 'transfer_out',
        amount: amount,
        balance_after: account.balance - amount,
        description: description || 'Transferencia',
        category: 'transfer',
        merchant_name: toAccount,
        status: 'completed',
        transaction_date: new Date().toISOString()
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    return {
      success: true,
      transaction,
      message: 'Transferencia realizada exitosamente'
    };
  } catch (error) {
    console.error('Error al realizar transferencia:', error);
    throw error;
  }
};

/**
 * Realiza un pago a tarjeta de crédito
 * @param {Object} paymentData - Datos del pago
 * @param {string} paymentData.cardId - ID de la tarjeta
 * @param {string} paymentData.fromAccountId - ID de cuenta origen
 * @param {number} paymentData.amount - Monto a pagar
 * @param {string} paymentData.userId - ID del usuario
 * @returns {Promise<Object>} Resultado del pago
 */
export const payCard = async (paymentData) => {
  try {
    const { cardId, fromAccountId, amount, userId } = paymentData;

    // 1. Verificar saldo de cuenta
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('id', fromAccountId)
      .single();

    if (accountError) throw accountError;

    if (account.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // 2. Obtener información de la tarjeta
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('available_credit, credit_limit, card_type')
      .eq('id', cardId)
      .single();

    if (cardError) throw cardError;

    // 3. Actualizar crédito disponible de la tarjeta
    const newAvailableCredit = Math.min(
      (card.available_credit || 0) + amount,
      card.credit_limit || 0
    );

    const { error: cardUpdateError } = await supabase
      .from('cards')
      .update({ 
        available_credit: newAvailableCredit,
        updated_at: new Date().toISOString()
      })
      .eq('id', cardId);

    if (cardUpdateError) throw cardUpdateError;

    // 4. Actualizar saldo de cuenta
    const { error: accountUpdateError } = await supabase
      .from('bank_accounts')
      .update({ 
        balance: account.balance - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', fromAccountId);

    if (accountUpdateError) throw accountUpdateError;

    // 5. Registrar pago de tarjeta
    const { data: payment, error: paymentError } = await supabase
      .from('credit_card_payments')
      .insert({
        card_id: cardId,
        amount: amount,
        payment_date: new Date().toISOString(),
        due_date: new Date().toISOString(), // Ajustar según lógica de negocio
        is_on_time: true,
        payment_method: 'bank_account'
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // 6. Crear transacción
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: fromAccountId,
        card_id: cardId,
        transaction_type: 'payment',
        amount: amount,
        balance_after: account.balance - amount,
        description: `Pago de tarjeta ${card.card_type}`,
        category: 'payment',
        status: 'completed',
        transaction_date: new Date().toISOString()
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    return {
      success: true,
      payment,
      transaction,
      message: 'Pago de tarjeta realizado exitosamente'
    };
  } catch (error) {
    console.error('Error al pagar tarjeta:', error);
    throw error;
  }
};

/**
 * Realiza un pago a préstamo
 * @param {Object} paymentData - Datos del pago
 * @param {string} paymentData.loanId - ID del préstamo
 * @param {string} paymentData.fromAccountId - ID de cuenta origen
 * @param {number} paymentData.amount - Monto a pagar
 * @param {string} paymentData.userId - ID del usuario
 * @returns {Promise<Object>} Resultado del pago
 */
export const payLoan = async (paymentData) => {
  try {
    const { loanId, fromAccountId, amount, userId } = paymentData;

    // 1. Verificar saldo
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('id', fromAccountId)
      .single();

    if (accountError) throw accountError;

    if (account.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // 2. Obtener información del préstamo
    const { data: loan, error: loanError } = await supabase
      .from('loans')
      .select('*')
      .eq('id', loanId)
      .single();

    if (loanError) throw loanError;

    // 3. Calcular interés y principal (simplificado)
    const interestPaid = (loan.outstanding_balance * (loan.interest_rate / 100)) / 12;
    const principalPaid = amount - interestPaid;

    // 4. Actualizar saldo del préstamo
    const newBalance = Math.max(loan.outstanding_balance - principalPaid, 0);
    
    const { error: loanUpdateError } = await supabase
      .from('loans')
      .update({ 
        outstanding_balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', loanId);

    if (loanUpdateError) throw loanUpdateError;

    // 5. Actualizar cuenta
    const { error: accountUpdateError } = await supabase
      .from('bank_accounts')
      .update({ 
        balance: account.balance - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', fromAccountId);

    if (accountUpdateError) throw accountUpdateError;

    // 6. Registrar pago de préstamo
    const { data: payment, error: paymentError } = await supabase
      .from('loan_payments')
      .insert({
        loan_id: loanId,
        payment_amount: amount,
        principal_paid: principalPaid,
        interest_paid: interestPaid,
        payment_date: new Date().toISOString(),
        due_date: loan.next_payment_date,
        is_on_time: true
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // 7. Crear transacción
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: fromAccountId,
        transaction_type: 'loan_payment',
        amount: amount,
        balance_after: account.balance - amount,
        description: `Pago de préstamo ${loan.loan_type}`,
        category: 'loan',
        status: 'completed',
        transaction_date: new Date().toISOString()
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    return {
      success: true,
      payment,
      transaction,
      message: 'Pago de préstamo realizado exitosamente'
    };
  } catch (error) {
    console.error('Error al pagar préstamo:', error);
    throw error;
  }
};

/**
 * Obtiene las suscripciones activas del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de suscripciones
 */
export const getActiveSubscriptions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('next_billing_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
    throw error;
  }
};

/**
 * Programa un pago automático (para suscripciones o pagos recurrentes)
 * @param {Object} scheduleData - Datos del pago programado
 * @returns {Promise<Object>} Resultado de la programación
 */
export const schedulePayment = async (scheduleData) => {
  try {
    // TODO: Implementar lógica de pagos programados
    // Esto podría ser una nueva tabla o usar el sistema de suscripciones
    return {
      success: true,
      message: 'Pago programado exitosamente'
    };
  } catch (error) {
    console.error('Error al programar pago:', error);
    throw error;
  }
};

/**
 * Formatea las transacciones para mostrar en la UI
 * @param {Array} transactions - Lista de transacciones
 * @returns {Array} Transacciones formateadas
 */
export const formatTransactionsForUI = (transactions) => {
  return transactions.map(t => {
    const isIncoming = ['transfer_in', 'deposit', 'payroll'].includes(t.transaction_type);
    
    return {
      id: t.id,
      name: t.merchant_name || t.description || 'Transacción',
      date: formatTransactionDate(t.transaction_date),
      amount: t.amount,
      type: isIncoming ? 'incoming' : 'outgoing',
      status: t.status === 'completed' ? 'Completado' : 
              t.status === 'pending' ? 'Pendiente' : 
              'Cancelado',
      category: t.category,
      description: t.description
    };
  });
};

/**
 * Formatea una fecha de transacción
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
const formatTransactionDate = (dateString) => {
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
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }
};

/**
 * Valida que un monto sea válido para una transacción
 * @param {number} amount - Monto a validar
 * @param {number} availableBalance - Saldo disponible
 * @returns {Object} Resultado de la validación
 */
export const validateTransactionAmount = (amount, availableBalance) => {
  if (!amount || amount <= 0) {
    return { valid: false, error: 'El monto debe ser mayor a cero' };
  }

  if (amount > availableBalance) {
    return { valid: false, error: 'Saldo insuficiente' };
  }

  if (amount > 999999.99) {
    return { valid: false, error: 'El monto excede el límite permitido' };
  }

  return { valid: true };
};
