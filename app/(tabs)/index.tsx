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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [temperature, setTemperatureState] = useState("--");

  const handleLogout = () => {
    logout();
    router.replace("/auth/login"); 
  };
  const loadTemperature = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(
        "https://backendiotproject-c4gbdtdqcebjb9c9.spaincentral-01.azurewebsites.net/api/temperature/livingroom",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("GET status:", response.status);

      if (!response.ok) return;

      const data = await response.json();
      console.log("Temperature data:", data);

      setTemperatureState(parseFloat(data.value).toFixed(1));

    } catch (err) {
      console.log("Load temp error:", err);
    }
  };

  useEffect(() => {
    async function requestPermission() {
    const settings = await Notifications.getPermissionsAsync();
    if (!settings.granted) {
      await Notifications.requestPermissionsAsync();
    }
    }
    requestPermission();
    loadTemperature();
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
          <Text style={styles.temp}>{temperature}°</Text>
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
        <RoomCard id="livingroom" title="Living Room"  />
        <RoomCard id="kitchen" title="Kitchen"  />
        <RoomCard id="bedroom" title="Bedroom" />
        <RoomCard id="toilet" title="Bathroom" />
      </ScrollView>

  
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
function RoomCard({ id, title }) {
  const router = useRouter();
  const [temp, setTemp] = useState("--");
  const [humidity, setHumidity] = useState("--");

  useEffect(() => {
    const loadRoomData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        // 🔥 Temperature
        const tempRes = await fetch(
          `https://backendiotproject-c4gbdtdqcebjb9c9.spaincentral-01.azurewebsites.net/api/temperature/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (tempRes.ok) {
          const tempData = await tempRes.json();
          if (tempData?.value) {
            setTemp(parseFloat(tempData.value).toFixed(1));
          }
        }

        // 💧 Humidity
        const humRes = await fetch(
          `https://backendiotproject-c4gbdtdqcebjb9c9.spaincentral-01.azurewebsites.net/api/humidity/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (humRes.ok) {
          const humData = await humRes.json();
          if (humData?.value) {
            setHumidity(parseFloat(humData.value).toFixed(0));
          }
        }

      } catch (err) {
        console.log("Room data error:", err);
      }
    };

    loadRoomData();
  }, [id]);
  return (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => router.push(`/room/${id}`)}
      activeOpacity={0.9}
    >
      {/* Room Name */}
      <Text style={styles.roomTitle}>{title}</Text>

      {/* Center Data */}
      <View style={styles.centerData}>
        <Text style={styles.roomTemp}>{temp}°</Text>
        <Text style={styles.roomHumidity}>💧 {humidity}%</Text>
      </View>

      {/* Bottom Icons */}
      <View style={styles.roomFooter}>
        <Ionicons name="thermometer-outline" size={18} color="#fff" />
        <Ionicons name="wifi-outline" size={18} color="#fff" />
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
  centerData: {
    alignItems: "left",
    justifyContent: "center",
    flex: 1,
  },

  roomTemp: {
    fontSize: 38,
    color: "#fff",
    fontWeight: "700",
  },

  roomHumidity: {
    fontSize: 16,
    color: "#fff",
    marginTop: 6,
  }
});