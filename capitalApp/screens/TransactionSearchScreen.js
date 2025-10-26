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
  redExpense: '#e74c3c',
  greenIncome: '#00a86b',
};

// Datos de ejemplo - en producción vendrían de Supabase
const ALL_TRANSACTIONS = [
  // Últimos 30 días
  { id: 1, name: 'Amazon', category: 'Compras', date: '26 Oct, 2025', amount: -89.99, account: 'Capital One College', icon: 'amazon', color: '#FF9900', type: 'expense' },
  { id: 2, name: 'Uber Eats', category: 'Restaurantes', date: '25 Oct, 2025', amount: -145.50, account: 'Freedom Student', icon: 'food', color: '#00A86B', type: 'expense' },
  { id: 3, name: 'Netflix', category: 'Entretenimiento', date: '24 Oct, 2025', amount: -199.00, account: 'Freedom Student', icon: 'netflix', color: '#E50914', type: 'expense' },
  { id: 4, name: 'Depósito directo', category: 'Ingresos', date: '22 Oct, 2025', amount: 2500.00, account: 'Capital One College', icon: 'cash', color: '#00A86B', type: 'income' },
  { id: 5, name: 'Walmart', category: 'Compras', date: '22 Oct, 2025', amount: -320.75, account: 'Freedom Student', icon: 'cart', color: '#0071CE', type: 'expense' },
  { id: 6, name: 'Starbucks', category: 'Restaurantes', date: '20 Oct, 2025', amount: -95.00, account: 'Freedom Student', icon: 'coffee', color: '#00704A', type: 'expense' },
  { id: 7, name: 'Transferencia a José', category: 'Transferencias', date: '19 Oct, 2025', amount: -500.00, account: 'Capital One College', icon: 'swap-horizontal', color: '#3498db', type: 'transfer' },
  { id: 8, name: 'Spotify', category: 'Entretenimiento', date: '18 Oct, 2025', amount: -115.00, account: 'Freedom Student', icon: 'musical-notes', color: '#1DB954', type: 'expense' },
  { id: 9, name: 'Oxxo', category: 'Compras', date: '17 Oct, 2025', amount: -45.50, account: 'Capital One College', icon: 'storefront', color: '#EC1C24', type: 'expense' },
  { id: 10, name: 'Uber', category: 'Transporte', date: '16 Oct, 2025', amount: -85.00, account: 'Capital One College', icon: 'car', color: '#000000', type: 'expense' },
  { id: 11, name: 'CFE Pago', category: 'Servicios', date: '15 Oct, 2025', amount: -450.00, account: 'Capital One College', icon: 'flash', color: '#00A859', type: 'expense' },
  { id: 12, name: 'Mercado Libre', category: 'Compras', date: '14 Oct, 2025', amount: -599.00, account: 'Freedom Student', icon: 'bag-handle', color: '#FFE600', type: 'expense' },
  { id: 13, name: 'Reembolso Amazon', category: 'Ingresos', date: '13 Oct, 2025', amount: 89.99, account: 'Freedom Student', icon: 'arrow-undo', color: '#FF9900', type: 'income' },
  { id: 14, name: 'Liverpool', category: 'Compras', date: '12 Oct, 2025', amount: -1250.00, account: 'Freedom Student', icon: 'shirt', color: '#E31E26', type: 'expense' },
  { id: 15, name: 'Cinépolis', category: 'Entretenimiento', date: '11 Oct, 2025', amount: -220.00, account: 'Capital One College', icon: 'film', color: '#1A1A1A', type: 'expense' },
  { id: 16, name: 'Farmacia Guadalajara', category: 'Salud', date: '10 Oct, 2025', amount: -185.50, account: 'Capital One College', icon: 'medical', color: '#00A859', type: 'expense' },
  { id: 17, name: 'iTunes', category: 'Entretenimiento', date: '9 Oct, 2025', amount: -99.00, account: 'Freedom Student', icon: 'logo-apple', color: '#000000', type: 'expense' },
  { id: 18, name: 'Gas Natural', category: 'Servicios', date: '8 Oct, 2025', amount: -320.00, account: 'Capital One College', icon: 'flame', color: '#FF6B00', type: 'expense' },
  { id: 19, name: 'Domino\'s Pizza', category: 'Restaurantes', date: '7 Oct, 2025', amount: -285.00, account: 'Capital One College', icon: 'pizza', color: '#0078AE', type: 'expense' },
  { id: 20, name: 'Transferencia recibida', category: 'Ingresos', date: '5 Oct, 2025', amount: 1000.00, account: 'Capital One College', icon: 'arrow-down', color: '#00A86B', type: 'income' },
];

// --- Header Component ---
const SearchHeader = ({ navigation, searchQuery, setSearchQuery, onClear }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
    <View style={styles.searchInputContainer}>
      <Ionicons name="search" size={20} color={COLORS.lightText} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar transacciones..."
        placeholderTextColor={COLORS.lightText}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={20} color={COLORS.lightText} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// --- Filter Chips ---
const FilterChips = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', label: 'Todas', icon: 'apps' },
    { id: 'income', label: 'Ingresos', icon: 'arrow-down' },
    { id: 'expense', label: 'Gastos', icon: 'arrow-up' },
    { id: 'transfer', label: 'Transferencias', icon: 'swap-horizontal' },
  ];

  return (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={activeFilter === filter.id ? COLORS.white : COLORS.primaryBlue}
            />
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter.id && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// --- Category Filter ---
const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    'Todas',
    'Compras',
    'Restaurantes',
    'Entretenimiento',
    'Servicios',
    'Transporte',
    'Salud',
    'Ingresos',
    'Transferencias',
  ];

  return (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>Categorías</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              activeCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                activeCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// --- Transaction Item ---
const TransactionItem = ({ transaction, onPress }) => {
  const isPositive = transaction.amount > 0;
  
  return (
    <TouchableOpacity style={styles.transactionItem} onPress={onPress}>
      <View style={[styles.transactionIcon, { backgroundColor: transaction.color + '15' }]}>
        <MaterialCommunityIcons name={transaction.icon} size={24} color={transaction.color} />
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName}>{transaction.name}</Text>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
      
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: isPositive ? COLORS.greenIncome : COLORS.darkText }]}>
          {isPositive ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </Text>
        <Text style={styles.transactionAccount}>{transaction.account}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Summary Card ---
const SummaryCard = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Ingresos</Text>
        <Text style={[styles.summaryAmount, { color: COLORS.greenIncome }]}>
          +${totalIncome.toLocaleString('es-MX')}
        </Text>
      </View>
      
      <View style={styles.summaryDivider} />
      
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Gastos</Text>
        <Text style={[styles.summaryAmount, { color: COLORS.redExpense }]}>
          -${totalExpense.toLocaleString('es-MX')}
        </Text>
      </View>
      
      <View style={styles.summaryDivider} />
      
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Balance</Text>
        <Text style={[styles.summaryAmount, { color: balance >= 0 ? COLORS.greenIncome : COLORS.redExpense }]}>
          ${balance.toLocaleString('es-MX')}
        </Text>
      </View>
    </View>
  );
};

// --- Empty State ---
const EmptyState = ({ searchQuery }) => (
  <View style={styles.emptyState}>
    <Ionicons name="search-outline" size={64} color={COLORS.borderGray} />
    <Text style={styles.emptyStateTitle}>No se encontraron resultados</Text>
    <Text style={styles.emptyStateText}>
      {searchQuery
        ? `No hay transacciones que coincidan con "${searchQuery}"`
        : 'No hay transacciones para mostrar'}
    </Text>
  </View>
);

// --- Main Component ---
export default function TransactionSearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Filtrar transacciones
  const filteredTransactions = ALL_TRANSACTIONS.filter(transaction => {
    // Filtro de búsqueda
    const matchesSearch = searchQuery === '' || 
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.account.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtro de tipo
    const matchesType = activeFilter === 'all' || transaction.type === activeFilter;

    // Filtro de categoría
    const matchesCategory = activeCategory === 'Todas' || transaction.category === activeCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleTransactionPress = (transaction) => {
    // Aquí se podría navegar a un detalle de transacción
    console.log('Transaction pressed:', transaction);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <SearchHeader
        navigation={navigation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClear={handleClearSearch}
      />
      
      <View style={styles.container}>
        <FilterChips activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        
        {filteredTransactions.length > 0 && (
          <SummaryCard transactions={filteredTransactions} />
        )}
        
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transacción' : 'transacciones'}
          </Text>
          <TouchableOpacity>
            <View style={styles.sortButton}>
              <Text style={styles.sortText}>Más reciente</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.primaryBlue} />
            </View>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          style={styles.transactionsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredTransactions.length > 0 ? (
            <>
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction)}
                />
              ))}
              <View style={{ height: 20 }} />
            </>
          ) : (
            <EmptyState searchQuery={searchQuery} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.darkText,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrayBg,
  },

  // Filters
  filtersContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrayBg,
    marginRight: 8,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryBlue,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },

  // Categories
  categoriesContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.lightText,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.lightGrayBg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  categoryChipActive: {
    backgroundColor: COLORS.accentBlue + '15',
    borderColor: COLORS.accentBlue,
  },
  categoryChipText: {
    fontSize: 13,
    color: COLORS.darkText,
  },
  categoryChipTextActive: {
    color: COLORS.accentBlue,
    fontWeight: '600',
  },

  // Summary Card
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.borderGray,
    marginHorizontal: 8,
  },

  // Results
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    color: COLORS.primaryBlue,
    fontWeight: '600',
  },

  // Transactions
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionAccount: {
    fontSize: 11,
    color: COLORS.lightText,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    lineHeight: 20,
  },
});
