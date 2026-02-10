import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleContinue = () => {
    if (!email) return Alert.alert("Error", "Please enter your email");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return Alert.alert("Invalid email", "Please enter a valid email");

    if (!password) return Alert.alert("Error", "Please enter your password");

    if (password.length < 6)
      return Alert.alert("Weak password", "Password must be at least 6 characters");

    login(email);
    router.replace("/(tabs)");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/blur-bg.jpg")}
      resizeMode="cover"
      style={styles.bg}
    >
      {/* Beige overlay for tone */}
      <View style={styles.overlay} />

      <View style={styles.center}>
        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={26} color="#fff" />
          </View>

          {/* Email */}
          <View style={styles.inputRow}>
            <View style={styles.leftIcon}>
              <Ionicons name="mail-outline" size={18} color="#6B4F3A" />
            </View>
            <TextInput
              placeholder="Email ID"
              placeholderTextColor="#8A7D72"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputRow}>
            <View style={styles.leftIcon}>
              <Ionicons name="lock-closed-outline" size={18} color="#6B4F3A" />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#8A7D72"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.rightIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B4F3A"
              />
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(239, 234, 230, 0.35)", // beige filter
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  // Glass card
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 24,
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },

  avatar: {
    position: "absolute",
    top: -26,
    alignSelf: "center",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6B4F3A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(217, 207, 196, 0.9)",
    marginTop: 12,
    overflow: "hidden",
  },

  leftIcon: {
    width: 44,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 162, 124, 0.18)",
    borderRightWidth: 1,
    borderRightColor: "rgba(130, 105, 85, 0.20)",
  },

  rightIcon: {
    width: 44,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 162, 124, 0.14)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(130, 105, 85, 0.18)",
  },

  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 12,
    color: "#2A2018",
    fontSize: 15,
  },

  button: {
    marginTop: 18,
    backgroundColor: "#6B4F3A",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#F6F1EC",
    fontWeight: "700",
    letterSpacing: 1.2,
  },
});