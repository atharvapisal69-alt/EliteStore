import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
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

import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { Colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { getProducts } from "@/services/api";
import { Product } from "@/types/Product";

type SortOption =
  | "none"
  | "priceLow"
  | "priceHigh"
  | "rating";

export default function HomeScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [sort, setSort] =
    useState<SortOption>("none");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const { addToCart } = useCart();

  // =====================================================
  // LOAD PRODUCTS FROM FIREBASE
  // =====================================================

  const fetchProducts = useCallback(
    async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        console.log(
          "🔥 Loading customer products from Firebase..."
        );

        const data = await getProducts();

        console.log(
          "🔥 Firebase customer product count:",
          data.length
        );

        setProducts(data);
      } catch (error) {
        console.error(
          "❌ Customer product loading error:",
          error
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // =====================================================
  // RELOAD WHEN USER RETURNS TO HOME
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      fetchProducts(false);
    }, [fetchProducts])
  );

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((item) => item.category)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const searchText =
      search.trim().toLowerCase();

    // SEARCH
    if (searchText) {
      result = result.filter((item) => {
        const title =
          item.title?.toLowerCase() || "";

        const categoryText =
          item.category?.toLowerCase() || "";

        const brand =
          item.brand?.toLowerCase() || "";

        return (
          title.includes(searchText) ||
          categoryText.includes(searchText) ||
          brand.includes(searchText)
        );
      });
    }

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (item) =>
          item.category === category
      );
    }

    // SORT
    if (sort === "priceLow") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "priceHigh") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  // =====================================================
  // REFRESH
  // =====================================================

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchProducts(false);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("none");
  };

  const hasFilters =
    search.trim() !== "" ||
    category !== "All" ||
    sort !== "none";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <View style={styles.loadingIcon}>
          <Ionicons
            name="bag-handle-outline"
            size={34}
            color={Colors.light.primary}
          />
        </View>

        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
        />

        <Text style={styles.loadingTitle}>
          Loading EliteMart
        </Text>

        <Text style={styles.loadingSubtitle}>
          Finding the best products for you...
        </Text>
      </SafeAreaView>
    );
  }

  // =====================================================
  // SCREEN
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) =>
          `${item.id}-${index}`
        }
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          styles.columnWrapper
        }
        contentContainerStyle={
          styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={
              Colors.light.primary
            }
          />
        }
        ListHeaderComponent={
          <>
            {/* HEADER */}

            <View style={styles.header}>
              <View
                style={styles.headerLeft}
              >
                <Text
                  style={styles.delivery}
                >
                  Deliver To
                </Text>

                <View
                  style={styles.locationRow}
                >
                  <Ionicons
                    name="location"
                    size={17}
                    color={
                      Colors.light.primary
                    }
                  />

                  <Text
                    style={styles.name}
                  >
                    Atharva
                  </Text>

                  <Text
                    style={styles.wave}
                  >
                    👋
                  </Text>
                </View>
              </View>

              <Pressable
                style={
                  styles.notificationButton
                }
                onPress={() => {}}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={
                    Colors.light.text
                  }
                />

                <View
                  style={
                    styles.notificationDot
                  }
                />
              </Pressable>
            </View>

            {/* SEARCH */}

            <SearchBar
              value={search}
              onChangeText={setSearch}
            />

            {/* BANNER */}

            <Banner />

            {/* CATEGORIES */}

            <View
              style={styles.sectionHeader}
            >
              <Text
                style={styles.sectionTitle}
              >
                Categories
              </Text>

              {category !== "All" && (
                <Pressable
                  onPress={() =>
                    setCategory("All")
                  }
                >
                  <Text
                    style={
                      styles.clearSmall
                    }
                  >
                    Reset
                  </Text>
                </Pressable>
              )}
            </View>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              keyExtractor={(item) => item}
              contentContainerStyle={
                styles.categoryList
              }
              renderItem={({
                item,
              }) => {
                const active =
                  category === item;

                return (
                  <Pressable
                    style={[
                      styles.categoryButton,
                      active &&
                        styles.activeCategory,
                    ]}
                    onPress={() =>
                      setCategory(item)
                    }
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        active &&
                          styles.activeCategoryText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />

            {/* PRODUCTS HEADER */}

            <View
              style={
                styles.productsHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Popular Products
                </Text>

                <Text
                  style={
                    styles.resultCount
                  }
                >
                  {filteredProducts.length}{" "}
                  {filteredProducts.length ===
                  1
                    ? "product"
                    : "products"}{" "}
                  found
                </Text>
              </View>

              {hasFilters && (
                <Pressable
                  style={
                    styles.clearButton
                  }
                  onPress={
                    clearFilters
                  }
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={17}
                    color={
                      Colors.light.primary
                    }
                  />

                  <Text
                    style={
                      styles.clearText
                    }
                  >
                    Clear
                  </Text>
                </Pressable>
              )}
            </View>

            {/* SORT */}

            <View
              style={styles.sortContainer}
            >
              <Text
                style={styles.sortLabel}
              >
                Sort by
              </Text>

              <View
                style={styles.sortRow}
              >
                <Pressable
                  style={[
                    styles.sortButton,
                    sort ===
                      "priceLow" &&
                      styles.activeSort,
                  ]}
                  onPress={() =>
                    setSort(
                      sort === "priceLow"
                        ? "none"
                        : "priceLow"
                    )
                  }
                >
                  <Ionicons
                    name="arrow-down"
                    size={14}
                    color={
                      sort === "priceLow"
                        ? "#FFFFFF"
                        : "#374151"
                    }
                  />

                  <Text
                    style={[
                      styles.sortText,
                      sort ===
                        "priceLow" &&
                        styles.activeSortText,
                    ]}
                  >
                    Low
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.sortButton,
                    sort ===
                      "priceHigh" &&
                      styles.activeSort,
                  ]}
                  onPress={() =>
                    setSort(
                      sort ===
                        "priceHigh"
                        ? "none"
                        : "priceHigh"
                    )
                  }
                >
                  <Ionicons
                    name="arrow-up"
                    size={14}
                    color={
                      sort === "priceHigh"
                        ? "#FFFFFF"
                        : "#374151"
                    }
                  />

                  <Text
                    style={[
                      styles.sortText,
                      sort ===
                        "priceHigh" &&
                        styles.activeSortText,
                    ]}
                  >
                    High
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.sortButton,
                    sort === "rating" &&
                      styles.activeSort,
                  ]}
                  onPress={() =>
                    setSort(
                      sort === "rating"
                        ? "none"
                        : "rating"
                    )
                  }
                >
                  <Ionicons
                    name="star"
                    size={14}
                    color={
                      sort === "rating"
                        ? "#FFFFFF"
                        : "#F59E0B"
                    }
                  />

                  <Text
                    style={[
                      styles.sortText,
                      sort === "rating" &&
                        styles.activeSortText,
                    ]}
                  >
                    Rating
                  </Text>
                </Pressable>
              </View>
            </View>

            <View
              style={styles.divider}
            />
          </>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => {
              router.push({
                pathname:
                  "/product/[id]",
                params: {
                  id: item.id.toString(),
                },
              });
            }}
            onAddToCart={() =>
              addToCart(item)
            }
          />
        )}
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <View
              style={
                styles.emptyIconContainer
              }
            >
              <Ionicons
                name="search-outline"
                size={42}
                color={
                  Colors.light.primary
                }
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No Products Found
            </Text>

            <Text
              style={
                styles.emptySubtitle
              }
            >
              We couldn&apos;t find any
              products matching your
              search.
            </Text>

            <Pressable
              style={
                styles.emptyButton
              }
              onPress={
                clearFilters
              }
            >
              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Clear Filters
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.light.background,
    paddingHorizontal: 16,
  },

  listContent: {
    paddingBottom: 35,
  },

  columnWrapper: {
    justifyContent:
      "space-between",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      Colors.light.background,
    paddingHorizontal: 30,
  },

  loadingIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  loadingTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
  },

  loadingSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.light.subtitle,
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },

  headerLeft: {
    flex: 1,
  },

  delivery: {
    fontSize: 13,
    color: Colors.light.subtitle,
    marginBottom: 3,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.light.text,
    marginLeft: 4,
  },

  wave: {
    fontSize: 20,
    marginLeft: 5,
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginTop: 18,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: Colors.light.text,
  },

  clearSmall: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  categoryList: {
    paddingBottom: 4,
  },

  categoryButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 9,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  activeCategory: {
    backgroundColor:
      Colors.light.primary,
    borderColor:
      Colors.light.primary,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  activeCategoryText: {
    color: "#FFFFFF",
  },

  productsHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 4,
  },

  resultCount: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.light.subtitle,
  },

  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
  },

  clearText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.light.primary,
  },

  sortContainer: {
    marginTop: 12,
    marginBottom: 4,
  },

  sortLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.subtitle,
    marginBottom: 8,
  },

  sortRow: {
    flexDirection: "row",
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 11,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  activeSort: {
    backgroundColor:
      Colors.light.primary,
    borderColor:
      Colors.light.primary,
  },

  sortText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  activeSortText: {
    color: "#FFFFFF",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 15,
    marginBottom: 4,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 70,
  },

  emptyIconContainer: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: Colors.light.text,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.light.subtitle,
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 20,
    backgroundColor:
      Colors.light.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});