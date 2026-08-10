import { Colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
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

export default function Checkout() {
  const { cart, placeOrder } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryCharge = subtotal > 1000 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    try {
      const orderId = await placeOrder();

      router.replace({
        pathname: "/success",
        params: {
          orderId: orderId.toString(),
        },
      });
    } catch (error) {
      console.log("Order placement error:", error);
    }
  };

  // Empty cart protection
  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          Your Cart is Empty
        </Text>

        <Text style={styles.emptySubtitle}>
          Add some products before checking out.
        </Text>

        <Pressable
          style={styles.shopButton}
          onPress={() => router.replace("/")}
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
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.heading}>
            Checkout
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.image}
            />

            <View style={styles.productInfo}>
              <Text
                style={styles.title}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <Text style={styles.price}>
                ₹{item.price.toFixed(2)}
              </Text>

              <Text style={styles.quantity}>
                Qty: {item.quantity}
              </Text>

              <Text style={styles.itemTotal}>
                Item Total: ₹
                {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.sectionTitle}>
              Order Summary
            </Text>

            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>
                Subtotal
              </Text>

              <Text style={styles.summaryValue}>
                ₹{subtotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summary}>
              <Text style={styles.summaryLabel}>
                Delivery
              </Text>

              <Text style={styles.summaryValue}>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge.toFixed(2)}`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summary}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.totalValue}>
                ₹{total.toFixed(2)}
              </Text>
            </View>

            <Pressable
              style={styles.button}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.buttonText}>
                Place Order
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
  },

  listContent: {
    paddingBottom: 30,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    color: Colors.light.text,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
    alignItems: "center",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor: "#F3F4F6",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginTop: 6,
  },

  quantity: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  itemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 5,
  },

  footer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 15,
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  summaryLabel: {
    fontSize: 16,
    color: "#6B7280",
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },

  totalLabel: {
    fontSize: 21,
    fontWeight: "700",
    color: Colors.light.text,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.primary,
  },

  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 24,
  },

  emptyTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: Colors.light.text,
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
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