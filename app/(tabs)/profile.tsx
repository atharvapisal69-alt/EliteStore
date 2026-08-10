import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const { cart, orders } = useCart();
  const { wishlist } = useWishlist();

  const displayName = user?.name || "User";

  const avatarLetter =
    displayName.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
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
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "cart",
                "wishlist",
                "orders",
              ]);

              await logout();
            } catch (error) {
              console.log(
                "Logout error:",
                error
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.header}>
              My Profile
            </Text>

            <Text style={styles.headerSubtitle}>
              Manage your EliteMart account
            </Text>
          </View>

          <Pressable
            style={styles.settingsCircle}
            onPress={() =>
              router.push("/settings")
            }
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={Colors.light.primary}
            />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {avatarLetter}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text
              style={styles.name}
              numberOfLines={1}
            >
              {displayName}
            </Text>

            <Text
              style={styles.email}
              numberOfLines={1}
            >
              {user?.email || "Welcome to EliteMart"}
            </Text>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push("/settings")
            }
          >
            <Ionicons
              name="create-outline"
              size={21}
              color={Colors.light.primary}
            />
          </Pressable>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <View style={styles.statIcon}>
              <Ionicons
                name="receipt-outline"
                size={20}
                color={Colors.light.primary}
              />
            </View>

            <Text style={styles.statNumber}>
              {orders.length}
            </Text>

            <Text style={styles.statLabel}>
              Orders
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <View style={styles.statIcon}>
              <Ionicons
                name="heart-outline"
                size={20}
                color="#EF4444"
              />
            </View>

            <Text style={styles.statNumber}>
              {wishlist.length}
            </Text>

            <Text style={styles.statLabel}>
              Wishlist
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <View style={styles.statIcon}>
              <Ionicons
                name="cart-outline"
                size={20}
                color={Colors.light.primary}
              />
            </View>

            <Text style={styles.statNumber}>
              {cart.length}
            </Text>

            <Text style={styles.statLabel}>
              Cart
            </Text>
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>
          My Account
        </Text>

        <MenuItem
          icon="receipt-outline"
          title="My Orders"
          subtitle="View your order history"
          iconColor={Colors.light.primary}
          onPress={() =>
            router.push("/orders")
          }
        />

        <MenuItem
          icon="heart-outline"
          title="Wishlist"
          subtitle="Your saved products"
          iconColor="#EF4444"
          onPress={() =>
            router.push("/(tabs)/wishlist")
          }
        />

        <MenuItem
          icon="cart-outline"
          title="My Cart"
          subtitle="View your shopping cart"
          iconColor={Colors.light.primary}
          onPress={() =>
            router.push("/(tabs)/cart")
          }
        />

        {/* Settings */}
        <Text style={styles.sectionTitle}>
          Settings
        </Text>

        <MenuItem
          icon="settings-outline"
          title="Settings"
          subtitle="App preferences and account"
          iconColor="#6B7280"
          onPress={() =>
            router.push("/settings")
          }
        />

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
          onPress={handleLogout}
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

        {/* Version */}
        <Text style={styles.version}>
          EliteMart v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type MenuItemProps = {
  icon: React.ComponentProps<
    typeof Ionicons
  >["name"];
  title: string;
  subtitle: string;
  iconColor: string;
  onPress: () => void;
};

function MenuItem({
  icon,
  title,
  subtitle,
  iconColor,
  onPress,
}: MenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={icon}
          size={22}
          color={iconColor}
        />
      </View>

      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        <Text style={styles.menuSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9CA3AF"
      />
    </Pressable>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.light.text,
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  settingsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 29,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.light.text,
  },

  email: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  editButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 15,
    marginTop: 15,
    elevation: 2,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.text,
  },

  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: Colors.light.text,
    marginTop: 28,
    marginBottom: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },

  menuPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },

  menuSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 25,
  },

  logoutPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  logoutText: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "800",
    color: "#EF4444",
  },

  version: {
    textAlign: "center",
    marginTop: 25,
    color: "#9CA3AF",
    fontSize: 13,
  },
});