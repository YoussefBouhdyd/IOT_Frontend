import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const { login } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Login – ADCP
      </Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={() => login(email)}
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
