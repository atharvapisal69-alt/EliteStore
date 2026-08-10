import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notifications, setNotifications] =
    useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={Colors.light.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Settings
          </Text>

          <View style={{ width: 42 }} />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>
          Preferences
        </Text>

        <View style={styles.card}>
          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.light.primary}
              />
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                Notifications
              </Text>

              <Text style={styles.settingSubtitle}>
                Receive order and shopping updates
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "#D1D5DB",
                true: Colors.light.primary,
              }}
            />
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>
          <Pressable
            style={styles.menuRow}
            onPress={() => router.push("/orders")}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="receipt-outline"
                size={22}
                color={Colors.light.primary}
              />
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                My Orders
              </Text>

              <Text style={styles.settingSubtitle}>
                View your previous orders
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9CA3AF"
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuRow}
            onPress={() => router.push("/wishlist")}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="heart-outline"
                size={22}
                color="#EF4444"
              />
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                Wishlist
              </Text>

              <Text style={styles.settingSubtitle}>
                View your saved products
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>
          About
        </Text>

        <View style={styles.card}>
          <Pressable
            style={styles.menuRow}
            onPress={() =>
              Alert.alert(
                "EliteMart",
                "EliteMart is a React Native shopping application built with Expo."
              )
            }
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#6B7280"
              />
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                About EliteMart
              </Text>

              <Text style={styles.settingSubtitle}>
                Learn more about the app
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9CA3AF"
            />
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.menuRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="code-slash-outline"
                size={22}
                color="#6B7280"
              />
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                App Version
              </Text>

              <Text style={styles.settingSubtitle}>
                EliteMart v1.0.0
              </Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={() =>
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: () =>
                    router.replace("/"),
                },
              ]
            )
          }
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#EF4444"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          EliteMart
        </Text>

        <Text style={styles.version}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    elevation: 2,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },

  settingSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 28,
  },

  logoutText: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "700",
    color: "#EF4444",
  },

  footerText: {
    textAlign: "center",
    marginTop: 28,
    fontSize: 15,
    fontWeight: "600",
    color: "#9CA3AF",
  },

  version: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 13,
    color: "#9CA3AF",
  },
});