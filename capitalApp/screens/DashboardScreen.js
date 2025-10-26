import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import {

  View,import {import {

  Text,

  StyleSheet,  View,  View,

  SafeAreaView,

  ScrollView,  Text,  Text,

  Image,

  TextInput,  StyleSheet,  StyleSheet,

  TouchableOpacity,

  StatusBar,  SafeAreaView,  SafeAreaView,

  Animated   

} from 'react-native';  ScrollView,  ScrollView,

import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

  Image,  Image,



// --- Colores de la App ---  TextInput,  TextInput,

const COLORS = {

  primaryBlue: '#004a77',  TouchableOpacity,  TouchableOpacity,

  lightGrayBg: '#f4f6f9',

  white: '#ffffff',  StatusBar,  StatusBar,

  darkText: '#222222',

  lightText: '#555555',  Animated     Animated   

  borderGray: '#e0e0e0',

  notificationGray: '#3f3f3f',} from 'react-native';} from 'react-native';

  chatBlue: '#0070c0',

  greenCheck: '#008000',import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

};



// --- 1. Cabecera Superior ---

const AppHeader = ({ navigation }) => (

  <View style={styles.header}>

    <TouchableOpacity>// --- Colores de la App ---// --- Colores de la App ---

      <Feather name="menu" size={24} color={COLORS.primaryBlue} />

    </TouchableOpacity>const COLORS = {const COLORS = {

   

    <Image  primaryBlue: '#004a77', // Azul principal (Chase/Capital One)  primaryBlue: '#004a77', // Azul principal (Chase/Capital One)

      source={require('../assets/splash-one.png')}

      style={styles.logo}  lightGrayBg: '#f4f6f9', // Fondo de la pantalla  lightGrayBg: '#f4f6f9', // Fondo de la pantalla

      resizeMode="contain"

    />  white: '#ffffff',  white: '#ffffff',

    <TouchableOpacity onPress={() => navigation.navigate('Más')}>

      <Feather name="user" size={24} color={COLORS.primaryBlue} />  darkText: '#222222',  darkText: '#222222',

    </TouchableOpacity>

  </View>  lightText: '#555555',  lightText: '#555555',

);

  borderGray: '#e0e0e0',  borderGray: '#e0e0e0',

// --- 2. Banner de Notificación ---

const NotificationBanner = ({ navigation }) => {  notificationGray: '#3f3f3f',  notificationGray: '#3f3f3f',

  const [isVisible, setIsVisible] = useState(true);

  const fadeAnim = React.useRef(new Animated.Value(1)).current;  chatBlue: '#0070c0',  chatBlue: '#0070c0',



  useEffect(() => {  greenCheck: '#008000',  greenCheck: '#008000',

    const timer = setTimeout(() => {

      Animated.timing(fadeAnim, {};};

        toValue: 0,

        duration: 800,

        useNativeDriver: true,

      }).start(() => {// --- 1. Cabecera Superior ---// --- 1. Cabecera Superior ---

        setIsVisible(false);

      });const AppHeader = ({ navigation }) => (const AppHeader = ({ navigation }) => (

    }, 1000);

  <View style={styles.header}>  <View style={styles.header}>

    return () => clearTimeout(timer);

  }, []);    <TouchableOpacity>    <TouchableOpacity>



  if (!isVisible) return null;      <Feather name="menu" size={24} color={COLORS.primaryBlue} />      <Feather name="menu" size={24} color={COLORS.primaryBlue} />



  return (    </TouchableOpacity>    </TouchableOpacity>

    <Animated.View style={{ opacity: fadeAnim }}>

      <TouchableOpacity       

        style={styles.notificationBanner}

        onPress={() => navigation.navigate('NotificationDetails')}    <Image    <Image

      >

        <Ionicons name="information-circle" size={20} color={COLORS.white} style={{ marginRight: 10 }} />      source={require('../assets/splash-one.png')}      source={require('../assets/splash-one.png')}

        <View style={{ flex: 1 }}>

          <Text style={styles.notificationText}>¿Te afectó el cierre del gobierno?</Text>      style={styles.logo}      style={styles.logo}

          <Text style={styles.notificationSubText}>Quizás podamos ayudar. Ver detalles</Text>

        </View>      resizeMode="contain"      resizeMode="contain"

        <Ionicons name="chevron-forward" size={20} color={COLORS.white} />

      </TouchableOpacity>    />    />

    </Animated.View>

  );    <TouchableOpacity onPress={() => navigation.navigate('Más')}>    <TouchableOpacity onPress={() => navigation.navigate('Más')}>

};

      <Feather name="user" size={24} color={COLORS.primaryBlue} />      <Feather name="user" size={24} color={COLORS.primaryBlue} />

// --- 3. Barra de Búsqueda y Chat ---

const SearchAndChat = ({ navigation }) => (    </TouchableOpacity>    </TouchableOpacity>

  <View style={styles.searchChatContainer}>

    <TouchableOpacity   </View>  </View>

      style={styles.searchBar}

      onPress={() => navigation.navigate('TransactionSearch')}););

    >

      <Ionicons name="search-outline" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />

      <Text style={{ flex: 1, color: COLORS.lightText }}>What are you looking for?</Text>

    </TouchableOpacity>// --- 2. Banner de Notificación ---// --- 2. Banner de Notificación ---

    <TouchableOpacity 

      style={styles.chatButton}const NotificationBanner = ({ navigation }) => {const NotificationBanner = ({ navigation }) => {

      onPress={() => navigation.navigate('SupportChat')}

    >  const [isVisible, setIsVisible] = useState(true);  const [isVisible, setIsVisible] = useState(true);

      <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.white} />

    </TouchableOpacity>  const fadeAnim = React.useRef(new Animated.Value(1)).current;  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  </View>

);



// --- 4. Acciones Rápidas ---  useEffect(() => {  useEffect(() => {

const QuickActions = ({ navigation }) => (

  <View style={styles.quickActionsContainer}>    const timer = setTimeout(() => {    const timer = setTimeout(() => {

    <TouchableOpacity style={styles.actionItem}>

      <Ionicons name="add-circle" size={32} color={COLORS.chatBlue} />      // Animación de fade-out suave      // Animación de fade-out suave

    </TouchableOpacity>

    <TouchableOpacity style={styles.actionItem}>      Animated.timing(fadeAnim, {      Animated.timing(fadeAnim, {

      <Text style={styles.actionText}>Enviar</Text>

    </TouchableOpacity>        toValue: 0,        toValue: 0,

    <TouchableOpacity style={styles.actionItem}>

      <Text style={styles.actionText}>Deposita cheques</Text>        duration: 800,        duration: 800,

    </TouchableOpacity>

    <TouchableOpacity         useNativeDriver: true,        useNativeDriver: true,

      style={styles.actionItem}

      onPress={() => navigation.navigate('Paga y transfiere')}      }).start(() => {      }).start(() => {

    >

      <Text style={styles.actionText}>Paga</Text>        setIsVisible(false);        setIsVisible(false);

    </TouchableOpacity>

  </View>      });      });

);

    }, 1000);    }, 1000);

// --- 5. Tarjeta de Cuenta Bancaria ---

const AccountCard = ({ navigation }) => (

  <TouchableOpacity 

    style={styles.cardBlue}    return () => clearTimeout(timer);    return () => clearTimeout(timer);

    onPress={() => navigation.navigate('AccountDetail')}

  >  }, []);  }, []);

    <Text style={styles.cardTypeTitle}>Cuentas bancarias (1)</Text>

    <Text style={styles.cardAccountName}>CAPITAL ONE COLLEGE (...3882) ›</Text>

    <Text style={styles.balanceBlue}>$1,500.10</Text>

    <Text style={styles.balanceLabelBlue}>Saldo disponible</Text>  if (!isVisible) return null;  if (!isVisible) return null;

  </TouchableOpacity>

);



// --- 6. Tarjeta de Crédito ---  return (  return (

const CreditCard = ({ navigation }) => (

  <TouchableOpacity     <Animated.View style={{ opacity: fadeAnim }}>    <Animated.View style={{ opacity: fadeAnim }}>

    style={styles.cardWhite}

    onPress={() => navigation.navigate('CreditCardDetail')}      <TouchableOpacity       <TouchableOpacity 

  >

    <Text style={styles.cardTypeTitleDark}>Tarjetas de crédito (1)</Text>        style={styles.notificationBanner}        style={styles.notificationBanner}

    <Text style={styles.cardAccountNameDark}>Freedom Student (...7081) ›</Text>

            onPress={() => navigation.navigate('NotificationDetails')}        onPress={() => navigation.navigate('NotificationDetails')}

    <View style={styles.miniCard}>

      <Text style={styles.miniCardText}>Freedom</Text>      >      >

      <Text style={styles.miniCardText}>VISA</Text>

    </View>        <Ionicons name="information-circle" size={20} color={COLORS.white} style={{ marginRight: 10 }} />        <Ionicons name="information-circle" size={20} color={COLORS.white} style={{ marginRight: 10 }} />



    <Text style={styles.balanceWhite}>$0.00</Text>        <View style={{ flex: 1 }}>        <View style={{ flex: 1 }}>

    <Text style={styles.balanceLabelWhite}>Saldo actual</Text>

          <Text style={styles.notificationText}>¿Te afectó el cierre del gobierno?</Text>          <Text style={styles.notificationText}>¿Te afectó el cierre del gobierno?</Text>

    <View style={styles.paymentInfo}>

      <Ionicons name="checkmark-circle" size={20} color={COLORS.greenCheck} style={{ marginRight: 8 }} />          <Text style={styles.notificationSubText}>Quizás podamos ayudar. Ver detalles</Text>          <Text style={styles.notificationSubText}>Quizás podamos ayudar. Ver detalles</Text>

      <Text style={styles.paymentText}>

        Has programado tu pago automático para nov 20, 2025.        </View>        </View>

      </Text>

    </View>        <Ionicons name="chevron-forward" size={20} color={COLORS.white} />        <Ionicons name="chevron-forward" size={20} color={COLORS.white} />

  </TouchableOpacity>

);      </TouchableOpacity>      </TouchableOpacity>



// --- Componente Principal de la Pantalla ---    </Animated.View>    </Animated.View>

export default function DashboardScreen({ navigation }) {

  return (  );  );

    <SafeAreaView style={styles.safeArea}>

      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />};};

      <AppHeader navigation={navigation} />

      

      <ScrollView 

        style={styles.container}// --- 3. Barra de Búsqueda y Chat ---// --- 3. Barra de Búsqueda y Chat ---

        contentContainerStyle={styles.scrollContent}

        showsVerticalScrollIndicator={false}const SearchAndChat = ({ navigation }) => (const SearchAndChat = ({ navigation }) => (

      >

        <NotificationBanner navigation={navigation} />  <View style={styles.searchChatContainer}>  <View style={styles.searchChatContainer}>

        <SearchAndChat navigation={navigation} />

        <QuickActions navigation={navigation} />    <TouchableOpacity     <TouchableOpacity 



        <View style={styles.sectionHeader}>      style={styles.searchBar}      style={styles.searchBar}

          <Text style={styles.sectionTitle}>Cuentas</Text>

          <TouchableOpacity>      onPress={() => navigation.navigate('TransactionSearch')}      onPress={() => navigation.navigate('TransactionSearch')}

            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.primaryBlue} />

          </TouchableOpacity>    >    >

        </View>

      <Ionicons name="search-outline" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />      <Ionicons name="search-outline" size={20} color={COLORS.lightText} style={{ marginRight: 10 }} />

        <AccountCard navigation={navigation} />

        <CreditCard navigation={navigation} />      <Text style={{ flex: 1, color: COLORS.lightText }}>What are you looking for?</Text>      <Text style={{ flex: 1, color: COLORS.lightText }}>What are you looking for?</Text>



        <View style={{ height: 20 }} />    </TouchableOpacity>    </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>    <TouchableOpacity     <TouchableOpacity 

  );

}      style={styles.chatButton}      style={styles.chatButton}



const styles = StyleSheet.create({      onPress={() => navigation.navigate('SupportChat')}      onPress={() => navigation.navigate('SupportChat')}

  safeArea: {

    flex: 1,    >    >

    backgroundColor: COLORS.white,

  },      <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.white} />      <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.white} />

  container: {

    flex: 1,    </TouchableOpacity>    </TouchableOpacity>

    backgroundColor: COLORS.lightGrayBg,

  },  </View>  </View>

  header: {

    flexDirection: 'row',););

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingHorizontal: 16,

    paddingVertical: 10,// --- 4. Acciones Rápidas ---<<<<<<< HEAD

    backgroundColor: COLORS.white,

    borderBottomWidth: 1,const QuickActions = ({ navigation }) => (// --- 4. Acciones Rápidas ---

    borderBottomColor: COLORS.borderGray,

  },  <View style={styles.quickActionsContainer}>const QuickActions = ({ navigation }) => (

  logo: {

    width: 150,    <TouchableOpacity style={styles.actionItem}>  <View style={styles.quickActionsContainer}>

    height: 25,

  },      <Ionicons name="add-circle" size={32} color={COLORS.chatBlue} />    <TouchableOpacity style={styles.actionItem}>

  notificationBanner: {

    flexDirection: 'row',    </TouchableOpacity>      <Ionicons name="add-circle" size={32} color={COLORS.chatBlue} />

    alignItems: 'center',

    backgroundColor: COLORS.notificationGray,    <TouchableOpacity style={styles.actionItem}>    </TouchableOpacity>

    padding: 16,

    margin: 16,      <Text style={styles.actionText}>Enviar</Text>    <TouchableOpacity style={styles.actionItem}>

    borderRadius: 8,

  },    </TouchableOpacity>      <Text style={styles.actionText}>Enviar</Text>

  notificationText: {

    color: COLORS.white,    <TouchableOpacity style={styles.actionItem}>    </TouchableOpacity>

    fontWeight: 'bold',

  },      <Text style={styles.actionText}>Deposita cheques</Text>    <TouchableOpacity style={styles.actionItem}>

  notificationSubText: {

    color: COLORS.white,    </TouchableOpacity>      <Text style={styles.actionText}>Deposita cheques</Text>

    fontSize: 12,

  },    <TouchableOpacity     </TouchableOpacity>

  searchChatContainer: {

    flexDirection: 'row',      style={styles.actionItem}    <TouchableOpacity 

    alignItems: 'center',

    paddingHorizontal: 16,      onPress={() => navigation.navigate('Paga y transfiere')}      style={styles.actionItem}

    marginBottom: 16,

    marginTop: 13,    >      onPress={() => navigation.navigate('Paga y transfiere')}

  },

  searchBar: {      <Text style={styles.actionText}>Paga</Text>    >

    flex: 1,

    flexDirection: 'row',    </TouchableOpacity>      <Text style={styles.actionText}>Paga</Text>

    alignItems: 'center',

    backgroundColor: COLORS.white,  </View>    </TouchableOpacity>

    borderRadius: 25,

    paddingHorizontal: 16,);  </View>

    paddingVertical: 12,

    borderWidth: 1,);

    borderColor: COLORS.borderGray,

  },// --- 5. Tarjeta de Cuenta Bancaria ---

  chatButton: {

    backgroundColor: COLORS.chatBlue,const AccountCard = ({ navigation }) => (=======

    borderRadius: 25,

    padding: 10,  <TouchableOpacity >>>>>>> 9e6214a766860497ca33b20603d8cc490307a35b

    marginLeft: 12,

  },    style={styles.cardBlue}// --- 5. Tarjeta de Cuenta Bancaria ---

  quickActionsContainer: {

    flexDirection: 'row',    onPress={() => navigation.navigate('AccountDetail')}const AccountCard = ({ navigation }) => (

    justifyContent: 'space-around',

    alignItems: 'center',  >  <TouchableOpacity 

    paddingHorizontal: 16,

    marginBottom: 24,    <Text style={styles.cardTypeTitle}>Cuentas bancarias (1)</Text>    style={styles.cardBlue}

  },

  actionItem: {    <Text style={styles.cardAccountName}>CAPITAL ONE COLLEGE (...3882) ›</Text>    onPress={() => navigation.navigate('AccountDetail')}

    alignItems: 'center',

  },    <Text style={styles.balanceBlue}>$1,500.10</Text>  >

  actionText: {

    fontSize: 12,    <Text style={styles.balanceLabelBlue}>Saldo disponible</Text>    <Text style={styles.cardTypeTitle}>Cuentas bancarias (1)</Text>

    color: COLORS.darkText,

    marginTop: 8,  </TouchableOpacity>    <Text style={styles.cardAccountName}>CAPITAL ONE COLLEGE (...3882) ›</Text>

    textAlign: 'center',

  },);    <Text style={styles.balanceBlue}>$1,500.10</Text>

  sectionHeader: {

    flexDirection: 'row',    <Text style={styles.balanceLabelBlue}>Saldo disponible</Text>

    justifyContent: 'space-between',

    alignItems: 'center',// --- 6. Tarjeta de Crédito ---  </TouchableOpacity>

    paddingHorizontal: 16,

    marginBottom: 12,const CreditCard = ({ navigation }) => ();

  },

  sectionTitle: {  <TouchableOpacity 

    fontSize: 20,

    fontWeight: 'bold',    style={styles.cardWhite}// --- 6. Tarjeta de Crédito ---

    color: COLORS.darkText,

  },    onPress={() => navigation.navigate('CreditCardDetail')}const CreditCard = ({ navigation }) => (

  cardBlue: {

    backgroundColor: COLORS.primaryBlue,  >  <TouchableOpacity 

    borderRadius: 16,

    padding: 20,    <Text style={styles.cardTypeTitleDark}>Tarjetas de crédito (1)</Text>    style={styles.cardWhite}

    marginHorizontal: 16,

    marginBottom: 16,    <Text style={styles.cardAccountNameDark}>Freedom Student (...7081) ›</Text>    onPress={() => navigation.navigate('CreditCardDetail')}

  },

  cardTypeTitle: {      >

    color: COLORS.white,

    fontSize: 14,    {/* Miniatura de la tarjeta */}    <Text style={styles.cardTypeTitleDark}>Tarjetas de crédito (1)</Text>

    marginBottom: 8,

  },    <View style={styles.miniCard}>    <Text style={styles.cardAccountNameDark}>Freedom Student (...7081) ›</Text>

  cardAccountName: {

    color: COLORS.white,      <Text style={styles.miniCardText}>Freedom</Text>    

    fontSize: 16,

    fontWeight: 'bold',      <Text style={styles.miniCardText}>VISA</Text>    {/* Miniatura de la tarjeta */}

    marginBottom: 16,

  },    </View>    <View style={styles.miniCard}>

  balanceBlue: {

    color: COLORS.white,      <Text style={styles.miniCardText}>Freedom</Text>

    fontSize: 28,

    fontWeight: 'bold',    <Text style={styles.balanceWhite}>$0.00</Text>      <Text style={styles.miniCardText}>VISA</Text>

  },

  balanceLabelBlue: {    <Text style={styles.balanceLabelWhite}>Saldo actual</Text>    </View>

    color: COLORS.white,

    fontSize: 14,

  },

  cardWhite: {    <View style={styles.paymentInfo}>    <Text style={styles.balanceWhite}>$0.00</Text>

    backgroundColor: COLORS.white,

    borderRadius: 16,      <Ionicons name="checkmark-circle" size={20} color={COLORS.greenCheck} style={{ marginRight: 8 }} />    <Text style={styles.balanceLabelWhite}>Saldo actual</Text>

    padding: 20,

    marginHorizontal: 16,      <Text style={styles.paymentText}>

    marginBottom: 16,

    borderWidth: 1,        Has programado tu pago automático para nov 20, 2025.    <View style={styles.paymentInfo}>

    borderColor: COLORS.borderGray,

  },      </Text>      <Ionicons name="checkmark-circle" size={20} color={COLORS.greenCheck} style={{ marginRight: 8 }} />

  cardTypeTitleDark: {

    color: COLORS.darkText,    </View>      <Text style={styles.paymentText}>

    fontSize: 14,

    marginBottom: 8,  </TouchableOpacity>        Has programado tu pago automático para nov 20, 2025.

  },

  cardAccountNameDark: {);      </Text>

    color: COLORS.darkText,

    fontSize: 16,    </View>

    fontWeight: 'bold',

    marginBottom: 16,// --- Componente Principal de la Pantalla ---  </TouchableOpacity>

  },

  miniCard: {export default function DashboardScreen({ navigation }) {

    backgroundColor: COLORS.primaryBlue,

    borderRadius: 6,  return (  

    padding: 10,

    height: 50,    <SafeAreaView style={styles.safeArea}>  

    width: 80,

    justifyContent: 'space-between',      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />);

    marginBottom: 16,

  },      <AppHeader navigation={navigation} />

  miniCardText: {

    color: COLORS.white,      // --- Componente Principal de la Pantalla ---

    fontSize: 10,

    fontWeight: 'bold',      {/* El ScrollView permite que el contenido del medio sea deslizable */}export default function DashboardScreen({ navigation }) {

  },

  balanceWhite: {      <ScrollView   return (

    color: COLORS.darkText,

    fontSize: 28,        style={styles.container}    <SafeAreaView style={styles.safeArea}>

    fontWeight: 'bold',

  },        contentContainerStyle={styles.scrollContent}      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

  balanceLabelWhite: {

    color: COLORS.lightText,        showsVerticalScrollIndicator={false}      <AppHeader navigation={navigation} />

    fontSize: 14,

    marginBottom: 16,      >      

  },

  paymentInfo: {        <NotificationBanner navigation={navigation} />      {/* El ScrollView permite que el contenido del medio sea deslizable */}

    flexDirection: 'row',

    alignItems: 'center',        <SearchAndChat navigation={navigation} />      <ScrollView 

    borderTopWidth: 1,

    borderTopColor: COLORS.borderGray,        <QuickActions navigation={navigation} />        style={styles.container}

    paddingTop: 16,

  },        contentContainerStyle={styles.scrollContent}

  paymentText: {

    flex: 1,        {/* --- Sección de Cuentas --- */}        showsVerticalScrollIndicator={false}

    color: COLORS.darkText,

    fontSize: 13,        <View style={styles.sectionHeader}>      >

  },

  scrollContent: {          <Text style={styles.sectionTitle}>Cuentas</Text>        <NotificationBanner />

    paddingBottom: 16,

  },          <TouchableOpacity><<<<<<< HEAD

});

            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.primaryBlue} />        <SearchAndChat navigation={navigation} />

          </TouchableOpacity>        <QuickActions navigation={navigation} />

        </View>=======

        <SearchAndChat />

        <AccountCard navigation={navigation} />>>>>>>> 9e6214a766860497ca33b20603d8cc490307a35b

        <CreditCard navigation={navigation} />

        {/* --- Sección de Cuentas --- */}

        {/* Espacio adicional para evitar que el último elemento quede bajo el tab bar */}        <View style={styles.sectionHeader}>

        <View style={{ height: 20 }} />          <Text style={styles.sectionTitle}>Cuentas</Text>

      </ScrollView>          <TouchableOpacity>

    </SafeAreaView>            <Ionicons name="ellipsis-horizontal-circle-outline" size={24} color={COLORS.primaryBlue} />

  );          </TouchableOpacity>

}        </View>



// --- Hoja de Estilos ---        <AccountCard navigation={navigation} />

const styles = StyleSheet.create({        <CreditCard navigation={navigation} />

  safeArea: {

    flex: 1,        {/* Espacio adicional para evitar que el último elemento quede bajo el tab bar */}

    backgroundColor: COLORS.white, // Fondo blanco para el header y tabs        <View style={{ height: 20 }} />

  },      </ScrollView>

  container: {    </SafeAreaView>

    flex: 1,  );

    backgroundColor: COLORS.lightGrayBg, // Fondo gris claro para el contenido}

  },

  // Header// --- Hoja de Estilos ---

  header: {const styles = StyleSheet.create({

    flexDirection: 'row',  safeArea: {

    justifyContent: 'space-between',    flex: 1,

    alignItems: 'center',    backgroundColor: COLORS.white, // Fondo blanco para el header y tabs

    paddingHorizontal: 16,  },

    paddingVertical: 10,  container: {

    backgroundColor: COLORS.white,    flex: 1,

    borderBottomWidth: 1,    backgroundColor: COLORS.lightGrayBg, // Fondo gris claro para el contenido

    borderBottomColor: COLORS.borderGray,  },

  },  // Header

  logo: {  header: {

    width: 150,    flexDirection: 'row',

    height: 25,    justifyContent: 'space-between',

  },    alignItems: 'center',

  // Notification    paddingHorizontal: 16,

  notificationBanner: {    paddingVertical: 10,

    flexDirection: 'row',    backgroundColor: COLORS.white,

    alignItems: 'center',    borderBottomWidth: 1,

    backgroundColor: COLORS.notificationGray,    borderBottomColor: COLORS.borderGray,

    padding: 16,  },

    margin: 16,  logo: {

    borderRadius: 8,    width: 150,

  },    height: 25,

  notificationText: {  },

    color: COLORS.white,  // Notification

    fontWeight: 'bold',  notificationBanner: {

  },    flexDirection: 'row',

  notificationSubText: {    alignItems: 'center',

    color: COLORS.white,    backgroundColor: COLORS.notificationGray,

    fontSize: 12,    padding: 16,

  },    margin: 16,

  // Search & Chat    borderRadius: 8,

  searchChatContainer: {  },

    flexDirection: 'row',  notificationText: {

    alignItems: 'center',    color: COLORS.white,

    paddingHorizontal: 16,    fontWeight: 'bold',

    marginBottom: 16,  },

    marginTop: 13,  notificationSubText: {

  },    color: COLORS.white,

  searchBar: {    fontSize: 12,

    flex: 1,  },

    flexDirection: 'row',  // Search & Chat

    alignItems: 'center',  searchChatContainer: {

    backgroundColor: COLORS.white,    flexDirection: 'row',

    borderRadius: 25,    alignItems: 'center',

    paddingHorizontal: 16,    paddingHorizontal: 16,

    paddingVertical: 12,    marginBottom: 16,

    borderWidth: 1,    marginTop: 13,

    borderColor: COLORS.borderGray,  },

  },  searchBar: {

  chatButton: {    flex: 1,

    backgroundColor: COLORS.chatBlue,    flexDirection: 'row',

    borderRadius: 25,    alignItems: 'center',

    padding: 10,    backgroundColor: COLORS.white,

    marginLeft: 12,    borderRadius: 25,

  },    paddingHorizontal: 16,

  // Quick Actions    paddingVertical: 12,

  quickActionsContainer: {    borderWidth: 1,

    flexDirection: 'row',    borderColor: COLORS.borderGray,

    justifyContent: 'space-around',  },

    alignItems: 'center',  chatButton: {

    paddingHorizontal: 16,    backgroundColor: COLORS.chatBlue,

    marginBottom: 24,    borderRadius: 25,

  },    padding: 10,

  actionItem: {    marginLeft: 12,

    alignItems: 'center',  },

  },

  actionText: {  // Section Header

    fontSize: 12,  sectionHeader: {

    color: COLORS.darkText,    flexDirection: 'row',

    marginTop: 8,    justifyContent: 'space-between',

    textAlign: 'center',    alignItems: 'center',

  },    paddingHorizontal: 16,

  // Section Header    marginBottom: 12,

  sectionHeader: {  },

    flexDirection: 'row',  sectionTitle: {

    justifyContent: 'space-between',    fontSize: 20,

    alignItems: 'center',    fontWeight: 'bold',

    paddingHorizontal: 16,    color: COLORS.darkText,

    marginBottom: 12,  },

  },  // Card (Blue)

  sectionTitle: {  cardBlue: {

    fontSize: 20,    backgroundColor: COLORS.primaryBlue,

    fontWeight: 'bold',    borderRadius: 16,

    color: COLORS.darkText,    padding: 20,

  },    marginHorizontal: 16,

  // Card (Blue)    marginBottom: 16,

  cardBlue: {  },

    backgroundColor: COLORS.primaryBlue,  cardTypeTitle: {

    borderRadius: 16,    color: COLORS.white,

    padding: 20,    fontSize: 14,

    marginHorizontal: 16,    marginBottom: 8,

    marginBottom: 16,  },

  },  cardAccountName: {

  cardTypeTitle: {    color: COLORS.white,

    color: COLORS.white,    fontSize: 16,

    fontSize: 14,    fontWeight: 'bold',

    marginBottom: 8,    marginBottom: 16,

  },  },

  cardAccountName: {  balanceBlue: {

    color: COLORS.white,    color: COLORS.white,

    fontSize: 16,    fontSize: 28,

    fontWeight: 'bold',    fontWeight: 'bold',

    marginBottom: 16,  },

  },  balanceLabelBlue: {

  balanceBlue: {    color: COLORS.white,

    color: COLORS.white,    fontSize: 14,

    fontSize: 28,  },

    fontWeight: 'bold',  // Card (White)

  },  cardWhite: {

  balanceLabelBlue: {    backgroundColor: COLORS.white,

    color: COLORS.white,    borderRadius: 16,

    fontSize: 14,    padding: 20,

  },    marginHorizontal: 16,

  // Card (White)    marginBottom: 16,

  cardWhite: {    borderWidth: 1,

    backgroundColor: COLORS.white,    borderColor: COLORS.borderGray,

    borderRadius: 16,  },

    padding: 20,  cardTypeTitleDark: {

    marginHorizontal: 16,    color: COLORS.darkText,

    marginBottom: 16,    fontSize: 14,

    borderWidth: 1,    marginBottom: 8,

    borderColor: COLORS.borderGray,  },

  },  cardAccountNameDark: {

  cardTypeTitleDark: {    color: COLORS.darkText,

    color: COLORS.darkText,    fontSize: 16,

    fontSize: 14,    fontWeight: 'bold',

    marginBottom: 8,    marginBottom: 16,

  },  },

  cardAccountNameDark: {  miniCard: {

    color: COLORS.darkText,    backgroundColor: COLORS.primaryBlue,

    fontSize: 16,    borderRadius: 6,

    fontWeight: 'bold',    padding: 10,

    marginBottom: 16,    height: 50,

  },    width: 80,

  miniCard: {    justifyContent: 'space-between',

    backgroundColor: COLORS.primaryBlue,    marginBottom: 16,

    borderRadius: 6,  },

    padding: 10,  miniCardText: {

    height: 50,    color: COLORS.white,

    width: 80,    fontSize: 10,

    justifyContent: 'space-between',    fontWeight: 'bold',

    marginBottom: 16,  },

  },  balanceWhite: {

  miniCardText: {    color: COLORS.darkText,

    color: COLORS.white,    fontSize: 28,

    fontSize: 10,    fontWeight: 'bold',

    fontWeight: 'bold',  },

  },  balanceLabelWhite: {

  balanceWhite: {    color: COLORS.lightText,

    color: COLORS.darkText,    fontSize: 14,

    fontSize: 28,    marginBottom: 16,

    fontWeight: 'bold',  },

  },  paymentInfo: {

  balanceLabelWhite: {    flexDirection: 'row',

    color: COLORS.lightText,    alignItems: 'center',

    fontSize: 14,    borderTopWidth: 1,

    marginBottom: 16,    borderTopColor: COLORS.borderGray,

  },    paddingTop: 16,

  paymentInfo: {  },

    flexDirection: 'row',  paymentText: {

    alignItems: 'center',    flex: 1,

    borderTopWidth: 1,    color: COLORS.darkText,

    borderTopColor: COLORS.borderGray,    fontSize: 13,

    paddingTop: 16,  },

  },  scrollContent: {

  paymentText: {    paddingBottom: 16,

    flex: 1,  },

    color: COLORS.darkText,});
    fontSize: 13,
  },
  scrollContent: {
    paddingBottom: 16,
  },
});
