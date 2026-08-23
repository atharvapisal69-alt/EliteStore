import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";

export default function OrdersScreen() {
  const { orders } = useCart();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "#16A34A";
      case "Cancelled":
        return "#DC2626";
      case "Shipped":
        return "#7C3AED";
      case "Ready to Ship":
        return "#0891B2";
      case "Processing":
        return "#EA580C";
      case "Confirmed":
        return "#2563EB";
      default:
        return "#6B7280";
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case "Delivered":
        return "#DCFCE7";
      case "Cancelled":
        return "#FEE2E2";
      case "Shipped":
        return "#EDE9FE";
      case "Ready to Ship":
        return "#CFFAFE";
      case "Processing":
        return "#FFEDD5";
      case "Confirmed":
        return "#DBEAFE";
      default:
        return "#F3F4F6";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#111827"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          My Orders
        </Text>

        <View style={styles.headerSpace} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
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
            You haven&apos;t placed any orders yet.
            Start shopping and your orders will
            appear here.
          </Text>

          <Pressable
            style={styles.shopButton}
            onPress={() =>
              router.replace("/(tabs)")
            }
          >
            <Ionicons
              name="bag-handle-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.shopButtonText}>
              Start Shopping
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const statusColor =
              getStatusColor(item.status);

            const statusBackground =
              getStatusBackground(item.status);

            const formattedDate =
              new Date(item.date).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              );

            return (
              <Pressable
                style={({ pressed }) => [
                  styles.orderCard,
                  pressed && styles.pressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname:
                      "/order-details",
                    params: {
                      id: item.id,
                    },
                  })
                }
              >
                {/* Top */}
                <View style={styles.orderTop}>
                  <View style={styles.receiptIcon}>
                    <Ionicons
                      name="receipt-outline"
                      size={25}
                      color={Colors.light.primary}
                    />
                  </View>

                  <View style={styles.orderInfo}>
                    <Text
                      style={styles.orderId}
                      numberOfLines={1}
                    >
                      Order #{item.id.slice(0, 8)}
                    </Text>

                    <Text style={styles.date}>
                      {formattedDate}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={21}
                    color="#9CA3AF"
                  />
                </View>

                <View style={styles.divider} />

                {/* Bottom */}
                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.items}>
                      {item.items.length}{" "}
                      {item.items.length === 1
                        ? "product"
                        : "products"}
                    </Text>

                    <Text style={styles.total}>
                      ₹{item.total.toFixed(2)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusBackground,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            statusColor,
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: statusColor,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
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
    backgroundColor: Colors.light.background,
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  headerSpace: {
    width: 43,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  list: {
    padding: 16,
    paddingBottom: 40,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 13,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },

  orderTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  receiptIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  orderInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "#6B7280",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  items: {
    fontSize: 12,
    color: "#6B7280",
  },

  total: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },

  shopButton: {
    marginTop: 24,
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  shopButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});