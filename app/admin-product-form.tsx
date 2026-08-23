import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import {
    addProduct,
    updateProduct,
} from "@/services/productService";

type FormParams = {
  id?: string;
  title?: string;
  price?: string;
  description?: string;
  category?: string;
  brand?: string;
  stock?: string;
  thumbnail?: string;
  discountPercentage?: string;
  rating?: string;
  images?: string;
};

export default function AdminProductFormScreen() {
  const params = useLocalSearchParams<FormParams>();

  const isEdit = !!params.id;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const [discountPercentage, setDiscountPercentage] =
    useState("0");

  const [rating, setRating] = useState("0");

  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD EDIT DATA
  // =========================

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    setTitle(params.title ?? "");
    setPrice(params.price ?? "");
    setDescription(params.description ?? "");
    setCategory(params.category ?? "");
    setBrand(params.brand ?? "");
    setStock(params.stock ?? "");
    setThumbnail(params.thumbnail ?? "");

    setDiscountPercentage(
      params.discountPercentage ?? "0"
    );

    setRating(params.rating ?? "0");
  }, [
    isEdit,
    params.title,
    params.price,
    params.description,
    params.category,
    params.brand,
    params.stock,
    params.thumbnail,
    params.discountPercentage,
    params.rating,
  ]);

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert(
        "Missing Title",
        "Please enter a product title."
      );
      return false;
    }

    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert(
        "Invalid Price",
        "Please enter a valid price."
      );
      return false;
    }

    if (Number(price) < 0) {
      Alert.alert(
        "Invalid Price",
        "Price cannot be negative."
      );
      return false;
    }

    if (!category.trim()) {
      Alert.alert(
        "Missing Category",
        "Please enter a category."
      );
      return false;
    }

    if (!stock.trim() || isNaN(Number(stock))) {
      Alert.alert(
        "Invalid Stock",
        "Please enter a valid stock quantity."
      );
      return false;
    }

    if (Number(stock) < 0) {
      Alert.alert(
        "Invalid Stock",
        "Stock cannot be negative."
      );
      return false;
    }

    if (!thumbnail.trim()) {
      Alert.alert(
        "Missing Image",
        "Please enter a product image URL."
      );
      return false;
    }

    if (
      discountPercentage.trim() &&
      isNaN(Number(discountPercentage))
    ) {
      Alert.alert(
        "Invalid Discount",
        "Please enter a valid discount percentage."
      );
      return false;
    }

    if (
      rating.trim() &&
      isNaN(Number(rating))
    ) {
      Alert.alert(
        "Invalid Rating",
        "Please enter a valid rating."
      );
      return false;
    }

    return true;
  };

  // =========================
  // SAVE PRODUCT
  // =========================

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const imageUrl = thumbnail.trim();

      /*
       * Product requires:
       * title
       * price
       * description
       * category
       * brand
       * stock
       * thumbnail
       * discountPercentage
       * rating
       * images
       */

      const productData = {
        title: title.trim(),

        price: Number(price),

        description: description.trim(),

        category: category.trim(),

        brand: brand.trim() || "EliteMart",

        stock: Number(stock),

        thumbnail: imageUrl,

        discountPercentage:
          Number(discountPercentage) || 0,

        rating: Number(rating) || 0,

        images: [imageUrl],
      };

      // =========================
      // UPDATE EXISTING PRODUCT
      // =========================

      if (isEdit && params.id) {
        await updateProduct(
          params.id,
          productData
        );

        Alert.alert(
          "Success",
          "Product updated successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/admin-products");
              },
            },
          ]
        );

        return;
      }

      // =========================
      // ADD NEW PRODUCT
      // =========================

      await addProduct(productData);

      Alert.alert(
        "Success",
        "Product added successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/admin-products");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "Save product error:",
        error
      );

      Alert.alert(
        "Save Failed",
        error?.message ||
          "Unable to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    if (saving) return;

    router.replace("/admin-products");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={handleCancel}
            disabled={saving}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isEdit
                ? "Edit Product"
                : "Add Product"}
            </Text>

            <Text style={styles.headerSubtitle}>
              {isEdit
                ? "Update product information"
                : "Create a new product"}
            </Text>
          </View>

          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* TITLE */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Product Title *
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter product title"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* PRICE */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Price *
            </Text>

            <View style={styles.inputWithIcon}>
              <Text style={styles.currency}>
                ₹
              </Text>

              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                style={styles.iconInput}
              />
            </View>
          </View>

          {/* CATEGORY */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Category *
            </Text>

            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. electronics"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* BRAND */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Brand
            </Text>

            <TextInput
              value={brand}
              onChangeText={setBrand}
              placeholder="EliteMart"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* STOCK */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Stock *
            </Text>

            <TextInput
              value={stock}
              onChangeText={setStock}
              placeholder="Enter stock quantity"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          {/* DISCOUNT */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Discount Percentage
            </Text>

            <View style={styles.inputWithIcon}>
              <Text style={styles.currency}>
                %
              </Text>

              <TextInput
                value={discountPercentage}
                onChangeText={
                  setDiscountPercentage
                }
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                style={styles.iconInput}
              />
            </View>
          </View>

          {/* RATING */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Rating
            </Text>

            <View style={styles.inputWithIcon}>
              <Ionicons
                name="star"
                size={18}
                color="#F59E0B"
              />

              <TextInput
                value={rating}
                onChangeText={setRating}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                style={styles.iconInput}
              />
            </View>
          </View>

          {/* IMAGE URL */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Product Image URL *
            </Text>

            <TextInput
              value={thumbnail}
              onChangeText={setThumbnail}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="url"
              style={styles.input}
            />
          </View>

          {/* DESCRIPTION */}

          <View style={styles.field}>
            <Text style={styles.label}>
              Description
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter product description"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
            />
          </View>

          {/* BUTTONS */}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.cancelButton,
                saving && styles.disabledButton,
              ]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.saveButton,
                saving && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={
                      isEdit
                        ? "checkmark-circle-outline"
                        : "add-circle-outline"
                    }
                    size={21}
                    color="#FFFFFF"
                  />

                  <Text style={styles.saveText}>
                    {isEdit
                      ? "Update Product"
                      : "Add Product"}
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  headerSpace: {
    width: 44,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
  },

  inputWithIcon: {
    minHeight: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  currency: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.light.primary,
  },

  iconInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#111827",
  },

  descriptionInput: {
    minHeight: 125,
    paddingTop: 14,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  cancelButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },

  saveButton: {
    flex: 1.5,
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  saveText: {
    marginLeft: 7,
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  disabledButton: {
    opacity: 0.6,
  },

  bottomSpace: {
    height: 20,
  },
});