import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

import {
  deleteProduct,
  getAllProducts,
  type FirebaseProduct,
} from "@/services/productService";

export default function AdminProductsScreen() {
  const [products, setProducts] =
    useState<FirebaseProduct[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  // =========================
  // LOAD PRODUCTS
  // =========================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data =
        await getAllProducts();

      setProducts(data);
    } catch (error: any) {
      console.error(
        "Admin products error:",
        error
      );

      Alert.alert(
        "Unable to Load Products",
        error?.message ||
          "Unable to load products from Firebase."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const data =
        await getAllProducts();

      setProducts(data);
    } catch (error: any) {
      console.error(
        "Refresh products error:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to refresh products."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredProducts =
    useMemo(() => {
      const text = search
        .trim()
        .toLowerCase();

      if (!text) {
        return products;
      }

      return products.filter(
        (product) => {
          const title =
            product.title?.toLowerCase() ||
            "";

          const category =
            product.category?.toLowerCase() ||
            "";

          const brand =
            product.brand?.toLowerCase() ||
            "";

          return (
            title.includes(text) ||
            category.includes(text) ||
            brand.includes(text)
          );
        }
      );
    }, [products, search]);

  // =========================
  // DELETE
  // =========================

  const handleDelete = (
    product: FirebaseProduct
  ) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteProduct(
                product.firebaseId
              );

              setProducts(
                (current) =>
                  current.filter(
                    (item) =>
                      item.firebaseId !==
                      product.firebaseId
                  )
              );

              Alert.alert(
                "Success",
                "Product deleted successfully."
              );
            } catch (error: any) {
              console.error(
                "Delete product error:",
                error
              );

              Alert.alert(
                "Delete Failed",
                error?.message ||
                  "Unable to delete product."
              );
            }
          },
        },
      ]
    );
  };

  // =========================
  // ADD
  // =========================

  const handleAddProduct =
    () => {
      router.push(
        "/admin-product-form"
      );
    };

  // =========================
  // EDIT
  // =========================

  const handleEditProduct = (
    product: FirebaseProduct
  ) => {
    router.push({
      pathname:
        "/admin-product-form",

      params: {
        id: product.firebaseId,

        title:
          product.title || "",

        description:
          product.description || "",

        category:
          product.category || "",

        brand:
          product.brand || "",

        price:
          String(product.price ?? ""),

        stock:
          String(product.stock ?? ""),

        thumbnail:
          product.thumbnail || "",
      },
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color={
              Colors.light.primary
            }
          />

          <Text
            style={styles.loadingText}
          >
            Loading products...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // SCREEN
  // =========================

  return (
    <SafeAreaView
      style={styles.container}
    >
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

        <View
          style={styles.headerCenter}
        >
          <Text style={styles.title}>
            Products
          </Text>

          <Text
            style={styles.subtitle}
          >
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={
            handleAddProduct
          }
        >
          <Ionicons
            name="add"
            size={25}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      {/* SEARCH */}

      <View
        style={styles.searchContainer}
      >
        <Ionicons
          name="search-outline"
          size={21}
          color="#9CA3AF"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <Pressable
            onPress={() =>
              setSearch("")
            }
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        )}
      </View>

      {/* RESULT */}

      <View
        style={styles.resultRow}
      >
        <Text
          style={styles.resultText}
        >
          {filteredProducts.length}{" "}
          {filteredProducts.length ===
          1
            ? "product"
            : "products"}{" "}
          found
        </Text>
      </View>

      {/* LIST */}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) =>
          item.firebaseId
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.list
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View
            style={
              styles.productCard
            }
          >
            {/* IMAGE */}

            <View
              style={styles.imageBox}
            >
              <Image
                source={{
                  uri: item.thumbnail,
                }}
                style={styles.image}
              />
            </View>

            {/* INFO */}

            <View
              style={
                styles.productInfo
              }
            >
              <Text
                style={
                  styles.productTitle
                }
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <Text
                style={styles.category}
                numberOfLines={1}
              >
                {item.category ||
                  "Uncategorized"}
              </Text>

              <View
                style={
                  styles.priceRow
                }
              >
                <Text
                  style={styles.price}
                >
                  ₹
                  {Number(
                    item.price || 0
                  ).toFixed(2)}
                </Text>

                <View
                  style={[
                    styles.stockBadge,
                    item.stock <= 0 &&
                      styles.outOfStockBadge,
                  ]}
                >
                  <View
                    style={[
                      styles.stockDot,
                      item.stock <= 0 &&
                        styles.outOfStockDot,
                    ]}
                  />

                  <Text
                    style={[
                      styles.stockText,
                      item.stock <= 0 &&
                        styles.outOfStockText,
                    ]}
                  >
                    {item.stock > 0
                      ? `${item.stock} in stock`
                      : "Out of stock"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ACTIONS */}

            <View
              style={styles.actions}
            >
              <Pressable
                style={
                  styles.editButton
                }
                onPress={() =>
                  handleEditProduct(
                    item
                  )
                }
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color="#2563EB"
                />
              </Pressable>

              <Pressable
                style={
                  styles.deleteButton
                }
                onPress={() =>
                  handleDelete(item)
                }
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#DC2626"
                />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View
            style={styles.empty}
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <Ionicons
                name="cube-outline"
                size={45}
                color={
                  Colors.light.primary
                }
              />
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              No Products Found
            </Text>

            <Text
              style={styles.emptyText}
            >
              {search
                ? "Try searching for another product."
                : "Add your first product to get started."}
            </Text>

            {!search && (
              <Pressable
                style={
                  styles.emptyAddButton
                }
                onPress={
                  handleAddProduct
                }
              >
                <Ionicons
                  name="add"
                  size={20}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.emptyAddText
                  }
                >
                  Add Product
                </Text>
              </Pressable>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  loadingContainer: {
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

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor:
      Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  searchContainer: {
    height: 52,
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },

  resultRow: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  resultText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 40,
  },

  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  imageBox: {
    width: 82,
    height: 82,
    borderRadius: 15,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  productTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 19,
  },

  category: {
    marginTop: 4,
    fontSize: 11,
    color: "#6B7280",
    textTransform: "capitalize",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  price: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.light.primary,
  },

  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
  },

  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    marginRight: 4,
  },

  stockText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#15803D",
  },

  outOfStockBadge: {
    backgroundColor: "#FEE2E2",
  },

  outOfStockDot: {
    backgroundColor: "#DC2626",
  },

  outOfStockText: {
    color: "#DC2626",
  },

  actions: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 90,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 42,
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
    marginTop: 7,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  emptyAddButton: {
    marginTop: 20,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 13,
    backgroundColor:
      Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyAddText: {
    marginLeft: 7,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});