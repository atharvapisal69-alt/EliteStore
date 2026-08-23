import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import {
    getAllCustomers,
    type Customer,
} from "@/services/customerService";

export default function AdminCustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD CUSTOMERS
  // =========================

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getAllCustomers();

      console.log("CUSTOMERS:", data);

      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name?.toLowerCase().includes(text) ||
        customer.email?.toLowerCase().includes(text) ||
        customer.id?.toLowerCase().includes(text)
      );
    });
  }, [customers, search]);

  // =========================
  // TOTAL ORDERS
  // =========================

  const totalOrders = useMemo(() => {
    return customers.reduce(
      (sum, customer) =>
        sum + Number(customer.ordersCount || 0),
      0
    );
  }, [customers]);

  // =========================
  // TOTAL REVENUE
  // =========================

  const totalRevenue = useMemo(() => {
    return customers.reduce(
      (sum, customer) =>
        sum + Number(customer.totalSpent || 0),
      0
    );
  }, [customers]);

  // =========================
  // GET INITIAL
  // =========================

  const getInitial = (name?: string) => {
    const cleanName = name?.trim();

    if (!cleanName) {
      return "C";
    }

    return cleanName.charAt(0).toUpperCase();
  };

  // =====================================================
  // CUSTOMER DETAILS
  // IMPORTANT:
  // Orders use order.userId.
  // Therefore we MUST send userId, NOT id.
  // =====================================================

  const openCustomerDetails = (customer: Customer) => {
    const userId = String(customer.id || "").trim();

    console.log("OPEN CUSTOMER:");
    console.log("NAME:", customer.name);
    console.log("EMAIL:", customer.email);
    console.log("USER ID:", userId);

    if (!userId) {
      console.log("ERROR: Customer has no ID");
      return;
    }

    router.push({
      pathname: "/admin-customer-details",
      params: {
        userId: userId,
        name: customer.name || "Customer",
        email: customer.email || "No email",
      },
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.light.primary}
          />

          <Text style={styles.loadingText}>
            Loading customers...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/admin")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111827"
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            Customers
          </Text>

          <Text style={styles.subtitle}>
            {customers.length}{" "}
            {customers.length === 1
              ? "customer"
              : "customers"}
          </Text>
        </View>

        <View style={styles.headerPlaceholder} />
      </View>

      {/* SUMMARY */}

      <View style={styles.summaryContainer}>
        {/* CUSTOMERS */}

        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIcon,
              {
                backgroundColor: "#DBEAFE",
              },
            ]}
          >
            <Ionicons
              name="people-outline"
              size={22}
              color="#2563EB"
            />
          </View>

          <Text style={styles.summaryNumber}>
            {customers.length}
          </Text>

          <Text style={styles.summaryLabel}>
            Customers
          </Text>
        </View>

        {/* ORDERS */}

        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIcon,
              {
                backgroundColor: "#DCFCE7",
              },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={22}
              color="#16A34A"
            />
          </View>

          <Text style={styles.summaryNumber}>
            {totalOrders}
          </Text>

          <Text style={styles.summaryLabel}>
            Orders
          </Text>
        </View>

        {/* REVENUE */}

        <View style={styles.summaryCard}>
          <View
            style={[
              styles.summaryIcon,
              {
                backgroundColor: "#FEF3C7",
              },
            ]}
          >
            <Ionicons
              name="cash-outline"
              size={22}
              color="#D97706"
            />
          </View>

          <Text
            style={styles.summaryNumber}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            ₹{totalRevenue.toFixed(0)}
          </Text>

          <Text style={styles.summaryLabel}>
            Revenue
          </Text>
        </View>
      </View>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={21}
          color="#9CA3AF"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search name, email or ID..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {search.length > 0 && (
          <Pressable
            onPress={() => setSearch("")}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        )}
      </View>

      {/* RESULT COUNT */}

      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {filteredCustomers.length}{" "}
          {filteredCustomers.length === 1
            ? "customer"
            : "customers"}{" "}
          found
        </Text>
      </View>

      {/* CUSTOMER LIST */}

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onRefresh={loadCustomers}
        refreshing={loading}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.customerCard,
              pressed && styles.pressedCard,
            ]}
            onPress={() =>
              openCustomerDetails(item)
            }
          >
            {/* AVATAR */}

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitial(item.name)}
              </Text>
            </View>

            {/* CUSTOMER INFO */}

            <View style={styles.customerInfo}>
              <Text
                style={styles.customerName}
                numberOfLines={1}
              >
                {item.name || "Customer"}
              </Text>

              <Text
                style={styles.customerEmail}
                numberOfLines={1}
              >
                {item.email || "No email"}
              </Text>

              <Text
                style={styles.customerId}
                numberOfLines={1}
              >
                ID: {item.id}
              </Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons
                    name="receipt-outline"
                    size={13}
                    color="#6B7280"
                  />

                  <Text style={styles.detailText}>
                    {Number(item.ordersCount || 0)}{" "}
                    {Number(item.ordersCount || 0) === 1
                      ? "order"
                      : "orders"}
                  </Text>
                </View>
              </View>
            </View>

            {/* TOTAL */}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>
                Spent
              </Text>

              <Text style={styles.total}>
                ₹
                {Number(
                  item.totalSpent || 0
                ).toFixed(2)}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={19}
                color="#9CA3AF"
                style={styles.arrow}
              />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="people-outline"
                size={45}
                color="#9CA3AF"
              />
            </View>

            <Text style={styles.emptyTitle}>
              {search
                ? "No Customers Found"
                : "No Customers Yet"}
            </Text>

            <Text style={styles.emptyText}>
              {search
                ? "Try searching with another name, email or ID."
                : "Customers will appear here after they place orders."}
            </Text>
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
    height: 70,
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
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerPlaceholder: {
    width: 44,
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

  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 9,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },

  summaryIcon: {
    width: 39,
    height: 39,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  summaryNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  summaryLabel: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
  },

  searchContainer: {
    height: 52,
    marginHorizontal: 16,
    marginTop: 14,
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
    fontSize: 14,
    color: "#111827",
  },

  resultRow: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  resultText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  list: {
    padding: 16,
    paddingTop: 3,
    paddingBottom: 40,
  },

  customerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 13,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  pressedCard: {
    opacity: 0.7,
  },

  avatar: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2563EB",
  },

  customerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  customerName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  customerEmail: {
    marginTop: 3,
    fontSize: 11,
    color: "#374151",
  },

  customerId: {
    marginTop: 3,
    fontSize: 9,
    color: "#9CA3AF",
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    marginLeft: 4,
    fontSize: 10,
    color: "#6B7280",
  },

  totalContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  totalLabel: {
    fontSize: 10,
    color: "#9CA3AF",
  },

  total: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "800",
    color: "#16A34A",
  },

  arrow: {
    marginTop: 6,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#F3F4F6",
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
});