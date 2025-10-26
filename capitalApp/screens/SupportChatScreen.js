import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
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
  accentBlue: '#0070c0',
  chatBubbleUser: '#0070c0',
  chatBubbleBot: '#f0f0f0',
};

// Base de conocimiento del bot
const BOT_RESPONSES = {
  'saldo': {
    text: 'Para consultar tu saldo, ve a la sección "Cuentas" en el dashboard principal. También puedes activar notificaciones de saldo en la configuración de tu cuenta.',
    quickActions: ['Ver mis cuentas', 'Configurar alertas'],
  },
  'tarjeta': {
    text: 'Puedo ayudarte con: bloqueo de tarjeta, solicitar nueva tarjeta, consultar límite de crédito, o configurar pagos automáticos. ¿Qué necesitas?',
    quickActions: ['Bloquear tarjeta', 'Aumentar límite', 'Pago automático'],
  },
  'transferencia': {
    text: 'Para hacer una transferencia:\n1. Ve a "Paga y transfiere"\n2. Selecciona el tipo de transferencia\n3. Ingresa los datos del destinatario\n4. Confirma con tu PIN',
    quickActions: ['Hacer transferencia', 'Ver historial'],
  },
  'pago': {
    text: 'Puedes pagar servicios, tarjetas o a contactos. Las transferencias son instantáneas entre cuentas Capital One y tardan 1-3 días hábiles a otros bancos.',
    quickActions: ['Pagar servicio', 'Pagar tarjeta'],
  },
  'bloquear': {
    text: 'Para bloquear tu tarjeta temporalmente:\n1. Ve a los detalles de tu tarjeta\n2. Selecciona "Bloquear/Congelar tarjeta"\n3. Confirma la acción\n\nPuedes desbloquearla en cualquier momento desde la misma opción.',
    quickActions: ['Bloquear ahora', 'Reportar robo'],
  },
  'robo': {
    text: '⚠️ Si tu tarjeta fue robada:\n1. Bloquéala inmediatamente\n2. Reporta el robo en la sección de seguridad\n3. Solicita una nueva tarjeta\n\n¿Necesitas ayuda con alguno de estos pasos?',
    quickActions: ['Bloquear tarjeta', 'Reportar robo', 'Nueva tarjeta'],
  },
  'recompensas': {
    text: 'Tus recompensas acumuladas están en la sección de tu tarjeta de crédito. Puedes canjearlas por:\n• Efectivo (depósito a cuenta)\n• Descuentos en compras\n• Millas de viajero\n• Gift cards',
    quickActions: ['Ver recompensas', 'Canjear puntos'],
  },
  'pin': {
    text: 'Para cambiar tu PIN:\n1. Ve a "Más" > "Perfil"\n2. Selecciona "Seguridad"\n3. Elige "Cambiar PIN"\n4. Ingresa tu PIN actual y el nuevo PIN dos veces',
    quickActions: ['Cambiar PIN', 'Olvidé mi PIN'],
  },
  'default': {
    text: 'Entiendo que necesitas ayuda. Algunas cosas que puedo hacer:\n\n• Consultar saldos y movimientos\n• Ayuda con transferencias y pagos\n• Bloqueo y gestión de tarjetas\n• Información sobre recompensas\n• Cambio de PIN y seguridad\n\n¿Con cuál te puedo ayudar?',
    quickActions: ['Ver saldo', 'Hacer pago', 'Bloquear tarjeta', 'Hablar con agente'],
  },
};

// --- Header Component ---
const ChatHeader = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
    <View style={styles.headerCenter}>
      <View style={styles.botAvatar}>
        <MaterialCommunityIcons name="robot" size={24} color={COLORS.white} />
      </View>
      <View>
        <Text style={styles.headerTitle}>Asistente Capital One</Text>
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>En línea</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity>
      <Ionicons name="ellipsis-vertical" size={24} color={COLORS.primaryBlue} />
    </TouchableOpacity>
  </View>
);

// --- Message Bubble Component ---
const MessageBubble = ({ message, isUser, onQuickAction }) => (
  <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
    <View style={styles.messageRow}>
      {!isUser && (
        <View style={styles.botAvatarSmall}>
          <MaterialCommunityIcons name="robot" size={16} color={COLORS.white} />
        </View>
      )}
      
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {message.text}
        </Text>
        <Text style={[styles.messageTime, isUser ? styles.userTime : styles.botTime]}>
          {message.time}
        </Text>
      </View>
    </View>
    
    {!isUser && message.quickActions && (
      <View style={styles.quickActionsContainer}>
        {message.quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionButton}
            onPress={() => onQuickAction(action)}
          >
            <Text style={styles.quickActionText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

// --- Typing Indicator ---
const TypingIndicator = () => (
  <View style={styles.typingContainer}>
    <View style={styles.botAvatarSmall}>
      <MaterialCommunityIcons name="robot" size={16} color={COLORS.white} />
    </View>
    <View style={styles.typingBubble}>
      <View style={styles.typingDots}>
        <View style={[styles.typingDot, styles.typingDot1]} />
        <View style={[styles.typingDot, styles.typingDot2]} />
        <View style={[styles.typingDot, styles.typingDot3]} />
      </View>
    </View>
  </View>
);

// --- Suggested Questions ---
const SuggestedQuestions = ({ onSelect }) => {
  const suggestions = [
    { icon: 'wallet-outline', text: '¿Cuál es mi saldo?' },
    { icon: 'card-outline', text: 'Bloquear mi tarjeta' },
    { icon: 'swap-horizontal', text: 'Hacer una transferencia' },
    { icon: 'gift-outline', text: 'Ver mis recompensas' },
  ];

  return (
    <View style={styles.suggestionsContainer}>
      <Text style={styles.suggestionsTitle}>Preguntas frecuentes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionCard}
            onPress={() => onSelect(suggestion.text)}
          >
            <Ionicons name={suggestion.icon} size={24} color={COLORS.primaryBlue} />
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// --- Main Component ---
export default function SupportChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! 👋 Soy tu asistente virtual de Capital One. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      quickActions: ['Ver saldo', 'Hacer pago', 'Bloquear tarjeta', 'Más opciones'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    // Auto scroll al final cuando hay nuevos mensajes
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Buscar palabras clave en el mensaje
    if (lowerMessage.includes('saldo') || lowerMessage.includes('dinero') || lowerMessage.includes('cuánto tengo')) {
      return BOT_RESPONSES.saldo;
    }
    if (lowerMessage.includes('tarjeta') || lowerMessage.includes('crédito')) {
      return BOT_RESPONSES.tarjeta;
    }
    if (lowerMessage.includes('transferencia') || lowerMessage.includes('transferir') || lowerMessage.includes('enviar dinero')) {
      return BOT_RESPONSES.transferencia;
    }
    if (lowerMessage.includes('pago') || lowerMessage.includes('pagar')) {
      return BOT_RESPONSES.pago;
    }
    if (lowerMessage.includes('bloquear') || lowerMessage.includes('congelar')) {
      return BOT_RESPONSES.bloquear;
    }
    if (lowerMessage.includes('robo') || lowerMessage.includes('robaron') || lowerMessage.includes('fraude')) {
      return BOT_RESPONSES.robo;
    }
    if (lowerMessage.includes('recompensa') || lowerMessage.includes('puntos') || lowerMessage.includes('premio')) {
      return BOT_RESPONSES.recompensas;
    }
    if (lowerMessage.includes('pin') || lowerMessage.includes('contraseña') || lowerMessage.includes('clave')) {
      return BOT_RESPONSES.pin;
    }
    
    return BOT_RESPONSES.default;
  };

  const sendMessage = (text = inputText) => {
    if (!text.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isUser: true,
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();

    // Simular que el bot está escribiendo
    setIsTyping(true);

    // Respuesta del bot después de 1-2 segundos
    setTimeout(() => {
      const botResponseData = getBotResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponseData.text,
        isUser: false,
        time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        quickActions: botResponseData.quickActions,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 segundos
  };

  const handleQuickAction = (action) => {
    // Simular que el usuario presionó la acción rápida
    sendMessage(action);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ChatHeader navigation={navigation} />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 1 && (
            <SuggestedQuestions onSelect={sendMessage} />
          )}
          
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.isUser}
              onQuickAction={handleQuickAction}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color={COLORS.primaryBlue} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor={COLORS.lightText}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={24}
              color={inputText.trim() ? COLORS.white : COLORS.lightText}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.successGreen,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: COLORS.successGreen,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrayBg,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },

  // Suggested Questions
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 12,
    fontWeight: '600',
  },
  suggestionCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionText: {
    fontSize: 12,
    color: COLORS.darkText,
    textAlign: 'center',
    marginTop: 8,
  },

  // Message Bubbles
  messageContainer: {
    marginBottom: 16,
    width: '100%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageRow: {
    flexDirection: 'row',
    maxWidth: '85%',
  },
  botAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
    flexShrink: 0,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    flex: 1,
  },
  userBubble: {
    backgroundColor: COLORS.chatBubbleUser,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.chatBubbleBot,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.white,
  },
  botText: {
    color: COLORS.darkText,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userTime: {
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'right',
  },
  botTime: {
    color: COLORS.lightText,
  },

  // Quick Actions
  quickActionsContainer: {
    marginTop: 8,
    marginLeft: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryBlue,
  },
  quickActionText: {
    fontSize: 13,
    color: COLORS.primaryBlue,
    fontWeight: '600',
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: COLORS.chatBubbleBot,
    borderRadius: 16,
    padding: 12,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightText,
  },

  // Input Area
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  attachButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGrayBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: COLORS.darkText,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.borderGray,
  },
});
