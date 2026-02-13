import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function RoomHistory() {
  const { id, modeNuit } = useLocalSearchParams();
  const isNightMode = modeNuit === "on";

  const TEMP_THRESHOLD = 28;
  const GAS_THRESHOLD = 15;

  const [climOn, setClimOn] = useState(false);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [lightOn, setLightOn] = useState(true);
  const [windowOpen, setWindowOpen] = useState(false);
  const [targetTemp, setTargetTemp] = useState(22);
  const currentTemp = 18;

  const isTempAlert =
    temperatureData.length > 0 &&
    Math.max(...temperatureData) > TEMP_THRESHOLD;
    
  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  useEffect(() => {
    if (isTempAlert) {
      setClimOn(true);
    }
  }, [isTempAlert]);

  useEffect(() => {
    if (isNightMode) {
      setLightOn(false);
    } else {   
      setLightOn(true);
    }
  }, [isNightMode]);

  useEffect(() => {
    const loadTemperatureGraph = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("TOKEN USED:", token);

        const response = await fetch(
          `https://backendiotproject-c4gbdtdqcebjb9c9.spaincentral-01.azurewebsites.net/api/temperature/${id}/graph?minutes=60`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("TEMP GRAPH STATUS:", response.status);

        if (!response.ok) {
          console.log("Temperature request failed");
          return;
        }

        const data = await response.json();
        console.log("Temperature graph:", data);

        if (!data?.points?.length) {
          setTemperatureData([]);
          return;
        }

        const values = data.points.map(p => Number(p.value));
        const timeLabels = data.points.map(p =>
          p.timestamp.slice(11, 16)
        );

        setTemperatureData(values);
        setLabels(timeLabels);

      } catch (err) {
        console.log("Temperature graph error:", err);
      }
    };

    loadTemperatureGraph();
  }, [id]);

  useEffect(() => {
    const loadHumidityGraph = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        const response = await fetch(
          `https://backendiotproject-c4gbdtdqcebjb9c9.spaincentral-01.azurewebsites.net/api/humidity/${id}/graph?minutes=60`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("HUM GRAPH STATUS:", response.status);

        if (!response.ok) {
          console.log("Humidity request failed");
          return;
        }

        const data = await response.json();
        console.log("Humidity graph:", data);

        if (!data?.points?.length) {
          setHumidityData([]);
          return;
        }

        const values = data.points.map(p => Number(p.value));
        setHumidityData(values);

      } catch (err) {
        console.log("Humidity graph error:", err);
      }
    };

    loadHumidityGraph();
  }, [id]);


  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => "#C8A27C",
    labelColor: () => "#777",
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historique – {id}</Text>

      {isTempAlert && (
        <View style={styles.alertWarning}>
          <Text>⚠️ Température élevée détectée</Text>
        </View>
      )}

      <View style={styles.mainCard}>

        <Text style={styles.sectionTitle}>
          Actions automatiques & manuelles
        </Text>

        {/* 🌡️ CLIMAT */}
        <View style={styles.climatCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>🌡️ Climat</Text>
            <Switch value={climOn} onValueChange={setClimOn} />
          </View>

          <View style={styles.tempControl}>
            <TouchableOpacity onPress={() => setTargetTemp(t => t - 1)}>
              <Text style={styles.tempBtn}>−</Text>
            </TouchableOpacity>

            <Text style={styles.tempValue}>{targetTemp}°</Text>

            <TouchableOpacity onPress={() => setTargetTemp(t => t + 1)}>
              <Text style={styles.tempBtn}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.smallText}>ACTUEL 18°C</Text>
            <Text style={styles.smallText}>
              STATUS {climOn ? "HEATING" : "OFF"}
            </Text>
          </View>
        </View>

        {/* 💡 LUMIERE */}
        <View style={styles.simpleCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>💡 Lumière</Text>

            <TouchableOpacity
              style={[
                styles.controlBtn,
                { backgroundColor: lightOn ? "#6E5B4A" : "#3C3C3C" }
              ]}
              onPress={() => setLightOn(!lightOn)}
            >
              <Text style={{color:"#fff"}}>
                {lightOn ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.roomLabel}>{id}</Text>
        </View>

        {/* 🪟 FENETRES */}
        <View style={styles.simpleCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>🪟 Fenêtres</Text>

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setWindowOpen(!windowOpen)}
            >
              <Text style={{color:"#fff"}}>
                {windowOpen ? "OPEN" : "CLOSED"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.roomLabel}>{id}</Text>
        </View>

      </View>

      {/* CHARTS */}
      <Text style={styles.subtitle}>Température (°C)</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: temperatureData }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <Text style={styles.subtitle}>Humidité (%)</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: humidityData }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#F2EFEC",
    padding:16
  },

  title:{
    fontSize:22,
    fontWeight:"600",
    marginBottom:12
  },

  mainCard:{
    backgroundColor:"#FFFFFF",
    borderRadius:20,
    padding:16
  },

  sectionTitle:{
    fontWeight:"600",
    marginBottom:12
  },

  climatCard:{
    backgroundColor:"#B89C80",
    borderRadius:20,
    padding:16,
    marginBottom:16
  },

  subCard:{
    backgroundColor:"#B89C80",
    borderRadius:20,
    padding:16,
    marginBottom:16
  },

  cardTitle:{
    color:"#fff",
    fontSize:16,
    fontWeight:"600"
  },

  rowBetween:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },

  tempControl:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    marginVertical:20
  },

  tempBtn:{
    fontSize:28,
    color:"#fff",
    marginHorizontal:20
  },

  tempValue:{
    fontSize:36,
    fontWeight:"700",
    color:"#fff"
  },

  smallText:{
    color:"#fff"
  },

  roomRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:12,
    alignItems:"center"
  },

  windowRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:12,
    alignItems:"center",
    backgroundColor:"#A88C72",
    padding:12,
    borderRadius:14
  },

  roomText:{
    color:"#fff",
    fontSize:16
  },

  offBtn:{
    backgroundColor:"#6E5B4A",
    paddingVertical:6,
    paddingHorizontal:14,
    borderRadius:14
  },

  iconBtn:{
    backgroundColor:"#6E5B4A",
    padding:10,
    borderRadius:12,
    marginLeft:8
  },

  link:{
    color:"#E5E5FF"
  },

  alertWarning:{
    backgroundColor:"#F5E3B0",
    padding:10,
    borderRadius:14,
    marginBottom:8
  },

  alertDanger:{
    backgroundColor:"#F3C5C5",
    padding:10,
    borderRadius:14,
    marginBottom:8
  },
 
  simpleCard:{
    backgroundColor:"#B89C80",
    borderRadius:20,
    padding:16,
    marginBottom:16
  },

  controlBtn:{
    backgroundColor:"#6E5B4A",
    paddingVertical:8,
    paddingHorizontal:18,
    borderRadius:20
  },

  roomLabel:{
    color:"#fff",
    marginTop:8,
    fontSize:14
},

});
