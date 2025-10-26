/**
 * Form Validation Utilities
 * 
 * Funciones de validación reutilizables para formularios
 */

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar contraseña segura
 * Requisitos: Al menos 8 caracteres, una mayúscula, una minúscula, un número
 * @param {string} password - Contraseña a validar
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must include an uppercase letter' };
  }

  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must include a lowercase letter' };
  }

  if (!hasNumber) {
    return { isValid: false, message: 'Password must include a number' };
  }

  return { isValid: true, message: 'Password is strong' };
};

/**
 * Validar número de teléfono (formato mexicano: 10 dígitos)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - true si es válido
 */
export const validatePhone = (phone) => {
  // Remover espacios y guiones
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Validar que el usuario sea mayor de edad (18+)
 * @param {Date} birthDate - Fecha de nacimiento
 * @returns {boolean} - true si es mayor de edad
 */
export const validateAge = (birthDate) => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

/**
 * Validar nombre (mínimo 2 caracteres, solo letras y espacios)
 * @param {string} name - Nombre a validar
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }

  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'Name can only contain letters' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validar dirección completa
 * @param {string} address - Dirección a validar
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return { isValid: false, message: 'Address is required' };
  }

  if (address.trim().length < 10) {
    return { isValid: false, message: 'Please enter a complete address' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validar monto de dinero
 * @param {string|number} amount - Monto a validar
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Please enter a valid amount' };
  }

  if (numAmount <= 0) {
    return { isValid: false, message: 'Amount must be greater than 0' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validar CLABE interbancaria (México - 18 dígitos)
 * @param {string} clabe - CLABE a validar
 * @returns {boolean} - true si es válida
 */
export const validateCLABE = (clabe) => {
  const clabeRegex = /^\d{18}$/;
  return clabeRegex.test(clabe);
};

/**
 * Validar tarjeta de crédito (Luhn algorithm)
 * @param {string} cardNumber - Número de tarjeta
 * @returns {boolean} - true si es válida
 */
export const validateCreditCard = (cardNumber) => {
  // Remover espacios y guiones
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Verificar que solo contenga dígitos y tenga longitud válida (13-19)
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }

  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validar CVV de tarjeta
 * @param {string} cvv - CVV a validar
 * @returns {boolean} - true si es válido
 */
export const validateCVV = (cvv) => {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

/**
 * Validar fecha de expiración de tarjeta (MM/YY)
 * @param {string} expiryDate - Fecha en formato MM/YY
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const validateExpiryDate = (expiryDate) => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
  if (!regex.test(expiryDate)) {
    return { isValid: false, message: 'Invalid format. Use MM/YY' };
  }

  const [month, year] = expiryDate.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, message: 'Card has expired' };
  }

  return { isValid: true, message: '' };
};

/**
 * Formatear número de teléfono (XXX XXX XXXX)
 * @param {string} phone - Teléfono sin formato
 * @returns {string} - Teléfono formateado
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

/**
 * Formatear número de tarjeta (XXXX XXXX XXXX XXXX)
 * @param {string} cardNumber - Número de tarjeta
 * @returns {string} - Número formateado
 */
export const formatCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
};

/**
 * Formatear monto de dinero ($X,XXX.XX)
 * @param {number|string} amount - Monto
 * @returns {string} - Monto formateado
 */
export const formatCurrency = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(num);
};
