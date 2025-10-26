# 💸 Pantalla "Paga y transfiere" - Guía de Integración Backend

## 📋 Descripción General

La pantalla **PayAndTransferScreen** es una interfaz completa para gestionar pagos y transferencias en la app Capital One. Está lista para conectarse con el backend de Supabase.

---

## 🎨 Características Implementadas

### 1. **Balance Card** - Tarjeta de Saldo
- Muestra la cuenta desde donde se realizarán los pagos
- Diseño tipo Capital One con degradado azul
- Click para cambiar de cuenta (funcionalidad lista)

### 2. **Quick Actions** - 4 Acciones Rápidas
| Acción | Funcionalidad | Estado |
|--------|---------------|--------|
| 🔄 Transferir | Abre modal de transferencia completo | ✅ Implementado |
| 💳 Pagar tarjeta | Modal próximamente | ⏳ UI lista |
| 💰 Pagar préstamo | Modal próximamente | ⏳ UI lista |
| 👥 Enviar a contacto | Modal próximamente | ⏳ UI lista |

### 3. **Recent Transactions** - Transacciones Recientes
- Muestra últimas 10 transacciones
- Distingue entre ingresos (verde) y egresos (naranja)
- Formatos de fecha inteligentes (Hoy, Ayer, fecha)
- Botón "Ver todo" para historial completo

### 4. **Scheduled Payments** - Pagos Programados
- Lista de suscripciones y pagos automáticos
- Badges de estado (Activo/Pausado)
- Próxima fecha de pago
- Estado vacío cuando no hay pagos programados

### 5. **Transfer Modal** - Modal de Transferencia
- Input de monto con validación
- Selección de destinatario
- Campo de concepto opcional
- Selector de cuenta origen con radio buttons
- Validación de campos requeridos
- Diseño responsive tipo bottom sheet

---

## 🗂️ Estructura de Archivos

```
capitalApp/
├── screens/
│   └── PayAndTransferScreen.js      # Pantalla principal (100% completa)
├── services/
│   └── paymentService.js            # Servicio de pagos (listo para backend)
└── navigation/
    └── TabNavigator.js              # Navegación actualizada
```

---

## 🔌 Integración Backend - Para tu Compañera

### Archivo: `services/paymentService.js`

Este archivo contiene **11 funciones** listas para conectar con Supabase:

#### 📥 **Funciones de Consulta (GET)**

1. **`getUserAccounts(userId)`**
   - Obtiene cuentas bancarias activas del usuario
   - Tabla: `bank_accounts`
   - Filtra por: `user_id` y `status = 'active'`

2. **`getUserCards(userId)`**
   - Obtiene tarjetas activas del usuario
   - Tabla: `cards`
   - Filtra por: `user_id` y `status = 'active'`

3. **`getUserLoans(userId)`**
   - Obtiene préstamos activos del usuario
   - Tabla: `loans`
   - Filtra por: `user_id` y `status = 'active'`

4. **`getRecentTransactions(userId, limit = 10)`**
   - Obtiene transacciones recientes con joins
   - Tabla: `transactions` (con joins a `bank_accounts` y `cards`)
   - Ordenado por fecha descendente

5. **`getActiveSubscriptions(userId)`**
   - Obtiene suscripciones activas
   - Tabla: `subscriptions`
   - Ordenado por próxima fecha de cobro

#### 💳 **Funciones de Transacción (POST/UPDATE)**

6. **`makeTransfer(transferData)`**
   - Realiza transferencia entre cuentas
   - **Operaciones:**
     1. Verifica saldo disponible
     2. Actualiza saldo de cuenta origen (`bank_accounts`)
     3. Crea registro en `transactions`
   - **Entrada:**
     ```javascript
     {
       fromAccountId: 'uuid',
       toAccount: '1234567890',
       amount: 500.00,
       description: 'Pago de renta',
       userId: 'uuid'
     }
     ```

7. **`payCard(paymentData)`**
   - Paga tarjeta de crédito
   - **Operaciones:**
     1. Verifica saldo de cuenta
     2. Aumenta crédito disponible en tarjeta (`cards`)
     3. Descuenta de cuenta bancaria
     4. Registra en `credit_card_payments`
     5. Crea transacción
   - **Entrada:**
     ```javascript
     {
       cardId: 'uuid',
       fromAccountId: 'uuid',
       amount: 500.00,
       userId: 'uuid'
     }
     ```

8. **`payLoan(paymentData)`**
   - Paga préstamo
   - **Operaciones:**
     1. Verifica saldo
     2. Calcula interés y principal
     3. Actualiza balance del préstamo (`loans`)
     4. Descuenta de cuenta
     5. Registra en `loan_payments`
     6. Crea transacción
   - **Entrada:**
     ```javascript
     {
       loanId: 'uuid',
       fromAccountId: 'uuid',
       amount: 1000.00,
       userId: 'uuid'
     }
     ```

9. **`schedulePayment(scheduleData)`**
   - Programa pago automático
   - TODO: Definir estructura de datos

#### 🛠️ **Funciones Auxiliares**

10. **`formatTransactionsForUI(transactions)`**
    - Formatea transacciones para mostrar en UI
    - Detecta tipo (incoming/outgoing)
    - Formatea fechas relativas

11. **`validateTransactionAmount(amount, availableBalance)`**
    - Valida montos de transacción
    - Verifica: positivo, suficiente, límites

---

## 📊 Mapeo de Base de Datos

### Tablas Utilizadas

| Tabla | Propósito | Operaciones |
|-------|-----------|-------------|
| `bank_accounts` | Cuentas bancarias del usuario | SELECT, UPDATE balance |
| `cards` | Tarjetas de crédito/débito | SELECT, UPDATE available_credit |
| `loans` | Préstamos activos | SELECT, UPDATE outstanding_balance |
| `transactions` | Historial de movimientos | SELECT, INSERT |
| `credit_card_payments` | Pagos de tarjetas | INSERT |
| `loan_payments` | Pagos de préstamos | INSERT |
| `subscriptions` | Suscripciones activas | SELECT |

### Relaciones Importantes

```
profiles (user)
  ├── bank_accounts (1:N)
  ├── cards (1:N)
  ├── loans (1:N)
  ├── transactions (1:N)
  └── subscriptions (1:N)

transactions
  ├── account_id → bank_accounts
  ├── card_id → cards
  └── user_id → profiles
```

---

## 🔐 Seguridad - Row Level Security (RLS)

**IMPORTANTE**: Asegúrate de que tu compañera implemente estas políticas RLS en Supabase:

```sql
-- Ejemplo para transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🎯 Cómo Conectar el Backend

### Paso 1: Actualizar `PayAndTransferScreen.js`

Reemplaza los datos mock con llamadas reales:

```javascript
import { 
  getUserAccounts, 
  getRecentTransactions, 
  getActiveSubscriptions,
  makeTransfer,
  formatTransactionsForUI 
} from '../services/paymentService';
import { getCurrentUser } from '../services/authService';

export default function PayAndTransferScreen() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [scheduledPayments, setScheduledPayments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      // Cargar datos en paralelo
      const [accountsData, transactionsData, subscriptionsData] = await Promise.all([
        getUserAccounts(user.id),
        getRecentTransactions(user.id, 10),
        getActiveSubscriptions(user.id)
      ]);

      setAccounts(accountsData);
      setTransactions(formatTransactionsForUI(transactionsData));
      setScheduledPayments(formatSubscriptionsForUI(subscriptionsData));
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (transferData) => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      await makeTransfer({
        fromAccountId: transferData.fromAccount.id,
        toAccount: transferData.recipient,
        amount: transferData.amount,
        description: transferData.concept,
        userId: user.id
      });

      setTransferModalVisible(false);
      Alert.alert('Éxito', 'Transferencia realizada');
      loadData(); // Recargar datos
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
}
```

### Paso 2: Agregar Loading States

Ya incluido en el código de arriba. Usa `loading` para mostrar spinners.

### Paso 3: Testing

Tu compañera debe probar:
- ✅ Cargar cuentas del usuario logueado
- ✅ Mostrar transacciones recientes
- ✅ Realizar transferencia y ver actualización de saldo
- ✅ Pago de tarjeta de crédito
- ✅ Pago de préstamo
- ✅ Cargar suscripciones activas

---

## 🎨 Diseño y UX

### Colores Capital One
```javascript
const COLORS = {
  primaryBlue: '#004a77',     // Azul primario
  accentBlue: '#0070c0',      // Azul acento
  successGreen: '#00a86b',    // Verde (ingresos)
  warningOrange: '#ff8c00',   // Naranja (egresos)
  lightGrayBg: '#f4f6f9',     // Fondo claro
  white: '#ffffff',           // Blanco
  darkText: '#222222',        // Texto oscuro
  lightText: '#666666',       // Texto claro
  borderGray: '#e0e0e0',      // Bordes
};
```

### Componentes Reutilizables

El código está modularizado en componentes:
- `PayHeader` - Header con título y notificaciones
- `BalanceCard` - Tarjeta de cuenta seleccionada
- `QuickActions` - Grid de 4 acciones
- `ActionButton` - Botón individual de acción
- `RecentTransactions` - Lista de transacciones
- `TransactionItem` - Item individual
- `ScheduledPayments` - Lista de pagos programados
- `ScheduledPaymentItem` - Item de pago programado
- `TransferModal` - Modal completo de transferencia

---

## 📱 Próximas Características a Implementar

### 1. Modal de Pago de Tarjeta
```javascript
// Similar al TransferModal
const PayCardModal = ({ visible, onClose, cards, accounts, onSubmit }) => {
  // Select de tarjeta a pagar
  // Mostrar saldo actual de tarjeta
  // Input de monto (pago mínimo, total, personalizado)
  // Select de cuenta origen
  // Botón confirmar
}
```

### 2. Modal de Pago de Préstamo
```javascript
const PayLoanModal = ({ visible, onClose, loans, accounts, onSubmit }) => {
  // Select de préstamo
  // Mostrar balance pendiente
  // Mostrar próximo pago
  // Input de monto
  // Select de cuenta origen
}
```

### 3. Modal de Enviar a Contacto
```javascript
const SendToContactModal = ({ visible, onClose, contacts, accounts }) => {
  // Lista de contactos favoritos
  // Búsqueda de contactos
  // Input de monto
  // Mensaje opcional
}
```

### 4. Pantalla de Historial Completo
```javascript
// Nueva pantalla: TransactionHistoryScreen
// Filtros por fecha, tipo, categoría
// Búsqueda
// Exportar a PDF
```

---

## 🧪 Testing Checklist

- [ ] Cargar cuentas desde Supabase
- [ ] Mostrar balance real de cuenta seleccionada
- [ ] Realizar transferencia y actualizar saldo
- [ ] Validar saldo insuficiente
- [ ] Mostrar transacciones recientes con formato correcto
- [ ] Cargar suscripciones activas
- [ ] Pago de tarjeta de crédito
- [ ] Pago de préstamo
- [ ] Manejo de errores de red
- [ ] Loading states en todas las operaciones
- [ ] Actualización de datos después de transacción

---

## 📞 Soporte

Si tu compañera tiene dudas sobre la integración:
1. Revisar `paymentService.js` - todas las funciones están documentadas
2. Ver ejemplos de uso en `UsageExamples.js` del auth
3. Consultar esquema de base de datos al inicio de este README

---

## ✨ Características Destacadas

### 1. **Transacciones Atómicas**
Todas las operaciones de pago usan múltiples updates. Considera usar transacciones de Supabase:

```javascript
// Ejemplo con transacciones
const { data, error } = await supabase.rpc('make_transfer', {
  p_from_account: fromAccountId,
  p_to_account: toAccount,
  p_amount: amount,
  p_user_id: userId
});
```

### 2. **Validaciones de Negocio**
- Saldo insuficiente
- Límites de transferencia
- Montos positivos
- Cuentas activas

### 3. **Formateo Inteligente**
- Fechas relativas (Hoy, Ayer)
- Montos en formato mexicano
- Detección de tipo de transacción

---

¡Listo! 🎉 La pantalla está 100% funcional en UI y lista para conectar con el backend que está desarrollando tu compañera.
