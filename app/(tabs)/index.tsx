import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  // ✅ States séparés
  const [modeNormal, setModeNormal] = useState(true);
  const [modeNuit, setModeNuit] = useState(false);
  const [modeEnfants, setModeEnfants] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login"); 
  };

  useEffect(() => {
    async function requestPermission() {
    const settings = await Notifications.getPermissionsAsync();
    if (!settings.granted) {
      await Notifications.requestPermissionsAsync();
    }
    }
    requestPermission();
  }, []);
  const sendNotification = useCallback(async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  }, []);


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏠 ADCP</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Welcome */}
      <View style={styles.welcome}>
        <View>
          <Text style={styles.temp}>27°</Text>
          <Text style={styles.subtitle}>Welcome to your Smart Home</Text>
        </View>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Rooms */}
      <Text style={styles.sectionTitle}>All Rooms</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <RoomCard id="living" title="Living Room" temp="27°" />
        <RoomCard id="kitchen" title="Kitchen" temp="26°" />
        <RoomCard id="bedroom" title="Bedroom" temp="24°" />
      </ScrollView>

      {/* Devices */}
      <Text style={styles.sectionTitle}>Devices</Text>
      <View style={styles.devicesRow}>
        <Device icon="wifi" label="WiFi" />
        <Device icon="lightbulb" label="Light" />
        <Device icon="thermostat" label="Temp" />
        <Device icon="fan" label="Fan" />
      </View>

      {/* Modes */}
      <Text style={styles.sectionTitle}>Modes</Text>

      <ModeCard
        type="normal"
        icon="home-outline"
        title="Mode Normal"
        description="Température, humidité, gaz"
        value={modeNormal}
        onChange={(value) => {
          setModeNormal(value);
          if (value) {
            sendNotification(
              "🏠 Mode Normal activé",
              "Le mode normal de la maison est activé"
            );
          }
        }}
      />

      <ModeCard
        type="nuit"
        icon="moon-outline"
        title="Mode Nuit"
        description="Surveillance nocturne"
        value={modeNuit}
        onChange={(value) => {
          setModeNuit(value);
          router.push({
          pathname: "/room/living",
          params: { modeNuit: value ? "on" : "off" },
          });
        }}
      />


      <ModeCard
        type="enfants"
        icon="happy-outline"
        title="Mode Enfants"
        description="Sécurité des enfants"
        value={modeEnfants}
        onChange={(value) => {
          setModeEnfants(value);
          if (value) {
            sendNotification(
            "🧒 Mode Enfants activé",
            "La sécurité enfants est maintenant active"
            );
          }
        }}
      />
    </ScrollView>
  );
};
function RoomCard({ id, title, temp }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => router.push(`/room/${id}`)}
    >
      <Text style={styles.roomTitle}>{title}</Text>
      <Text style={styles.roomTemp}>{temp}</Text>

      <View style={styles.roomFooter}>
        <Ionicons name="thermometer" size={18} color="#fff" />
        <Ionicons name="wifi" size={18} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}
function Device({ icon, label }) {
  return (
    <TouchableOpacity style={styles.device}>
      {icon === "fan" ? (
        <FontAwesome5 name="fan" size={24} color="#fff" />
      ) : (
        <MaterialIcons name={icon} size={26} color="#fff" />
      )}
      <Text style={styles.deviceText}>{label}</Text>
    </TouchableOpacity>
  );
}
function ModeCard({ type, icon, title, description, value, onChange }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.modeCard}
      onPress={() => router.push(`/mode/${type}`)}
      activeOpacity={0.8}
    >
      <View style={styles.modeLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={22} color="#fff" />
        </View>
        <View>
          <Text style={styles.modeTitle}>{title}</Text>
          <Text style={styles.modeDesc}>{description}</Text>
        </View>
      </View>
      <Switch value={value} onValueChange={onChange} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEAE6",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
  },

  text: {
    fontSize: 16,
  },

  logoutBtn: {
    backgroundColor: "#C8A27C",
    padding: 10,
    borderRadius: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcome: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  temp: {
    fontSize: 36,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#666",
  },

  profile: {
    backgroundColor: "#C8A27C",
    padding: 10,
    borderRadius: 50,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
  },

  roomCard: {
    width: 220,
    height: 260,
    backgroundColor: "#BFA38A",
    borderRadius: 30,
    padding: 20,
    marginRight: 15,
    justifyContent: "space-between",
  },

  roomTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },

  roomTemp: {
    fontSize: 28,
    color: "#fff",
  },

  roomFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 90,
  },

  devicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  device: {
    width: 70,
    height: 70,
    backgroundColor: "#C8A27C",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  deviceText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },

  modeCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modeLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    backgroundColor: "#C8A27C",
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  modeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  modeDesc: {
    fontSize: 13,
    color: "#777",
  },
});