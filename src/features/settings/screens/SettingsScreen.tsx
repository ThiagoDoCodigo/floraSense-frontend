import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Bell,
  AlertTriangle,
  Info,
  ChevronRight,
  Leaf,
  ShieldCheck,
} from "lucide-react-native";

import { Typography, colors } from "react-native-th-components";
import { useSettingsViewModel } from "../viewModels/settings.viewModel";

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { settings, toggleNotifications, toggleUrgentAlertsOnly } =
    useSettingsViewModel();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

       
        <Typography
          variant="caption"
          weight="bold"
          color={colors.text.muted}
          style={styles.sectionTitle}
        >
          NOTIFICAÇÕES
        </Typography>

        <View style={styles.card}>

          
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary.faded }]}>
              <Bell size={20} color={colors.primary.main} />
            </View>
            <View style={styles.settingTexts}>
              <Typography variant="body" weight="semibold" color={colors.text.primary}>
                Notificações
              </Typography>
              <Typography variant="caption" color={colors.text.secondary}>
                Receber alertas das suas plantas
              </Typography>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary.light }}
              thumbColor={
                settings.notificationsEnabled
                  ? colors.primary.main
                  : colors.text.muted
              }
            />
          </View>

          <View style={styles.divider} />

         
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.warning.faded }]}>
              <AlertTriangle size={20} color={colors.warning.main} />
            </View>
            <View style={styles.settingTexts}>
              <Typography variant="body" weight="semibold" color={colors.text.primary}>
                Somente Urgentes
              </Typography>
              <Typography variant="caption" color={colors.text.secondary}>
                Notificar apenas alertas críticos
              </Typography>
            </View>
            <Switch
              value={settings.urgentAlertsOnly}
              onValueChange={toggleUrgentAlertsOnly}
              disabled={!settings.notificationsEnabled}
              trackColor={{ false: colors.border, true: colors.warning.faded }}
              thumbColor={
                settings.urgentAlertsOnly
                  ? colors.warning.main
                  : colors.text.muted
              }
            />
          </View>

        </View>

       
        <Typography
          variant="caption"
          weight="bold"
          color={colors.text.muted}
          style={styles.sectionTitle}
        >
          SEGURANÇA
        </Typography>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.6}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.info.light }]}>
              <ShieldCheck size={20} color={colors.info.main} />
            </View>
            <View style={styles.settingTexts}>
              <Typography variant="body" weight="semibold" color={colors.text.primary}>
                Alterar Senha
              </Typography>
              <Typography variant="caption" color={colors.text.secondary}>
                Atualizar senha de acesso
              </Typography>
            </View>
            <ChevronRight size={18} color={colors.text.muted} />
          </TouchableOpacity>
        </View>

        
        <Typography
          variant="caption"
          weight="bold"
          color={colors.text.muted}
          style={styles.sectionTitle}
        >
          SOBRE O APP
        </Typography>

        <View style={styles.card}>

         
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.success.light }]}>
              <Leaf size={20} color={colors.success.main} />
            </View>
            <View style={styles.settingTexts}>
              <Typography variant="body" weight="semibold" color={colors.text.primary}>
                FloraSense
              </Typography>
              <Typography variant="caption" color={colors.text.secondary}>
                Versão {settings.appVersion}
              </Typography>
            </View>
          </View>

          <View style={styles.divider} />

          
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Info size={20} color={colors.text.secondary} />
            </View>
            <View style={styles.settingTexts}>
              <Typography variant="body" weight="semibold" color={colors.text.primary}>
                Sobre
              </Typography>
              <Typography variant="caption" color={colors.text.secondary}>
                Monitoramento inteligente de plantas via IoT e IA
              </Typography>
            </View>
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingTexts: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceHighlight,
    marginVertical: 12,
    marginLeft: 54,
  },
});
