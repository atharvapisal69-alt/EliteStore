import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Success() {
  const orderId =
    "#" + Math.floor(100000 + Math.random() * 900000);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            size={120}
            color="#22C55E"
          />
        </View>

        <Text style={styles.title}>
          Order Placed Successfully!
        </Text>

        <Text style={styles.subtitle}>
          Thank you for shopping with EliteStore.
        </Text>

        <Text style={styles.orderId}>
          Order ID: {orderId}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>
            Continue Shopping
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  iconContainer: {
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },

  orderId: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.primary,
  },

  button: {
    marginTop: 40,
    width: "100%",
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});