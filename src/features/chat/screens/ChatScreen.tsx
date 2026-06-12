import { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import {
  Sparkles,
  Send,
  Droplets,
  Leaf,
  Activity,
  Bot,
  ChevronRight,
  ArrowRight,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography, colors } from "react-native-th-components";
import { useChatViewModel } from "../viewModels/chat.viewModel";
import type { ChatMessage } from "../models/chat.model";

const BlinkingCursor = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);
  return <Animated.View style={[styles.blinkingCursor, { opacity }]} />;
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const { messages, inputText, setInputText, isTyping, sendMessage } =
    useChatViewModel();

  const handleQuickCommand = (cmd: string) => {
    setInputText(cmd);
  };

  const renderHero = () => (
    <View style={styles.heroSection}>
      <View style={styles.heroOuterRing}>
        <View style={styles.heroInnerRing}>
          <View style={styles.heroIconBox}>
            <Bot size={36} color={colors.primary.main} />
          </View>
        </View>
      </View>

      <View style={styles.heroTitleRow}>
        <Sparkles size={20} color={colors.primary.main} />
        <Typography
          variant="h1"
          color={colors.text.primary}
          style={styles.heroTitle}
        >
          FloraSense AI
        </Typography>
      </View>

      <Typography
        variant="body"
        color={colors.text.secondary}
        align="center"
        style={styles.heroSubtitle}
      >
        Sua rede neural conectada ao cultivo. O que deseja analisar hoje?
      </Typography>

      {!inputText && messages.length <= 1 && (
        <View style={styles.quickCommandsContainer}>
          <TouchableOpacity
            style={styles.commandChip}
            activeOpacity={0.7}
            onPress={() => handleQuickCommand("Exibir diagnóstico do solo")}
          >
            <View
              style={[
                styles.commandIconBox,
                { backgroundColor: colors.info.light },
              ]}
            >
              <Droplets size={16} color={colors.info.main} />
            </View>
            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              style={styles.commandText}
            >
              Diagnóstico do Solo
            </Typography>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.commandChip}
            activeOpacity={0.7}
            onPress={() => handleQuickCommand("Analisar saúde geral")}
          >
            <View
              style={[
                styles.commandIconBox,
                { backgroundColor: colors.success.light },
              ]}
            >
              <Activity size={16} color={colors.success.main} />
            </View>
            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              style={styles.commandText}
            >
              Saúde Geral da Planta
            </Typography>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.commandChip}
            activeOpacity={0.7}
            onPress={() => handleQuickCommand("Como ajustar o NPK?")}
          >
            <View
              style={[
                styles.commandIconBox,
                { backgroundColor: colors.primary.faded },
              ]}
            >
              <Leaf size={16} color={colors.primary.main} />
            </View>
            <Typography
              variant="body"
              weight="bold"
              color={colors.text.primary}
              style={styles.commandText}
            >
              Calibração de NPK
            </Typography>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.sender === "ai") {
      return (
        <View style={styles.aiMessageWrapper}>
          <View style={styles.aiAvatar}>
            <Sparkles size={16} color={colors.surface} />
          </View>
          <View style={styles.aiContent}>
            <Typography
              variant="caption"
              weight="bold"
              color={colors.primary.main}
              style={{ marginBottom: 4, letterSpacing: 0.5 }}
            >
              FLORASENSE
            </Typography>
            <Typography
              variant="body"
              color={colors.text.primary}
              style={styles.aiText}
            >
              {item.text}
              {item.isStreaming && <BlinkingCursor />}
            </Typography>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.userMessageWrapper}>
        <View style={styles.userBubble}>
          <Typography variant="body" color={colors.text.inverse}>
            {item.text}
          </Typography>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={messages.length <= 1 ? renderHero : null}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping && messages.length > 0 ? (
            <View style={styles.typingContainer}>
              <View
                style={[
                  styles.aiAvatar,
                  { backgroundColor: colors.surfaceHighlight },
                ]}
              >
                <Bot size={16} color={colors.text.muted} />
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color={colors.primary.main} />
                <Typography
                  variant="caption"
                  color={colors.text.muted}
                  style={{ marginLeft: 8 }}
                >
                  Analisando telemetria...
                </Typography>
              </View>
            </View>
          ) : (
            <View style={{ height: 16 }} />
          )
        }
      />

      <View
        style={[
          styles.inputWrapper,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Mensagem para FloraSense..."
            placeholderTextColor={colors.text.muted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            selectionColor={colors.primary.main}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim()
                ? styles.sendButtonActive
                : styles.sendButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <ArrowRight
              size={18}
              color={inputText.trim() ? colors.surface : colors.text.muted}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },

  listContent: { paddingBottom: 40, gap: 32 },

  heroSection: { alignItems: "center", marginTop: 16, marginBottom: 48 },
  heroOuterRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary.faded,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  heroInnerRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primary.light,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  heroTitle: { fontSize: 32, letterSpacing: -1 },
  heroSubtitle: { paddingHorizontal: 16, lineHeight: 22, opacity: 0.8 },

  quickCommandsContainer: { width: "100%", marginTop: 40, gap: 12 },
  commandChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  commandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  commandText: { flex: 1, marginLeft: 12 },

  aiMessageWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 16,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    elevation: 2,
  },
  aiContent: { flex: 1, marginLeft: 16 },
  aiText: { lineHeight: 26, fontSize: 16, letterSpacing: 0.2 },
  blinkingCursor: {
    width: 10,
    height: 18,
    backgroundColor: colors.primary.main,
    borderRadius: 2,
    marginLeft: 4,
    transform: [{ translateY: 2 }],
  },

  userMessageWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 40,
  },
  userBubble: {
    backgroundColor: colors.text.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    borderTopRightRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  typingContainer: { flexDirection: "row", alignItems: "flex-start" },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    marginLeft: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  inputWrapper: { backgroundColor: "transparent", paddingTop: 0 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.surface,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 24,
    paddingRight: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  textInput: {
    flex: 1,
    maxHeight: 150,
    minHeight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 22,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  sendButtonActive: {
    backgroundColor: colors.primary.main,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: { backgroundColor: colors.surfaceHighlight },
});
