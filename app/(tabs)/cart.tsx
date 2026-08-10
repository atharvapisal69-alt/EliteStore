import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";

export default function CartScreen() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeItem,
    totalPrice,
  } = useCart();

  const shipping = cart.length > 0 ? 99 : 0;
  const grandTotal = totalPrice + shipping;

  // Empty Cart
  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons
          name="cart-outline"
          size={80}
          color={Colors.light.primary}
        />

        <Text style={styles.emptyTitle}>
          Your Cart is Empty
        </Text>

        <Text style={styles.emptySubtitle}>
          Add some products and they will appear here.
        </Text>

        <Pressable
          style={styles.shopButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.shopButtonText}>
            Continue Shopping
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        My Cart ({cart.length})
      </Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Product Image */}
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.image}
            />

            {/* Product Information */}
            <View style={styles.info}>
              <Text
                style={styles.title}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <Text style={styles.price}>
                ₹{item.price.toFixed(2)}
              </Text>

              {/* Quantity Controls */}
              <View style={styles.qtyRow}>
                <Pressable
                  style={styles.qtyButton}
                  onPress={() =>
                    decreaseQty(item.id)
                  }
                >
                  <Ionicons
                    name="remove"
                    size={18}
                    color="#FFFFFF"
                  />
                </Pressable>

                <Text style={styles.qty}>
                  {item.quantity}
                </Text>

                <Pressable
                  style={styles.qtyButton}
                  onPress={() =>
                    increaseQty(item.id)
                  }
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
            </View>

            {/* Remove Button */}
            <Pressable
              style={styles.removeButton}
              onPress={() =>
                removeItem(item.id)
              }
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color="#EF4444"
              />
            </Pressable>
          </View>
        )}
      />

      {/* Order Summary */}
      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.label}>
            Subtotal
          </Text>

          <Text style={styles.value}>
            ₹{totalPrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Shipping
          </Text>

          <Text style={styles.value}>
            ₹{shipping.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.totalValue}>
            ₹{grandTotal.toFixed(2)}
          </Text>
        </View>

        {/* Checkout Button */}
        <Pressable
          style={styles.checkout}
          onPress={() => router.push("/checkout")}
        >
          <Ionicons
            name="card-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.checkoutText}>
            Proceed to Checkout
          </Text>
        </Pressable>
      </View>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
    marginBottom: 20,
  },

  listContent: {
    paddingBottom: 230,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 21,
  },

  price: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 7,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  qty: {
    marginHorizontal: 16,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  removeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },

  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    elevation: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  label: {
    color: "#6B7280",
    fontSize: 16,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.primary,
  },

  checkout: {
    marginTop: 12,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
    padding: 24,
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },

  shopButton: {
    marginTop: 25,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});