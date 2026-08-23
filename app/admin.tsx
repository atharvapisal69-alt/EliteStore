import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import {
  getAllOrders,
  Order,
} from "@/services/orderService";

export default function AdminScreen() {
  const { logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================
  // LOAD ALL ORDERS
  // =========================

  const loadOrders = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        console.log(
          "Admin: Loading ALL orders..."
        );

        const allOrders =
          await getAllOrders();

        console.log(
          "Admin: Total orders:",
          allOrders.length
        );

        setOrders(allOrders);
      } catch (error) {
        console.log(
          "Admin: Error loading orders:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // =========================
  // REFRESH WHEN SCREEN OPENS
  // =========================

  useFocusEffect(
    useCallback(() => {
      loadOrders();

      return undefined;
    }, [loadOrders])
  );

  // =========================
  // PULL TO REFRESH
  // =========================

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadOrders(false);
  };

  // =========================
  // TOTAL REVENUE
  // =========================

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  // =========================
  // TOTAL ITEMS SOLD
  // =========================

  const totalProductsSold = orders.reduce(
    (sum, order) =>
      sum +
      (order.items || []).reduce(
        (itemTotal, item) =>
          itemTotal +
          Number(item.quantity || 0),
        0
      ),
    0
  );

  // =========================
  // TOTAL CUSTOMERS
  // =========================

  const totalCustomers = new Set(
    orders
      .map((order) => order.userId)
      .filter(Boolean)
  ).size;

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    Alert.alert(
      "Admin Logout",
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
              await logout();

              router.replace("/login");
            } catch (error) {
              console.log(
                "Admin logout error:",
                error
              );

              Alert.alert(
                "Logout Failed",
                "Unable to logout. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        {/* =========================
            HEADER
        ========================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Admin Dashboard
            </Text>

            <Text style={styles.subtitle}>
              Manage your EliteMart store
            </Text>
          </View>

          <View style={styles.adminIcon}>
            <Ionicons
              name="shield-checkmark"
              size={25}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* =========================
            ADMIN PROFILE
        ========================= */}

        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons
              name="person"
              size={28}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              EliteMart Admin
            </Text>

            <Text style={styles.profileEmail}>
              admin@elitemart.com
            </Text>

            <View style={styles.adminBadge}>
              <Text
                style={styles.adminBadgeText}
              >
                ADMIN
              </Text>
            </View>
          </View>
        </View>

        {/* =========================
            OVERVIEW
        ========================= */}

        <Text style={styles.sectionTitle}>
          Overview
        </Text>

        <View style={styles.statsGrid}>
          {/* ORDERS */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    "#DCFCE7",
                },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={24}
                color="#16A34A"
              />
            </View>

            <Text style={styles.statNumber}>
              {orders.length}
            </Text>

            <Text style={styles.statLabel}>
              Orders
            </Text>
          </View>

          {/* ITEMS SOLD */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    "#DBEAFE",
                },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={24}
                color="#2563EB"
              />
            </View>

            <Text style={styles.statNumber}>
              {totalProductsSold}
            </Text>

            <Text style={styles.statLabel}>
              Items Sold
            </Text>
          </View>

          {/* REVENUE */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    "#FEF3C7",
                },
              ]}
            >
              <Ionicons
                name="cash-outline"
                size={24}
                color="#D97706"
              />
            </View>

            <Text
              style={styles.statNumber}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              ₹{totalRevenue.toFixed(0)}
            </Text>

            <Text style={styles.statLabel}>
              Revenue
            </Text>
          </View>

          {/* CUSTOMERS */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    "#FCE7F3",
                },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color="#DB2777"
              />
            </View>

            <Text style={styles.statNumber}>
              {totalCustomers}
            </Text>

            <Text style={styles.statLabel}>
              Customers
            </Text>
          </View>
        </View>

        {/* =========================
            MANAGEMENT
        ========================= */}

        <Text style={styles.sectionTitle}>
          Management
        </Text>

        {/* PRODUCTS */}

        <AdminMenu
          icon="cube-outline"
          title="Products"
          subtitle="Manage EliteMart products"
          color="#2563EB"
          onPress={() => {
            router.push(
              "/admin-products"
            );
          }}
        />

        {/* ORDERS */}

        <AdminMenu
          icon="receipt-outline"
          title="Orders"
          subtitle="View and manage customer orders"
          color="#16A34A"
          onPress={() => {
            router.push(
              "/admin-orders"
            );
          }}
        />

        {/* CUSTOMERS */}

        <AdminMenu
          icon="people-outline"
          title="Customers"
          subtitle={`${totalCustomers} registered ${
            totalCustomers === 1
              ? "customer"
              : "customers"
          }`}
          color="#D97706"
          onPress={() => {
            router.push(
              "/admin-customers"
            );
          }}
        />

        {/* SETTINGS */}

        <AdminMenu
          icon="settings-outline"
          title="Store Settings"
          subtitle="Manage store preferences"
          color="#6B7280"
          onPress={() => {
            router.push("/settings");
          }}
        />

        {/* =========================
            RECENT ORDERS
        ========================= */}

        <Text style={styles.sectionTitle}>
          Recent Orders
        </Text>

        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="receipt-outline"
              size={40}
              color="#9CA3AF"
            />

            <Text style={styles.emptyTitle}>
              No orders yet
            </Text>

            <Text style={styles.emptyText}>
              Customer orders will appear here.
            </Text>
          </View>
        ) : (
          orders
            .slice(0, 5)
            .map((order) => (
              <Pressable
                key={order.id}
                style={({ pressed }) => [
                  styles.orderCard,
                  pressed &&
                    styles.orderPressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname:
                      "/admin-order-details",
                    params: {
                      id: String(
                        order.id
                      ),
                    },
                  })
                }
              >
                <View
                  style={styles.orderIcon}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={21}
                    color="#2563EB"
                  />
                </View>

                <View
                  style={styles.orderInfo}
                >
                  <Text
                    style={styles.orderId}
                    numberOfLines={1}
                  >
                    {order.id}
                  </Text>

                  <Text
                    style={styles.orderDate}
                  >
                    {formatDate(
                      order.date
                    )}
                  </Text>
                </View>

                <View
                  style={styles.orderRight}
                >
                  <Text
                    style={
                      styles.orderTotal
                    }
                  >
                    ₹
                    {Number(
                      order.total || 0
                    ).toFixed(2)}
                  </Text>

                  <Text
                    style={
                      styles.orderStatus
                    }
                  >
                    {order.status}
                  </Text>
                </View>
              </Pressable>
            ))
        )}

        {/* =========================
            LOGOUT
        ========================= */}

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed &&
              styles.logoutPressed,
          ]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#EF4444"
          />

          <Text style={styles.logoutText}>
            Admin Logout
          </Text>
        </Pressable>

        <Text style={styles.version}>
          EliteMart Admin • v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================
// ADMIN MENU COMPONENT
// =========================

type AdminMenuProps = {
  icon: React.ComponentProps<
    typeof Ionicons
  >["name"];

  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
};

function AdminMenu({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: AdminMenuProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuCard,
        pressed &&
          styles.menuPressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor:
              `${color}18`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={color}
        />
      </View>

      <View style={styles.menuInfo}>
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

// =========================
// DATE FORMAT
// =========================

function formatDate(date: string) {
  try {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return date;
  }
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7280",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  adminIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
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

  profileIcon: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },

  profileName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  profileEmail: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },

  adminBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },

  adminBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 26,
    marginBottom: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },

  statIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },

  menuCard: {
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
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  menuInfo: {
    flex: 1,
    marginLeft: 12,
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  menuSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    elevation: 2,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 13,
    marginBottom: 9,
    elevation: 2,
  },

  orderPressed: {
    opacity: 0.75,
  },

  orderIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  orderInfo: {
    flex: 1,
    marginLeft: 11,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  orderDate: {
    marginTop: 3,
    fontSize: 11,
    color: "#6B7280",
  },

  orderRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  orderTotal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  orderStatus: {
    marginTop: 3,
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
  },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 15,
    paddingVertical: 16,
    marginTop: 25,
  },

  logoutPressed: {
    opacity: 0.75,
  },

  logoutText: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "800",
    color: "#EF4444",
  },

  version: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
    color: "#9CA3AF",
  },
});