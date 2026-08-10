import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email.");
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Missing Password",
        "Please enter your password."
      );
      return;
    }

    try {
      setLoggingIn(true);

      const success = await login(
        name,
        email,
        password
      );

      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Login Failed",
          "Unable to login. Please try again."
        );
      }
    } catch (error) {
      console.log("Login error:", error);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logo}>
            <Text style={styles.logoText}>E</Text>
          </View>

          <Text style={styles.title}>
            Welcome to EliteMart
          </Text>

          <Text style={styles.subtitle}>
            Login to continue shopping
          </Text>

          {/* Name */}
          <Text style={styles.label}>Name</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <Pressable
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={21}
                color="#6B7280"
              />
            </Pressable>
          </View>

          {/* Login Button */}
          <Pressable
            style={[
              styles.loginButton,
              loggingIn && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loggingIn}
          >
            <Text style={styles.loginText}>
              {loggingIn
                ? "Logging in..."
                : "Login"}
            </Text>
          </Pressable>

          <Text style={styles.demoText}>
            Enter any name, email and password to continue.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 35,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    marginTop: 14,
  },

  inputContainer: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },

  loginButton: {
    height: 55,
    backgroundColor: "#3B82F6",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  demoText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 18,
  },
});