import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function RoomHistory() {
  const { id } = useLocalSearchParams();

  // 🔹 Mock data (later backend)
  const temperatureData = [22, 24, 26, 29, 30, 28, 27];
  const gasData = [10, 12, 14, 16, 18, 15, 13];

  // 🔹 Thresholds
  const TEMP_THRESHOLD = 28;
  const GAS_THRESHOLD = 15;

  // 🔹 Alerts logic (THIS WAS MISSING ❌)
  const isTempAlert = Math.max(...temperatureData) > TEMP_THRESHOLD;
  const isGasAlert = Math.max(...gasData) > GAS_THRESHOLD;

  const chartColor = isTempAlert || isGasAlert ? "#E53935" : "#C8A27C";

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => chartColor,
    labelColor: () => "#777",
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Historique – {id?.toString().toUpperCase()}
      </Text>

      {/* 🔔 Alerts */}
      {isTempAlert && (
        <View style={styles.alertBoxWarning}>
          <Text style={styles.alertText}>
            ⚠️ Température élevée détectée dans cette pièce
          </Text>
        </View>
      )}

      {isGasAlert && (
        <View style={styles.alertBoxDanger}>
          <Text style={styles.alertText}>
            🚨 Niveau de gaz dangereux détecté
          </Text>
        </View>
      )}

      {/* 📈 Température Graph */}
      <Text style={styles.subtitle}>Température (°C)</Text>
      <LineChart
        data={{
          labels: ["8h", "10h", "12h", "14h", "16h", "18h", "20h"],
          datasets: [{ data: temperatureData }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* 📈 Gaz Graph */}
      <Text style={styles.subtitle}>Gaz (ppm)</Text>
      <LineChart
        data={{
          labels: ["8h", "10h", "12h", "14h", "16h", "18h", "20h"],
          datasets: [{ data: gasData }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </ScrollView>
  );
}
// const chartConfig = {
//   backgroundColor: "#fff",
//   backgroundGradientFrom: "#fff",
//   backgroundGradientTo: "#fff",
//   decimalPlaces: 0,
//   color: () => chartColor,
//   labelColor: () => "#777",
// };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEAE6",
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },

  chart: {
    borderRadius: 16,
    marginBottom: 30,
  },

  alertBoxWarning: {
    backgroundColor: "#FFF3CD",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },

  alertBoxDanger: {
    backgroundColor: "#F8D7DA",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },

  alertText: {
    fontWeight: "600",
    color: "#333",
  },
});