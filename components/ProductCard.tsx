import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/Product";

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
  onWishlist?: () => void;
};

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  onWishlist,
}: ProductCardProps) {
  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const saved = isInWishlist(product.id);

  const handleWishlist = () => {
    if (onWishlist) {
      onWishlist();
    } else {
      toggleWishlist(product);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* Discount Badge */}
      {product.discountPercentage > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {Math.round(product.discountPercentage)}% OFF
          </Text>
        </View>
      )}

      {/* Wishlist */}
      <Pressable
        style={({ pressed }) => [
          styles.heartButton,
          pressed && styles.heartPressed,
        ]}
        onPress={handleWishlist}
        hitSlop={10}
      >
        <Ionicons
          name={saved ? "heart" : "heart-outline"}
          size={22}
          color={saved ? "#EF4444" : "#6B7280"}
        />
      </Pressable>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
        />
      </View>

      {/* Brand */}
      <Text
        style={styles.brand}
        numberOfLines={1}
      >
        {product.brand}
      </Text>

      {/* Title */}
      <Text
        numberOfLines={2}
        style={styles.title}
      >
        {product.title}
      </Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <Ionicons
          name="star"
          size={14}
          color="#FACC15"
        />

        <Text style={styles.rating}>
          {Number(product.rating || 0).toFixed(1)}
        </Text>

        <Text style={styles.ratingCount}>
          Rating
        </Text>
      </View>

      {/* Bottom */}
      <View style={styles.bottomRow}>
        <Text
          style={styles.price}
          numberOfLines={1}
        >
          ₹{Number(product.price).toFixed(2)}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onAddToCart}
          hitSlop={5}
        >
          <Ionicons
            name="cart-outline"
            size={21}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.light.card,
    margin: 7,
    borderRadius: 20,
    padding: 12,

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    position: "relative",
    overflow: "hidden",
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },

  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,

    backgroundColor: "#EF4444",

    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,

    zIndex: 2,
  },

  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,

    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 3,

    elevation: 3,
  },

  heartPressed: {
    transform: [{ scale: 0.88 }],
  },

  imageContainer: {
    width: "100%",
    height: 145,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    marginTop: 18,
  },

  image: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },

  brand: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",

    color: Colors.light.text,

    marginTop: 4,

    minHeight: 42,
    lineHeight: 20,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  rating: {
    marginLeft: 5,

    color: "#374151",

    fontSize: 13,
    fontWeight: "700",
  },

  ratingCount: {
    marginLeft: 5,

    color: "#9CA3AF",

    fontSize: 11,
  },

  bottomRow: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 12,
  },

  price: {
    flex: 1,

    fontSize: 18,
    fontWeight: "800",

    color: Colors.light.primary,

    marginRight: 8,
  },

  cartButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: Colors.light.primary,

    justifyContent: "center",
    alignItems: "center",

    elevation: 3,
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.92 }],
  },
});