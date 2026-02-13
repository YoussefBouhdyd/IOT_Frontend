// app/(tabs)/settings.jsx  (Expo Router)
// Dépendances: expo-local-authentication, @react-native-async-storage/async-storage
//   npx expo install expo-local-authentication
//   npm i @react-native-async-storage/async-storage

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useMemo, useState } from "react";


import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "app_settings_v1";

// --- Thème (beige / minimal comme ton screenshot) ---
const THEME = {
  bg: "#F3EFE9",
  card: "#FFFFFF",
  text: "#1C1C1C",
  subText: "#6A6A6A",
  border: "#E4DDD5",
  accent: "#8B6B4F",
  danger: "#B24A3A",
};

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function SettingsScreen() {
  // ----------------- States (persistés) -----------------
  const [pushEnabled, setPushEnabled] = useState(true);
  const [iotAlertsEnabled, setIotAlertsEnabled] = useState(true);
  const [temperatureAlerts, setTemperatureAlerts] = useState(true);
  const [gasAlerts, setGasAlerts] = useState(true);

  const [darkMode, setDarkMode] = useState(false); // tu peux le connecter à ton thème global
  const [language, setLanguage] = useState("fr");
  const [fontScale, setFontScale] = useState("normal"); // small / normal / large
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Sessions (mock) => à remplacer par tes vraies sessions backend
  const [sessions, setSessions] = useState([
    {
      id: "s1",
      device: "iPhone (This device)",
      location: "Rabat, MA",
      lastActive: "Now",
      current: true,
    },
    {
      id: "s2",
      device: "Chrome on Windows",
      location: "Rabat, MA",
      lastActive: "2 hours ago",
      current: false,
    },
  ]);

  // Modals
  const [langModal, setLangModal] = useState(false);
  const [accessModal, setAccessModal] = useState(false);
  const [sessionsModal, setSessionsModal] = useState(false);

  // ----------------- Load / Save -----------------
  const loadSettings = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);

      setPushEnabled(!!s.pushEnabled);
      setIotAlertsEnabled(!!s.iotAlertsEnabled);
      setTemperatureAlerts(!!s.temperatureAlerts);
      setGasAlerts(!!s.gasAlerts);

      setDarkMode(!!s.darkMode);
      setLanguage(s.language || "fr");
      setFontScale(s.fontScale || "normal");
      setReduceMotion(!!s.reduceMotion);
      setHighContrast(!!s.highContrast);

      setBiometricEnabled(!!s.biometricEnabled);
    } catch (e) {
      // silencieux
    }
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      const payload = {
        pushEnabled,
        iotAlertsEnabled,
        temperatureAlerts,
        gasAlerts,
        darkMode,
        language,
        fontScale,
        reduceMotion,
        highContrast,
        biometricEnabled,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // silencieux
    }
  }, [
    pushEnabled,
    iotAlertsEnabled,
    temperatureAlerts,
    gasAlerts,
    darkMode,
    language,
    fontScale,
    reduceMotion,
    highContrast,
    biometricEnabled,
  ]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  // ----------------- Helpers -----------------
  const scale = useMemo(() => {
    if (fontScale === "small") return 0.92;
    if (fontScale === "large") return 1.12;
    return 1.0;
  }, [fontScale]);

  const colors = useMemo(() => {
    // High-contrast option
    if (!highContrast) return THEME;
    return {
      ...THEME,
      text: "#000000",
      subText: "#2B2B2B",
      border: "#CDBEAF",
      accent: "#6B3F20",
    };
  }, [highContrast]);

  const toggleBiometric = useCallback(async (value) => {
    if (!value) {
      setBiometricEnabled(false);
      return;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware) {
        Alert.alert("Biometric unavailable", "This device has no Face ID / Touch ID.");
        return;
      }
      if (!isEnrolled) {
        Alert.alert(
          "Not configured",
          "Please set up Face ID / Touch ID in your phone settings first."
        );
        return;
      }

      const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const canFaceId = supported.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      );

      const promptLabel =
        Platform.OS === "ios" && canFaceId ? "Enable Face ID" : "Enable biometric login";

      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: promptLabel,
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (res.success) {
        setBiometricEnabled(true);
      } else {
        setBiometricEnabled(false);
      }
    } catch (e) {
      setBiometricEnabled(false);
      Alert.alert("Error", "Could not enable biometric login.");
    }
  }, []);

  const revokeSession = useCallback((sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const logout = useCallback(() => {
    // ✅ Ici tu branches ta logique (AuthContext, Firebase, API, etc.)
    // Exemple si tu as un AuthContext:
    // const { logout } = useContext(AuthContext); logout();
    Alert.alert("Logout", "Ici tu appelles ta fonction logout() (AuthContext / Firebase / API).");
  }, []);

  // ----------------- UI Components -----------------
  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.subText, fontSize: 12 * scale }]}>
        {title}
      </Text>
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );

  const Row = ({ label, subLabel, right, onPress, danger }) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.row}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.rowLabel,
            { color: danger ? colors.danger : colors.text, fontSize: 15 * scale },
          ]}
        >
          {label}
        </Text>
        {!!subLabel && (
          <Text style={[styles.rowSub, { color: colors.subText, fontSize: 12 * scale }]}>
            {subLabel}
          </Text>
        )}
      </View>
      {right}
    </TouchableOpacity>
  );

  const Divider = () => <View style={[styles.divider, { backgroundColor: colors.border }]} />;

  // ----------------- Render -----------------
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: 22 * scale }]}>Settings</Text>

      {/* NOTIFICATIONS */}
      <Section title="NOTIFICATIONS">
        <Row
          label="Push Notifications"
          subLabel="Enable or disable all notifications"
          right={
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={"#fff"}
            />
          }
        />
        <Divider />
        <Row
          label="IoT Alerts"
          subLabel="Realtime alerts from sensors"
          right={
            <Switch
              value={iotAlertsEnabled}
              onValueChange={setIotAlertsEnabled}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={"#fff"}
            />
          }
        />
        <Divider />
        <Row
          label="Temperature Alerts"
          subLabel="High temperature notifications"
          right={
            <Switch
              value={temperatureAlerts}
              onValueChange={setTemperatureAlerts}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={"#fff"}
              disabled={!iotAlertsEnabled}
            />
          }
        />
        <Divider />
        <Row
          label="Gas Alerts"
          subLabel="Gas level anomaly notifications"
          right={
            <Switch
              value={gasAlerts}
              onValueChange={setGasAlerts}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={"#fff"}
              disabled={!iotAlertsEnabled}
            />
          }
        />
      </Section>

      {/* APPEARANCE */}
      <Section title="APPEARANCE">
        <Row
          label="Dark Mode"
          subLabel="Switch app appearance"
          right={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={"#fff"}
            />
          }
        />
      </Section>

      {/* LANGUAGE */}
      <Section title="LANGUAGE">
        <Row
          label="Language"
          subLabel={LANGUAGES.find((l) => l.code === language)?.label || "Français"}
          onPress={() => setLangModal(true)}
          right={<Text style={[styles.chevron, { color: colors.subText }]}>›</Text>}
        />
      </Section>

      {/* ACCESSIBILITY */}
      <Section title="ACCESSIBILITY">
        <Row
          label="Accessibility"
          subLabel="Font size, contrast, reduced motion"
          onPress={() => setAccessModal(true)}
          right={<Text style={[styles.chevron, { color: colors.subText }]}>›</Text>}
        />
      </Section>

      {/* SECURITY */}
      <Section title="SECURITY">
        <Row
          label={Platform.OS === "ios" ? "Face ID" : "Biometric Login"}
          subLabel="Use biometrics to unlock the app"
          right={
            <Switch
              value={biometricEnabled}
              onValueChange={toggleBiometric}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={"#fff"}
            />
          }
        />
        <Divider />
        <Row
          label="Active Sessions"
          subLabel={`${sessions.length} session(s)`}
          onPress={() => setSessionsModal(true)}
          right={<Text style={[styles.chevron, { color: colors.subText }]}>›</Text>}
        />
        <Divider />
        <Row
          label="Logout"
          subLabel="Disconnect from this account"
          danger
          onPress={logout}
          right={<Text style={[styles.chevron, { color: colors.danger }]}>›</Text>}
        />
      </Section>

      {/* ---------- Modals ---------- */}

      {/* Language Modal */}
      <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setLangModal(false)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: 16 * scale }]}>
              Choose language
            </Text>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.modalRow, { borderColor: colors.border }]}
                onPress={() => {
                  setLanguage(l.code);
                  setLangModal(false);
                }}
              >
                <Text style={[styles.modalRowText, { color: colors.text, fontSize: 14 * scale }]}>
                  {l.label}
                </Text>
                {language === l.code ? (
                  <Text style={{ color: colors.accent, fontSize: 16 * scale }}>✓</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Accessibility Modal */}
      <Modal
        visible={accessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setAccessModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setAccessModal(false)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: 16 * scale }]}>
              Accessibility
            </Text>

            <Text style={[styles.modalLabel, { color: colors.subText, fontSize: 12 * scale }]}>
              Font size
            </Text>
            <View style={styles.segment}>
              {[
                { k: "small", t: "Small" },
                { k: "normal", t: "Normal" },
                { k: "large", t: "Large" },
              ].map((x) => (
                <TouchableOpacity
                  key={x.k}
                  onPress={() => setFontScale(x.k)}
                  style={[
                    styles.segmentBtn,
                    {
                      backgroundColor: fontScale === x.k ? colors.accent : "transparent",
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: fontScale === x.k ? "#fff" : colors.text,
                      fontSize: 13 * scale,
                      fontWeight: "600",
                    }}
                  >
                    {x.t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 10 }} />

            <View style={styles.inlineRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: colors.text, fontSize: 15 * scale }]}>
                  Reduce motion
                </Text>
                <Text style={[styles.rowSub, { color: colors.subText, fontSize: 12 * scale }]}>
                  Fewer animations for comfort
                </Text>
              </View>
              <Switch
                value={reduceMotion}
                onValueChange={setReduceMotion}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={"#fff"}
              />
            </View>

            <Divider />

            <View style={styles.inlineRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: colors.text, fontSize: 15 * scale }]}>
                  High contrast
                </Text>
                <Text style={[styles.rowSub, { color: colors.subText, fontSize: 12 * scale }]}>
                  Stronger text and borders
                </Text>
              </View>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={"#fff"}
              />
            </View>

            <TouchableOpacity
              style={[styles.modalClose, { borderColor: colors.border }]}
              onPress={() => setAccessModal(false)}
            >
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 * scale }}>
                Done
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Sessions Modal */}
      <Modal
        visible={sessionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSessionsModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSessionsModal(false)}>
          <Pressable
            style={[styles.modalCardLarge, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: 16 * scale }]}>
              Active Sessions
            </Text>

            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <View style={styles.sessionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 * scale }}>
                      {item.device} {item.current ? "(Current)" : ""}
                    </Text>
                    <Text style={{ color: colors.subText, fontSize: 12 * scale }}>
                      {item.location} • Last active: {item.lastActive}
                    </Text>
                  </View>

                  {!item.current ? (
                    <TouchableOpacity
                      onPress={() => revokeSession(item.id)}
                      style={[styles.revokeBtn, { borderColor: colors.border }]}
                    >
                      <Text style={{ color: colors.danger, fontWeight: "800", fontSize: 12 * scale }}>
                        Revoke
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            />

            <TouchableOpacity
              style={[styles.modalClose, { borderColor: colors.border }]}
              onPress={() => setSessionsModal(false)}
            >
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 * scale }}>
                Close
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 18 },
  title: { fontWeight: "800", marginBottom: 12 },

  section: { marginTop: 14 },
  sectionTitle: { marginBottom: 8, fontWeight: "800", letterSpacing: 1.2 },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },

  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: { fontWeight: "700" },
  rowSub: { marginTop: 2 },

  divider: { height: 1, width: "100%" },
  chevron: { fontSize: 22, fontWeight: "600" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  modalCardLarge: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    maxHeight: "75%",
  },
  modalTitle: { fontWeight: "900", marginBottom: 10 },
  modalRow: {
    paddingVertical: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalRowText: { fontWeight: "700" },
  modalLabel: { fontWeight: "800", marginTop: 6, marginBottom: 6, letterSpacing: 0.6 },

  modalClose: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },

  // Accessibility
  segment: { flexDirection: "row", gap: 8 },
  segmentBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  inlineRow: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // Sessions
  sessionRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  revokeBtn: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
});
