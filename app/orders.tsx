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
            size={24}
            color="#111827"
          />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.heading}>
            My Orders
          </Text>

          <Text style={styles.subHeading}>
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}
          </Text>
        </View>
      </View>

      {/* Orders */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          orders.length === 0
            ? styles.emptyList
            : styles.list
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="receipt-outline"
                size={65}
                color={Colors.light.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Orders Yet
            </Text>

            <Text style={styles.emptySubtitle}>
              Your completed orders will
              appear here.
            </Text>

            <Pressable
              style={styles.shopButton}
              onPress={() =>
                router.replace("/(tabs)")
              }
            >
              <Ionicons
                name="bag-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.shopButtonText}>
                Start Shopping
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderLabel}>
                  Order ID
                </Text>

                <Text style={styles.orderId}>
                  {item.id}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />

                <Text style={styles.statusText}>
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.dateRow}>
              <Ionicons
                name="calendar-outline"
                size={17}
                color="#6B7280"
              />

              <Text style={styles.dateText}>
                {item.date}
              </Text>
            </View>

            {/* Products */}
            <View style={styles.productsSection}>
              <Text style={styles.productsTitle}>
                Products
              </Text>

              {item.items.map((product) => (
                <View
                  key={product.id}
                  style={styles.productRow}
                >
                  <View style={styles.productIcon}>
                    <Ionicons
                      name="cube-outline"
                      size={20}
                      color={
                        Colors.light.primary
                      }
                    />
                  </View>

                  <View style={styles.productInfo}>
                    <Text
                      style={styles.productName}
                      numberOfLines={1}
                    >
                      {product.title}
                    </Text>

                    <Text
                      style={styles.productQuantity}
                    >
                      Qty: {product.quantity}
                    </Text>
                  </View>

                  <Text style={styles.productPrice}>
                    ₹
                    {(
                      product.price *
                      product.quantity
                    ).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Total */}
            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Order Total
              </Text>

              <Text style={styles.totalValue}>
                ₹{item.total.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
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

  headerText: {
    marginLeft: 14,
  },

  heading: {
    fontSize: 27,
    fontWeight: "800",
    color: Colors.light.text,
  },

  subHeading: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },

  list: {
    paddingTop: 8,
    paddingBottom: 30,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  orderId: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.light.text,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },

  statusText: {
    color: "#15803D",
    fontSize: 12,
    fontWeight: "700",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  dateText: {
    marginLeft: 7,
    color: "#6B7280",
    fontSize: 13,
  },

  productsSection: {
    marginTop: 18,
  },

  productsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 10,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 10,
  },

  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },

  productQuantity: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  productPrice: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.text,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },

  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.light.primary,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  emptySubtitle: {
    marginTop: 9,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },

  shopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    elevation: 3,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});