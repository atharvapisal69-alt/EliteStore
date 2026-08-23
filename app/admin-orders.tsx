import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import {
  getAllOrders,
  Order,
} from "@/services/orderService";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const loadOrders = useCallback(
    async () => {
      try {
        const data = await getAllOrders();

        setOrders(data);
      } catch (error) {
        console.log(
          "Error loading admin orders:",
          error
        );

        setOrders([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return {
          backgroundColor: "#DCFCE7",
          color: "#15803D",
        };

      case "Cancelled":
        return {
          backgroundColor: "#FEE2E2",
          color: "#DC2626",
        };

      case "Shipped":
        return {
          backgroundColor: "#DBEAFE",
          color: "#2563EB",
        };

      case "Processing":
      case "Ready to Ship":
        return {
          backgroundColor: "#FEF3C7",
          color: "#B45309",
        };

      default:
        return {
          backgroundColor: "#EEF2FF",
          color: Colors.light.primary,
        };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={Colors.light.primary}
          />

          <Text style={styles.loadingText}>
            Loading all orders...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.replace("/admin")
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111827"
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            All Orders
          </Text>

          <Text style={styles.subtitle}>
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Ionicons
            name="receipt-outline"
            size={25}
            color={Colors.light.primary}
          />
        </View>
      </View>

      {/* ORDER LIST */}

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="receipt-outline"
              size={48}
              color={Colors.light.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            No Orders Yet
          </Text>

          <Text style={styles.emptyText}>
            Customer orders will appear here
            once they place an order.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={
                Colors.light.primary
              }
            />
          }
          renderItem={({ item }) => {
            const statusStyle =
              getStatusStyle(item.status);

            return (
              <Pressable
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
                      id: item.id,
                    },
                  })
                }
              >
                {/* ICON */}

                <View style={styles.iconBox}>
                  <Ionicons
                    name="receipt-outline"
                    size={24}
                    color={
                      Colors.light.primary
                    }
                  />
                </View>

                {/* ORDER INFO */}

                <View
                  style={styles.orderInfo}
                >
                  <Text
                    style={styles.orderId}
                    numberOfLines={1}
                  >
                    Order #{item.id}
                  </Text>

                  <Text
                    style={styles.customer}
                    numberOfLines={1}
                  >
                    Customer: {item.userId}
                  </Text>

                  <Text style={styles.date}>
                    {new Date(
                      item.date
                    ).toLocaleString()}
                  </Text>

                  <Text style={styles.items}>
                    {item.items.length}{" "}
                    {item.items.length === 1
                      ? "product"
                      : "products"}
                  </Text>
                </View>

                {/* RIGHT */}

                <View style={styles.right}>
                  <Text style={styles.total}>
                    ₹
                    {Number(
                      item.total
                    ).toFixed(2)}
                  </Text>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusStyle.backgroundColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            statusStyle.color,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9CA3AF"
                    style={styles.chevron}
                  />
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    height: 75,
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
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
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

  headerRight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  list: {
    padding: 16,
    paddingTop: 5,
    paddingBottom: 40,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  orderPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  orderInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  customer: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
  },

  date: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
  },

  items: {
    marginTop: 3,
    fontSize: 11,
    color: "#9CA3AF",
  },

  right: {
    alignItems: "flex-end",
    minWidth: 90,
  },

  total: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  chevron: {
    marginTop: 5,
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

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },
});