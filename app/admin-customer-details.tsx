import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAllOrders } from "@/services/orderService";

type CustomerOrder = {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  total: number;
  date: string;
  status: string;
  items: any[];
};

export default function AdminCustomerDetailsScreen() {
  const params = useLocalSearchParams<{
    userId?: string | string[];
    name?: string | string[];
    email?: string | string[];
  }>();

  // --------------------------------
  // GET PARAMS SAFELY
  // --------------------------------

  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  const paramName = Array.isArray(params.name)
    ? params.name[0]
    : params.name;

  const paramEmail = Array.isArray(params.email)
    ? params.email[0]
    : params.email;

  console.log("================================");
  console.log("CUSTOMER DETAILS");
  console.log("CUSTOMER ID:", userId);
  console.log("CUSTOMER NAME:", paramName);
  console.log("CUSTOMER EMAIL:", paramEmail);
  console.log("================================");

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // LOAD CUSTOMER ORDERS
  // --------------------------------

  useEffect(() => {
    if (!userId) {
      console.log("NO CUSTOMER ID RECEIVED");
      setLoading(false);
      return;
    }

    loadCustomerOrders();
  }, [userId]);

  const loadCustomerOrders = async () => {
    try {
      setLoading(true);

      console.log("Loading orders for customer:", userId);

      const allOrders = await getAllOrders();

      console.log("ALL ORDERS:", allOrders);

      const customerOrders = allOrders.filter(
        (order) =>
          String(order.userId) === String(userId)
      );

      console.log(
        "CUSTOMER ORDERS:",
        customerOrders
      );

      setOrders(customerOrders);
    } catch (error) {
      console.log(
        "ERROR LOADING CUSTOMER ORDERS:",
        error
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // CUSTOMER INFORMATION
  // --------------------------------

  const firstOrder = orders[0];

  const customerName =
    firstOrder?.userName ||
    paramName ||
    "Customer";

  const customerEmail =
    firstOrder?.userEmail ||
    paramEmail ||
    "No email";

  // --------------------------------
  // TOTAL SPENT
  // --------------------------------

  const totalSpent = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  // --------------------------------
  // INITIAL
  // --------------------------------

  const initial =
    customerName
      .trim()
      .charAt(0)
      .toUpperCase() || "C";

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Loading customer...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------
  // SCREEN
  // --------------------------------

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111827"
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            Customer Details
          </Text>

          <Text style={styles.subtitle}>
            Customer profile
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* CUSTOMER PROFILE */}

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initial}
          </Text>
        </View>

        <Text style={styles.customerName}>
          {customerName}
        </Text>

        <View style={styles.emailRow}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#6B7280"
          />

          <Text
            style={styles.email}
            numberOfLines={1}
          >
            {customerEmail}
          </Text>
        </View>

        <Text
          style={styles.customerId}
          numberOfLines={1}
        >
          ID: {userId || "Unknown"}
        </Text>
      </View>

      {/* STATS */}

      <View style={styles.statsRow}>
        {/* ORDERS */}

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              {
                backgroundColor: "#DBEAFE",
              },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={25}
              color="#2563EB"
            />
          </View>

          <Text style={styles.statNumber}>
            {orders.length}
          </Text>

          <Text style={styles.statLabel}>
            Orders
          </Text>
        </View>

        {/* TOTAL SPENT */}

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              {
                backgroundColor: "#DCFCE7",
              },
            ]}
          >
            <Ionicons
              name="cash-outline"
              size={25}
              color="#16A34A"
            />
          </View>

          <Text style={styles.statNumber}>
            ₹{totalSpent.toFixed(0)}
          </Text>

          <Text style={styles.statLabel}>
            Total Spent
          </Text>
        </View>
      </View>

      {/* ORDER HISTORY */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Order History
        </Text>

        <Text style={styles.orderCount}>
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </Text>
      </View>

      {/* ORDERS */}

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onRefresh={loadCustomerOrders}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            {/* TOP */}

            <View style={styles.orderTop}>
              <View style={styles.orderLeft}>
                <View style={styles.orderIcon}>
                  <Ionicons
                    name="receipt-outline"
                    size={22}
                    color="#2563EB"
                  />
                </View>

                <View>
                  <Text style={styles.orderId}>
                    Order #
                    {item.id.slice(0, 8)}
                  </Text>

                  <Text style={styles.orderDate}>
                    {formatDate(item.date)}
                  </Text>
                </View>
              </View>

              {/* STATUS */}

              <View
                style={[
                  styles.statusBadge,
                  getStatusStyle(item.status),
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    getStatusTextStyle(
                      item.status
                    ),
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {/* BOTTOM */}

            <View style={styles.orderBottom}>
              <View>
                <Text style={styles.itemCount}>
                  {item.items?.length || 0}{" "}
                  {item.items?.length === 1
                    ? "item"
                    : "items"}
                </Text>
              </View>

              <Text style={styles.orderTotal}>
                ₹
                {Number(
                  item.total || 0
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="receipt-outline"
                size={48}
                color="#9CA3AF"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Orders
            </Text>

            <Text style={styles.emptyText}>
              This customer has not placed
              any orders yet.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// =================================
// DATE FORMAT
// =================================

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return date;
  }
}

// =================================
// STATUS BACKGROUND
// =================================

function getStatusStyle(status: string) {
  switch (status) {
    case "Delivered":
      return {
        backgroundColor: "#DCFCE7",
      };

    case "Cancelled":
      return {
        backgroundColor: "#FEE2E2",
      };

    case "Shipped":
      return {
        backgroundColor: "#DBEAFE",
      };

    case "Confirmed":
      return {
        backgroundColor: "#E0E7FF",
      };

    case "Processing":
      return {
        backgroundColor: "#FEF3C7",
      };

    case "Ready to Ship":
      return {
        backgroundColor: "#F3E8FF",
      };

    default:
      return {
        backgroundColor: "#F3F4F6",
      };
  }
}

// =================================
// STATUS TEXT
// =================================

function getStatusTextStyle(status: string) {
  switch (status) {
    case "Delivered":
      return {
        color: "#15803D",
      };

    case "Cancelled":
      return {
        color: "#DC2626",
      };

    case "Shipped":
      return {
        color: "#2563EB",
      };

    case "Confirmed":
      return {
        color: "#4F46E5",
      };

    case "Processing":
      return {
        color: "#B45309",
      };

    case "Ready to Ship":
      return {
        color: "#9333EA",
      };

    default:
      return {
        color: "#6B7280",
      };
  }
}

// =================================
// STYLES
// =================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  placeholder: {
    width: 44,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  profileCard: {
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 29,
    fontWeight: "800",
    color: "#2563EB",
  },

  customerName: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    maxWidth: "95%",
  },

  email: {
    marginLeft: 7,
    fontSize: 13,
    color: "#6B7280",
  },

  customerId: {
    marginTop: 7,
    fontSize: 10,
    color: "#9CA3AF",
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    paddingVertical: 14,
    alignItems: "center",
    elevation: 2,
  },

  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  statNumber: {
    marginTop: 7,
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  orderCount: {
    fontSize: 12,
    color: "#6B7280",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },

  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  orderIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  orderDate: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  orderBottom: {
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemCount: {
    fontSize: 12,
    color: "#6B7280",
  },

  orderTotal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16A34A",
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 70,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    marginTop: 7,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});