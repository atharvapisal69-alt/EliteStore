import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";

const STATUS_STEPS = [
  "Placed",
  "Confirmed",
  "Processing",
  "Ready to Ship",
  "Shipped",
  "Delivered",
];

export default function OrderDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const { orders } = useCart();

  const order = orders.find(
    (item) => item.id === id
  );

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={48}
              color="#EF4444"
            />
          </View>

          <Text style={styles.errorTitle}>
            Order Not Found
          </Text>

          <Text style={styles.errorText}>
            This order could not be found.
          </Text>

          <Pressable
            style={styles.backHomeButton}
            onPress={() =>
              router.replace("/orders")
            }
          >
            <Text
              style={styles.backHomeText}
            >
              Back to Orders
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentIndex =
    STATUS_STEPS.indexOf(order.status);

  const isCancelled =
    order.status === "Cancelled";

  const formattedDate =
    new Date(order.date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  const formattedTime =
    new Date(order.date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

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
              size={23}
              color="#111827"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Order Details
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Order Header */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <View style={styles.receiptIcon}>
              <Ionicons
                name="receipt-outline"
                size={29}
                color={Colors.light.primary}
              />
            </View>

            <View style={styles.orderHeaderInfo}>
              <Text style={styles.orderId}>
                Order #{order.id.slice(0, 8)}
              </Text>

              <Text style={styles.orderDate}>
                {formattedDate}
              </Text>

              <Text style={styles.orderTime}>
                {formattedTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Tracking */}
        <Text style={styles.sectionTitle}>
          Order Status
        </Text>

        <View style={styles.card}>
          {isCancelled ? (
            <View style={styles.cancelledBox}>
              <View style={styles.cancelledIcon}>
                <Ionicons
                  name="close"
                  size={23}
                  color="#DC2626"
                />
              </View>

              <View style={styles.cancelledInfo}>
                <Text
                  style={styles.cancelledTitle}
                >
                  Order Cancelled
                </Text>

                <Text
                  style={styles.cancelledText}
                >
                  This order has been cancelled.
                </Text>
              </View>
            </View>
          ) : (
            <View>
              {STATUS_STEPS.map(
                (status, index) => {
                  const completed =
                    index <= currentIndex;

                  const isCurrent =
                    index === currentIndex;

                  return (
                    <View
                      key={status}
                      style={
                        styles.timelineRow
                      }
                    >
                      <View
                        style={
                          styles.timelineLeft
                        }
                      >
                        <View
                          style={[
                            styles.timelineCircle,
                            completed &&
                              styles.timelineCircleActive,
                          ]}
                        >
                          {completed && (
                            <Ionicons
                              name={
                                isCurrent
                                  ? "ellipse"
                                  : "checkmark"
                              }
                              size={
                                isCurrent
                                  ? 9
                                  : 16
                              }
                              color="#FFFFFF"
                            />
                          )}
                        </View>

                        {index !==
                          STATUS_STEPS.length -
                            1 && (
                          <View
                            style={[
                              styles.timelineLine,
                              index <
                                currentIndex &&
                                styles.timelineLineActive,
                            ]}
                          />
                        )}
                      </View>

                      <View
                        style={
                          styles.timelineContent
                        }
                      >
                        <Text
                          style={[
                            styles.timelineTitle,
                            completed &&
                              styles.timelineTitleActive,
                          ]}
                        >
                          {status}
                        </Text>

                        {isCurrent && (
                          <Text
                            style={
                              styles.currentText
                            }
                          >
                            Current order status
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          )}
        </View>

        {/* Products */}
        <Text style={styles.sectionTitle}>
          Products
        </Text>

        <View style={styles.card}>
          {order.items.map(
            (item, index) => (
              <View
                key={`${item.id}-${index}`}
                style={[
                  styles.productRow,
                  index !==
                    order.items.length - 1 &&
                    styles.productBorder,
                ]}
              >
                <View style={styles.productImage}>
                  <Ionicons
                    name="cube-outline"
                    size={25}
                    color={
                      Colors.light.primary
                    }
                  />
                </View>

                <View style={styles.productInfo}>
                  <Text
                    style={styles.productTitle}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <Text style={styles.quantity}>
                    ₹{item.price.toFixed(2)} ×{" "}
                    {item.quantity}
                  </Text>
                </View>

                <Text
                  style={styles.productTotal}
                >
                  ₹
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </Text>
              </View>
            )
          )}
        </View>

        {/* Payment Summary */}
        <Text style={styles.sectionTitle}>
          Order Summary
        </Text>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Items
            </Text>

            <Text style={styles.summaryValue}>
              {order.items.reduce(
                (sum, item) =>
                  sum + item.quantity,
                0
              )}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Product Total
            </Text>

            <Text style={styles.summaryValue}>
              ₹
              {order.items
                .reduce(
                  (sum, item) =>
                    sum +
                    item.price *
                      item.quantity,
                  0
                )
                .toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Delivery
            </Text>

            <Text
              style={[
                styles.summaryValue,
                styles.freeDelivery,
              ]}
            >
              Included
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              ₹{order.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Customer ID */}
        <View style={styles.customerCard}>
          <Ionicons
            name="person-circle-outline"
            size={25}
            color="#6B7280"
          />

          <View style={styles.customerInfo}>
            <Text style={styles.customerLabel}>
              Customer Account
            </Text>

            <Text
              style={styles.customerId}
              numberOfLines={1}
            >
              {order.userId}
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <Pressable
          style={styles.ordersButton}
          onPress={() =>
            router.replace("/orders")
          }
        >
          <Ionicons
            name="receipt-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.ordersButtonText}>
            Back to My Orders
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  content: {
    padding: 16,
    paddingBottom: 45,
  },

  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  receiptIcon: {
    width: 62,
    height: 62,
    borderRadius: 17,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  orderHeaderInfo: {
    marginLeft: 14,
    flex: 1,
  },

  orderId: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  orderDate: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  orderTime: {
    marginTop: 2,
    fontSize: 12,
    color: "#9CA3AF",
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 11,
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 62,
  },

  timelineLeft: {
    width: 35,
    alignItems: "center",
  },

  timelineCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  timelineCircleActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  timelineLine: {
    position: "absolute",
    top: 28,
    bottom: 0,
    width: 2,
    backgroundColor: "#E5E7EB",
  },

  timelineLineActive: {
    backgroundColor: Colors.light.primary,
  },

  timelineContent: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 3,
  },

  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  timelineTitleActive: {
    color: "#111827",
  },

  currentText: {
    marginTop: 3,
    fontSize: 11,
    color: Colors.light.primary,
    fontWeight: "600",
  },

  cancelledBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  cancelledIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelledInfo: {
    marginLeft: 12,
    flex: 1,
  },

  cancelledTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#DC2626",
  },

  cancelledText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  productBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  productImage: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  productTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    color: "#111827",
  },

  quantity: {
    marginTop: 5,
    fontSize: 12,
    color: "#6B7280",
  },

  productTotal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  freeDelivery: {
    color: "#16A34A",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 7,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  totalValue: {
    fontSize: 21,
    fontWeight: "800",
    color: Colors.light.primary,
  },

  customerCard: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  customerInfo: {
    flex: 1,
    marginLeft: 10,
  },

  customerLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  customerId: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  ordersButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  ordersButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  errorIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  errorText: {
    marginTop: 7,
    color: "#6B7280",
    fontSize: 14,
  },

  backHomeButton: {
    marginTop: 22,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: Colors.light.primary,
  },

  backHomeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});