import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getOrderById,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/services/orderService";

// ======================================================
// STATUS LIST
// ======================================================

const STATUSES: OrderStatus[] = [
  "Placed",
  "Confirmed",
  "Processing",
  "Ready to Ship",
  "Shipped",
  "Delivered",
];

// ======================================================
// SCREEN
// ======================================================

export default function AdminOrderDetailsScreen() {
  const params =
    useLocalSearchParams<{
      id?: string | string[];
    }>();

  const orderId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  // ====================================================
  // LOAD ORDER
  // ====================================================

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);

      if (!orderId) {
        console.log(
          "ORDER ID IS MISSING"
        );

        setOrder(null);
        return;
      }

      console.log(
        "LOADING ORDER:",
        orderId
      );

      const data =
        await getOrderById(
          orderId
        );

      console.log(
        "ORDER DETAILS:",
        data
      );

      setOrder(data);
    } catch (error) {
      console.error(
        "Error loading order:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UPDATE STATUS
  // ====================================================

  const changeStatus = async (
    status: OrderStatus
  ) => {
    if (!order) {
      return;
    }

    if (
      order.status === status
    ) {
      return;
    }

    try {
      setUpdating(true);

      console.log(
        "UPDATING ORDER STATUS:",
        order.id,
        status
      );

      await updateOrderStatus(
        order.id,
        status
      );

      // Update screen immediately
      setOrder((current) =>
        current
          ? {
              ...current,
              status,
            }
          : current
      );

      Alert.alert(
        "Status Updated",
        `Order status changed to "${status}".`
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      Alert.alert(
        "Update Failed",
        "Unable to update order status. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ====================================================
  // CANCEL ORDER
  // ====================================================

  const cancelOrder = () => {
    if (!order) {
      return;
    }

    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdating(true);

              await updateOrderStatus(
                order.id,
                "Cancelled"
              );

              setOrder((current) =>
                current
                  ? {
                      ...current,
                      status:
                        "Cancelled",
                    }
                  : current
              );

              Alert.alert(
                "Order Cancelled",
                "The order has been cancelled successfully."
              );
            } catch (error) {
              console.error(
                "Cancel order error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to cancel order."
              );
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading order...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ====================================================
  // ORDER NOT FOUND
  // ====================================================

  if (!order) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <View
            style={
              styles.errorIcon
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={50}
              color="#EF4444"
            />
          </View>

          <Text
            style={styles.errorTitle}
          >
            Order Not Found
          </Text>

          <Text
            style={styles.errorText}
          >
            This order could not be found.
          </Text>

          <Pressable
            style={
              styles.dashboardButton
            }
            onPress={() =>
              router.replace(
                "/admin"
              )
            }
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.dashboardButtonText
              }
            >
              Back to Admin Dashboard
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ====================================================
  // MAIN UI
  // ====================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <View
          style={styles.header}
        >
          <Pressable
            style={
              styles.headerBack
            }
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </Pressable>

          <Text
            style={
              styles.headerTitle
            }
          >
            Order Details
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>

        {/* ==========================================
            ORDER INFORMATION
        ========================================== */}

        <View style={styles.card}>
          <View
            style={styles.orderTop}
          >
            <View
              style={
                styles.receiptIcon
              }
            >
              <Ionicons
                name="receipt-outline"
                size={28}
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
                style={
                  styles.orderDate
                }
              >
                {formatDate(
                  order.date
                )}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.infoDivider
            }
          />

          {/* CUSTOMER NAME */}

          <View
            style={styles.infoRow}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Customer
            </Text>

            <Text
              style={
                styles.infoValue
              }
              numberOfLines={1}
            >
              {order.userName ||
                "Customer"}
            </Text>
          </View>

          {/* CUSTOMER EMAIL */}

          <View
            style={styles.infoRow}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Email
            </Text>

            <Text
              style={
                styles.infoValue
              }
              numberOfLines={1}
            >
              {order.userEmail ||
                "No email"}
            </Text>
          </View>

          {/* CUSTOMER ID */}

          <View
            style={styles.infoRow}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Customer ID
            </Text>

            <Text
              style={
                styles.infoValue
              }
              numberOfLines={1}
            >
              {order.userId ||
                "Unknown"}
            </Text>
          </View>

          {/* CURRENT STATUS */}

          <View
            style={styles.infoRow}
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              Current Status
            </Text>

            <View
              style={[
                styles.statusBadge,
                getStatusStyle(
                  order.status
                ),
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      getStatusColor(
                        order.status
                      ),
                  },
                ]}
              />

              <Text
                style={[
                  styles.statusBadgeText,
                  {
                    color:
                      getStatusColor(
                        order.status
                      ),
                  },
                ]}
              >
                {order.status}
              </Text>
            </View>
          </View>
        </View>

        {/* ==========================================
            PRODUCTS
        ========================================== */}

        <Text
          style={styles.sectionTitle}
        >
          Products
        </Text>

        <View style={styles.card}>
          {order.items &&
          order.items.length > 0 ? (
            order.items.map(
              (product, index) => (
                <View
                  key={`${product.id}-${index}`}
                  style={[
                    styles.productRow,
                    index !==
                      order.items.length -
                        1 &&
                      styles.productBorder,
                  ]}
                >
                  <View
                    style={
                      styles.productIcon
                    }
                  >
                    <Ionicons
                      name="cube-outline"
                      size={23}
                      color="#2563EB"
                    />
                  </View>

                  <View
                    style={
                      styles.productInfo
                    }
                  >
                    <Text
                      style={
                        styles.productName
                      }
                      numberOfLines={
                        2
                      }
                    >
                      {product.title ||
                        "Product"}
                    </Text>

                    <Text
                      style={
                        styles.quantity
                      }
                    >
                      ₹
                      {Number(
                        product.price
                      ).toFixed(2)}{" "}
                      ×{" "}
                      {product.quantity}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.productTotal
                    }
                  >
                    ₹
                    {(
                      Number(
                        product.price
                      ) *
                      Number(
                        product.quantity
                      )
                    ).toFixed(2)}
                  </Text>
                </View>
              )
            )
          ) : (
            <Text
              style={styles.noProducts}
            >
              No products found.
            </Text>
          )}

          <View
            style={
              styles.totalDivider
            }
          />

          <View
            style={styles.totalRow}
          >
            <Text
              style={styles.totalLabel}
            >
              Order Total
            </Text>

            <Text
              style={styles.totalValue}
            >
              ₹
              {Number(
                order.total
              ).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* ==========================================
            STATUS
        ========================================== */}

        <Text
          style={styles.sectionTitle}
        >
          Change Order Status
        </Text>

        <View style={styles.card}>
          {STATUSES.map(
            (status) => {
              const selected =
                order.status ===
                status;

              return (
                <Pressable
                  key={status}
                  disabled={updating}
                  style={[
                    styles.statusOption,
                    selected &&
                      styles.statusOptionSelected,
                    updating &&
                      styles.disabledOption,
                  ]}
                  onPress={() =>
                    changeStatus(
                      status
                    )
                  }
                >
                  <View
                    style={[
                      styles.radio,
                      selected &&
                        styles.radioSelected,
                    ]}
                  >
                    {selected && (
                      <View
                        style={
                          styles.radioInner
                        }
                      />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.statusOptionText,
                      selected &&
                        styles.statusOptionTextSelected,
                    ]}
                  >
                    {status}
                  </Text>

                  {selected && (
                    <View
                      style={
                        styles.checkIcon
                      }
                    >
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </Pressable>
              );
            }
          )}

          {/* CANCEL */}

          {order.status !==
            "Cancelled" && (
            <Pressable
              disabled={updating}
              style={[
                styles.cancelButton,
                updating &&
                  styles.disabledOption,
              ]}
              onPress={
                cancelOrder
              }
            >
              <Ionicons
                name="close-circle-outline"
                size={23}
                color="#DC2626"
              />

              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel Order
              </Text>
            </Pressable>
          )}

          {updating && (
            <View
              style={
                styles.updatingContainer
              }
            >
              <ActivityIndicator
                size="small"
                color="#2563EB"
              />

              <Text
                style={
                  styles.updatingText
                }
              >
                Updating order...
              </Text>
            </View>
          )}
        </View>

        {/* ==========================================
            DASHBOARD BUTTON
        ========================================== */}

        <Pressable
          style={
            styles.dashboardButton
          }
          onPress={() =>
            router.replace(
              "/admin"
            )
          }
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.dashboardButtonText
            }
          >
            Back to Admin Dashboard
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(
  date: string
) {
  if (!date) {
    return "Unknown date";
  }

  try {
    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return date;
  }
}

// ======================================================
// STATUS BACKGROUND
// ======================================================

function getStatusStyle(
  status: OrderStatus
) {
  switch (status) {
    case "Delivered":
      return {
        backgroundColor:
          "#DCFCE7",
      };

    case "Cancelled":
      return {
        backgroundColor:
          "#FEE2E2",
      };

    case "Shipped":
      return {
        backgroundColor:
          "#DBEAFE",
      };

    case "Ready to Ship":
      return {
        backgroundColor:
          "#E0E7FF",
      };

    case "Processing":
      return {
        backgroundColor:
          "#F3E8FF",
      };

    case "Confirmed":
      return {
        backgroundColor:
          "#DCFCE7",
      };

    default:
      return {
        backgroundColor:
          "#FEF3C7",
      };
  }
}

// ======================================================
// STATUS COLOR
// ======================================================

function getStatusColor(
  status: OrderStatus
) {
  switch (status) {
    case "Delivered":
      return "#15803D";

    case "Cancelled":
      return "#DC2626";

    case "Shipped":
      return "#2563EB";

    case "Ready to Ship":
      return "#4F46E5";

    case "Processing":
      return "#9333EA";

    case "Confirmed":
      return "#16A34A";

    default:
      return "#B45309";
  }
}

// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F6F7FB",
    },

    content: {
      padding: 16,
      paddingBottom: 45,
    },

    center: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      padding: 25,
    },

    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: "#6B7280",
    },

    errorIcon: {
      width: 85,
      height: 85,
      borderRadius: 43,
      backgroundColor:
        "#FEE2E2",
      justifyContent:
        "center",
      alignItems: "center",
    },

    errorTitle: {
      marginTop: 15,
      fontSize: 21,
      fontWeight: "800",
      color: "#111827",
    },

    errorText: {
      marginTop: 6,
      fontSize: 14,
      color: "#6B7280",
      textAlign: "center",
    },

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      marginBottom: 18,
    },

    headerBack: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        "#FFFFFF",
      justifyContent:
        "center",
      alignItems: "center",
      elevation: 2,
    },

    headerSpace: {
      width: 44,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: "#111827",
    },

    card: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 20,
      padding: 16,
      elevation: 2,
    },

    orderTop: {
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    receiptIcon: {
      width: 58,
      height: 58,
      borderRadius: 16,
      backgroundColor:
        "#DBEAFE",
      justifyContent:
        "center",
      alignItems: "center",
    },

    orderInfo: {
      flex: 1,
      marginLeft: 13,
    },

    orderId: {
      fontSize: 17,
      fontWeight: "800",
      color: "#111827",
    },

    orderDate: {
      marginTop: 4,
      fontSize: 13,
      color: "#6B7280",
    },

    infoDivider: {
      height: 1,
      backgroundColor:
        "#E5E7EB",
      marginVertical: 16,
    },

    infoRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom: 12,
    },

    infoLabel: {
      fontSize: 13,
      color: "#6B7280",
    },

    infoValue: {
      maxWidth: "62%",
      fontSize: 13,
      fontWeight: "700",
      color: "#111827",
    },

    statusBadge: {
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
    },

    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginRight: 6,
    },

    statusBadgeText: {
      fontSize: 11,
      fontWeight: "800",
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#111827",
      marginTop: 25,
      marginBottom: 12,
    },

    productRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingVertical: 13,
    },

    productBorder: {
      borderBottomWidth: 1,
      borderBottomColor:
        "#E5E7EB",
    },

    productIcon: {
      width: 54,
      height: 54,
      borderRadius: 15,
      backgroundColor:
        "#EEF2FF",
      justifyContent:
        "center",
      alignItems: "center",
    },

    productInfo: {
      flex: 1,
      marginLeft: 12,
      marginRight: 8,
    },

    productName: {
      fontSize: 15,
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

    noProducts: {
      textAlign:
        "center",
      paddingVertical: 20,
      color: "#6B7280",
      fontSize: 14,
    },

    totalDivider: {
      height: 1,
      backgroundColor:
        "#E5E7EB",
      marginTop: 8,
      marginBottom: 16,
    },

    totalRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    totalLabel: {
      fontSize: 19,
      fontWeight: "800",
      color: "#111827",
    },

    totalValue: {
      fontSize: 22,
      fontWeight: "800",
      color: "#2563EB",
    },

    statusOption: {
      minHeight: 68,
      borderWidth: 1.5,
      borderColor:
        "#E5E7EB",
      borderRadius: 17,
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 18,
      marginBottom: 10,
    },

    statusOptionSelected: {
      borderColor:
        "#3B82F6",
      backgroundColor:
        "#EFF6FF",
    },

    disabledOption: {
      opacity: 0.6,
    },

    radio: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 3,
      borderColor:
        "#9CA3AF",
      justifyContent:
        "center",
      alignItems: "center",
    },

    radioSelected: {
      borderColor:
        "#3B82F6",
    },

    radioInner: {
      width: 13,
      height: 13,
      borderRadius: 7,
      backgroundColor:
        "#3B82F6",
    },

    statusOptionText: {
      flex: 1,
      marginLeft: 16,
      fontSize: 16,
      fontWeight: "700",
      color: "#374151",
    },

    statusOptionTextSelected: {
      color: "#2563EB",
    },

    checkIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        "#3B82F6",
      justifyContent:
        "center",
      alignItems: "center",
    },

    cancelButton: {
      minHeight: 68,
      borderWidth: 1.5,
      borderColor:
        "#FCA5A5",
      borderRadius: 17,
      backgroundColor:
        "#FEF2F2",
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems: "center",
      marginTop: 5,
    },

    cancelButtonText: {
      marginLeft: 9,
      fontSize: 17,
      fontWeight: "800",
      color: "#DC2626",
    },

    updatingContainer: {
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
      marginTop: 12,
    },

    updatingText: {
      marginLeft: 8,
      fontSize: 13,
      color: "#2563EB",
      fontWeight: "600",
    },

    dashboardButton: {
      height: 56,
      borderRadius: 15,
      backgroundColor:
        "#2563EB",
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems: "center",
      marginTop: 25,
      paddingHorizontal: 15,
    },

    dashboardButtonText: {
      marginLeft: 8,
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
    },
  });