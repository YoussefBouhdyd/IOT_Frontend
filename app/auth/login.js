import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
<<<<<<< HEAD
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
=======
>>>>>>> 0421027 (Description claire de ce que tu as fait)
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

<<<<<<< HEAD
=======
  // UI only (doesn't change login flow)
  const [remember, setRemember] = useState(false);

>>>>>>> 0421027 (Description claire de ce que tu as fait)
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleContinue = () => {
    // Email validation
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email", "Please enter a valid email");
      return;
    }

    // Password validation
    if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    if (password.length < 6) {
<<<<<<< HEAD
      Alert.alert(
        "Weak password",
        "Password must be at least 6 characters"
      );
=======
      Alert.alert("Weak password", "Password must be at least 6 characters");
>>>>>>> 0421027 (Description claire de ce que tu as fait)
      return;
    }

    // ✅ Login OK (mock)
    login(email);
    router.replace("/(tabs)");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=60",
      }}
      blurRadius={10}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Dark beige overlay like the photo */}
      <View style={styles.overlay} />

<<<<<<< HEAD
      {/* Email */}
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <View style={styles.passwordBox}>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
=======
      <View style={styles.centerWrap}>
        <View style={styles.card}>
          {/* Top avatar circle */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-outline" size={28} color="#fff" />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputRow}>
            <View style={styles.leftIcon}>
              <Ionicons name="mail-outline" size={18} color="#6B5B4B" />
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
              <Ionicons name="lock-closed-outline" size={18} color="#6B5B4B" />
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
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B5B4B"
              />
            </TouchableOpacity>
          </View>

          {/* Remember + Forgot */}
          <View style={styles.rowBetween}>
            <Pressable
              onPress={() => setRemember(!remember)}
              style={styles.rememberRow}
            >
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                {remember && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>

            <TouchableOpacity
              onPress={() => Alert.alert("Info", "Forgot password is UI only for now")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
>>>>>>> 0421027 (Description claire de ce que tu as fait)
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: "#EFEAE6",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
=======
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(34, 24, 16, 0.45)", // warm dark overlay
  },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(239, 234, 230, 0.28)", // glass beige
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },

  avatarWrap: {
    position: "absolute",
    top: -26,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6B4F3A", // marron
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(130, 105, 85, 0.35)",
    marginTop: 12,
    overflow: "hidden",
  },

  leftIcon: {
    width: 44,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 162, 124, 0.22)", // beige/marron soft
    borderRightWidth: 1,
    borderRightColor: "rgba(130, 105, 85, 0.22)",
>>>>>>> 0421027 (Description claire de ce que tu as fait)
  },

  input: {
    flex: 1,
    height: 46,
    paddingHorizontal: 12,
    color: "#2A2018",
    fontSize: 15,
  },

  rightIcon: {
    width: 44,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 162, 124, 0.18)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(130, 105, 85, 0.18)",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },

<<<<<<< HEAD
  passwordBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
=======
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(107, 79, 58, 0.65)",
    backgroundColor: "rgba(255,255,255,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxOn: {
    backgroundColor: "#6B4F3A",
    borderColor: "#6B4F3A",
  },

  rememberText: {
    fontSize: 12,
    color: "#3A2D24",
  },

  forgotText: {
    fontSize: 12,
    color: "#6B4F3A",
    textDecorationLine: "underline",
>>>>>>> 0421027 (Description claire de ce que tu as fait)
  },

  button: {
    backgroundColor: "#6B4F3A", // marron foncé like photo button
    borderRadius: 10,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#F6F1EC",
    fontWeight: "700",
    letterSpacing: 1.2,
    fontSize: 14,
  },
});
