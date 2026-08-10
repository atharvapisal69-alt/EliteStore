import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { Colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  getProductById,
  getProductsByCategory,
} from "@/services/api";
import { Product } from "@/types/Product";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Sample reviews
  const reviews = [
    {
      id: 1,
      name: "Rahul",
      rating: 5,
      comment: "Excellent product! Highly recommended.",
    },
    {
      id: 2,
      name: "Sneha",
      rating: 4,
      comment: "Very good quality and fast delivery.",
    },
    {
      id: 3,
      name: "Amit",
      rating: 5,
      comment: "Worth every rupee.",
    },
  ];

  // Load product
  const loadProduct = useCallback(async () => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const data = await getProductById(id.toString());

      if (!data) {
        setProduct(null);
        setError(true);
        return;
      }

      setProduct(data);
      setActiveImage(0);

      // Load related products
      try {
        const related = await getProductsByCategory(data.category);

        setRelatedProducts(
          related.filter((item) => item.id !== data.id)
        );
      } catch (relatedError) {
        console.log(
          "Failed to load related products:",
          relatedError
        );

        setRelatedProducts([]);
      }
    } catch (err) {
      console.log("Failed to load product:", err);
      setError(true);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // Loading screen
  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
        />

        <Text style={styles.loadingText}>
          Loading product...
        </Text>
      </SafeAreaView>
    );
  }

  // Error / product not found
  if (error || !product) {
    return (
      <SafeAreaView style={styles.loader}>
        <Ionicons
          name="alert-circle-outline"
          size={70}
          color="#EF4444"
        />

        <Text style={styles.notFoundTitle}>
          Product not found
        </Text>

        <Text style={styles.notFoundText}>
          Sorry, we couldn&apos;t find this product.
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadProduct}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  /*
   * DummyJSON's price is already the discounted/current price.
   * Therefore, to calculate the original price:
   *
   * original = current / (1 - discount / 100)
   */
  const originalPrice =
    product.discountPercentage > 0
      ? Math.round(
          product.price /
            (1 - product.discountPercentage / 100)
        )
      : product.price;

  const discountPercentage = Math.round(
    product.discountPercentage
  );

  const isOutOfStock = product.stock <= 0;

  // Add to cart
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);
  };

  // Buy Now
  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addToCart(product);

    // Change this route if your CartScreen uses another route.
    router.push("/cart");
  };

  // Open related product
  const handleRelatedProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================================
            IMAGE CAROUSEL
        ======================================== */}

        <View style={styles.imageContainer}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) =>
              index.toString()
            }
            onMomentumScrollEnd={(
              event: NativeSyntheticEvent<NativeScrollEvent>
            ) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );

              setActiveImage(index);
            }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.carouselImage}
              />
            )}
          />

          {/* Back button */}
          <Pressable
            style={styles.topBackButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </Pressable>

          {/* Wishlist */}
          <Pressable
            style={styles.wishlistButton}
            onPress={() => addToWishlist(product)}
          >
            <Ionicons
              name="heart-outline"
              size={25}
              color="#EF4444"
            />
          </Pressable>

          {/* Discount */}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {discountPercentage}% OFF
              </Text>
            </View>
          )}

          {/* Image dots */}
          {product.images.length > 1 && (
            <View style={styles.dotContainer}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeImage === index &&
                      styles.activeDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* ========================================
            PRODUCT INFORMATION
        ======================================== */}

        <View style={styles.content}>
          {/* Brand */}
          {product.brand && (
            <Text style={styles.brand}>
              {product.brand}
            </Text>
          )}

          {/* Title */}
          <Text style={styles.title}>
            {product.title}
          </Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Ionicons
                name="star"
                size={15}
                color="#FFFFFF"
              />

              <Text style={styles.ratingBadgeText}>
                {product.rating.toFixed(1)}
              </Text>
            </View>

            <Text style={styles.rating}>
              425 Reviews
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{product.price.toFixed(0)}
            </Text>

            {discountPercentage > 0 && (
              <Text style={styles.oldPrice}>
                ₹{originalPrice}
              </Text>
            )}

            {discountPercentage > 0 && (
              <Text style={styles.saveText}>
                Save {discountPercentage}%
              </Text>
            )}
          </View>

          {/* Stock */}
          <View style={styles.stockRow}>
            <Ionicons
              name={
                isOutOfStock
                  ? "close-circle"
                  : "checkmark-circle"
              }
              size={18}
              color={
                isOutOfStock
                  ? "#EF4444"
                  : "#22C55E"
              }
            />

            <Text
              style={[
                styles.stock,
                {
                  color: isOutOfStock
                    ? "#EF4444"
                    : "#22C55E",
                },
              ]}
            >
              {isOutOfStock
                ? "Out of Stock"
                : `In Stock (${product.stock})`}
            </Text>
          </View>

          {/* Category */}
          <Text style={styles.category}>
            Category: {product.category}
          </Text>

          {/* ========================================
              DESCRIPTION
          ======================================== */}

          <Text style={styles.heading}>
            Description
          </Text>

          <Text style={styles.description}>
            {product.description}
          </Text>

          {/* ========================================
              SERVICE INFORMATION
          ======================================== */}

          <View style={styles.infoCard}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: "#EEF2FF" },
              ]}
            >
              <Ionicons
                name="car-outline"
                size={22}
                color="#3D6EF7"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Free Delivery
              </Text>

              <Text style={styles.infoText}>
                Delivery in 2-3 business days
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: "#ECFDF5" },
              ]}
            >
              <Ionicons
                name="refresh-circle-outline"
                size={22}
                color="#22C55E"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Easy Returns
              </Text>

              <Text style={styles.infoText}>
                7-day easy return policy
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View
              style={[
                styles.infoIcon,
                { backgroundColor: "#FFFBEB" },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#F59E0B"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Secure Payment
              </Text>

              <Text style={styles.infoText}>
                100% secure payment
              </Text>
            </View>
          </View>

          {/* ========================================
              SPECIFICATIONS
          ======================================== */}

          <Text style={styles.heading}>
            Specifications
          </Text>

          <View style={styles.specCard}>
            {product.brand && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>
                  Brand
                </Text>

                <Text style={styles.specValue}>
                  {product.brand}
                </Text>
              </View>
            )}

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>
                Category
              </Text>

              <Text style={styles.specValue}>
                {product.category}
              </Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>
                Rating
              </Text>

              <Text style={styles.specValue}>
                {product.rating.toFixed(1)} / 5
              </Text>
            </View>

            <View style={styles.specRow}>
              <Text style={styles.specLabel}>
                Stock
              </Text>

              <Text style={styles.specValue}>
                {product.stock}
              </Text>
            </View>
          </View>

          {/* ========================================
              CUSTOMER REVIEWS
          ======================================== */}

          <Text style={styles.heading}>
            Customer Reviews
          </Text>

          {reviews.map((review) => (
            <View
              key={review.id}
              style={styles.reviewCard}
            >
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>
                  {review.name}
                </Text>

                <View style={styles.reviewStars}>
                  {Array.from({
                    length: review.rating,
                  }).map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.reviewComment}>
                {review.comment}
              </Text>
            </View>
          ))}

          {/* ========================================
              ACTION BUTTONS
          ======================================== */}

          <Pressable
            disabled={isOutOfStock}
            style={[
              styles.cartButton,
              isOutOfStock &&
                styles.disabledButton,
            ]}
            onPress={handleAddToCart}
          >
            <Ionicons
              name="cart-outline"
              size={23}
              color="#FFFFFF"
            />

            <Text style={styles.cartText}>
              {isOutOfStock
                ? "Out of Stock"
                : "Add To Cart"}
            </Text>
          </Pressable>

          <Pressable
            disabled={isOutOfStock}
            style={[
              styles.buyButton,
              isOutOfStock &&
                styles.disabledButton,
            ]}
            onPress={handleBuyNow}
          >
            <Ionicons
              name="flash-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.buyText}>
              {isOutOfStock
                ? "Out of Stock"
                : "Buy Now"}
            </Text>
          </Pressable>

          {/* ========================================
              RELATED PRODUCTS
          ======================================== */}

          <Text style={styles.heading}>
            Related Products
          </Text>

          {relatedProducts.length > 0 ? (
            <FlatList
              data={relatedProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) =>
                item.id.toString()
              }
              contentContainerStyle={
                styles.relatedList
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.relatedCard}
                  onPress={() =>
                    handleRelatedProduct(item.id)
                  }
                >
                  <Image
                    source={{
                      uri: item.thumbnail,
                    }}
                    style={styles.relatedImage}
                  />

                  {item.discountPercentage > 0 && (
                    <View
                      style={styles.relatedDiscount}
                    >
                      <Text
                        style={
                          styles.relatedDiscountText
                        }
                      >
                        {Math.round(
                          item.discountPercentage
                        )}
                        % OFF
                      </Text>
                    </View>
                  )}

                  <Text
                    numberOfLines={2}
                    style={styles.relatedTitle}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={styles.relatedPrice}
                  >
                    ₹{item.price.toFixed(0)}
                  </Text>
                </Pressable>
              )}
            />
          ) : (
            <Text style={styles.description}>
              No related products found.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  /* Loading */

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },

  /* Error */

  notFoundTitle: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
  },

  notFoundText: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 25,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 12,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    marginTop: 12,
    paddingHorizontal: 30,
    paddingVertical: 13,
  },

  backText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  /* Image */

  imageContainer: {
    position: "relative",
    backgroundColor: "#FFFFFF",
  },

  carouselImage: {
    width,
    height: 330,
    resizeMode: "contain",
    backgroundColor: "#FFFFFF",
  },

  topBackButton: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  wishlistButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  discountBadge: {
    position: "absolute",
    right: 15,
    bottom: 45,
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },

  discountText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  dotContainer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 20,
    backgroundColor: Colors.light.primary,
  },

  /* Main Content */

  content: {
    padding: 20,
  },

  brand: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  title: {
    marginTop: 8,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    color: Colors.light.text,
  },

  /* Rating */

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  ratingBadgeText: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  rating: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },

  /* Price */

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 17,
  },

  price: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.light.primary,
  },

  oldPrice: {
    marginLeft: 12,
    fontSize: 19,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },

  saveText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },

  /* Stock */

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },

  stock: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "700",
  },

  category: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
  },

  /* Heading */

  heading: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "700",
    color: Colors.light.text,
  },

  description: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 26,
  },

  /* Info Cards */

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    marginTop: 12,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  infoIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  infoText: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },

  /* Specifications */

  specCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    elevation: 2,
  },

  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  specLabel: {
    fontSize: 15,
    color: "#6B7280",
  },

  specValue: {
    maxWidth: "55%",
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "right",
  },

  /* Reviews */

  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginTop: 12,
    elevation: 2,
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reviewName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },

  reviewStars: {
    flexDirection: "row",
  },

  reviewComment: {
    marginTop: 8,
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },

  /* Buttons */

  cartButton: {
    marginTop: 30,
    backgroundColor: Colors.light.primary,
    borderRadius: 15,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  cartText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  buyButton: {
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: "#22C55E",
    borderRadius: 15,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  buyText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },

  disabledButton: {
    backgroundColor: "#9CA3AF",
    elevation: 0,
  },

  /* Related Products */

  relatedList: {
    paddingVertical: 5,
  },

  relatedCard: {
    position: "relative",
    width: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    elevation: 3,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  relatedImage: {
    width: "100%",
    height: 125,
    resizeMode: "contain",
  },

  relatedDiscount: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },

  relatedDiscountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  relatedTitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
    color: Colors.light.text,
  },

  relatedPrice: {
    marginTop: 7,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.primary,
  },
});