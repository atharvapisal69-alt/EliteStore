// services/orderService.ts

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

// ======================================================
// TYPES
// ======================================================

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Processing"
  | "Ready to Ship"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type OrderItem = {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  image?: string;
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: OrderStatus;
};

// ======================================================
// CREATE ORDER
// ======================================================

export const createOrder = async (
  userId: string,
  userName: string,
  userEmail: string,
  items: OrderItem[],
  total: number
): Promise<string> => {
  try {
    if (!userId) {
      throw new Error("User ID is missing");
    }

    if (!items || items.length === 0) {
      throw new Error("Order items are missing");
    }

    console.log("=================================");
    console.log("CREATING ORDER");
    console.log("User ID:", userId);
    console.log("User Name:", userName);
    console.log("User Email:", userEmail);
    console.log("Items:", items.length);
    console.log("Total:", total);
    console.log("=================================");

    const orderData = {
      userId,
      userName: userName || "Customer",
      userEmail: userEmail || "No email",

      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        thumbnail:
          item.thumbnail ||
          item.image ||
          "",
        image:
          item.image ||
          item.thumbnail ||
          "",
      })),

      total: Number(total) || 0,

      date: new Date().toISOString(),

      status: "Placed" as OrderStatus,
    };

    const ordersRef = collection(db, "orders");

    const orderDoc = await addDoc(
      ordersRef,
      orderData
    );

    console.log(
      "ORDER CREATED SUCCESSFULLY:",
      orderDoc.id
    );

    return orderDoc.id;
  } catch (error) {
    console.error(
      "ERROR CREATING ORDER:",
      error
    );

    throw error;
  }
};

// ======================================================
// GET ALL ORDERS
// ======================================================

export const getAllOrders = async (): Promise<
  Order[]
> => {
  try {
    const ordersRef = collection(
      db,
      "orders"
    );

    const ordersQuery = query(
      ordersRef,
      orderBy("date", "desc")
    );

    const snapshot =
      await getDocs(ordersQuery);

    const orders: Order[] =
      snapshot.docs.map(
        (orderDoc) => {
          const data = orderDoc.data();

          return {
            id: orderDoc.id,

            userId:
              typeof data.userId ===
              "string"
                ? data.userId
                : "",

            userName:
              typeof data.userName ===
              "string"
                ? data.userName
                : "Customer",

            userEmail:
              typeof data.userEmail ===
              "string"
                ? data.userEmail
                : "No email",

            items:
              Array.isArray(data.items)
                ? data.items.map(
                    (item: any) => ({
                      id:
                        item.id ?? "",
                      title:
                        item.title ??
                        "Product",
                      price:
                        Number(
                          item.price
                        ) || 0,
                      quantity:
                        Number(
                          item.quantity
                        ) || 1,

                      thumbnail:
                        item.thumbnail ||
                        item.image ||
                        "",

                      image:
                        item.image ||
                        item.thumbnail ||
                        "",
                    })
                  )
                : [],

            total:
              Number(data.total) || 0,

            date:
              typeof data.date ===
              "string"
                ? data.date
                : "",

            status:
              isValidOrderStatus(
                data.status
              )
                ? data.status
                : "Placed",
          };
        }
      );

    console.log(
      "ALL ORDERS:",
      orders
    );

    return orders;
  } catch (error) {
    console.error(
      "ERROR GETTING ALL ORDERS:",
      error
    );

    throw error;
  }
};

// ======================================================
// GET USER ORDERS
// ======================================================

export const getUserOrders = async (
  userId: string
): Promise<Order[]> => {
  try {
    if (!userId) {
      throw new Error(
        "User ID is missing"
      );
    }

    console.log(
      "Loading orders for user:",
      userId
    );

    const allOrders =
      await getAllOrders();

    const userOrders =
      allOrders.filter(
        (order) =>
          order.userId === userId
      );

    console.log(
      "USER ORDERS:",
      userOrders.length
    );

    return userOrders;
  } catch (error) {
    console.error(
      "ERROR GETTING USER ORDERS:",
      error
    );

    throw error;
  }
};

// ======================================================
// GET SINGLE ORDER
// ======================================================

export const getOrderById = async (
  orderId: string
): Promise<Order | null> => {
  try {
    if (!orderId) {
      return null;
    }

    const orderRef = doc(
      db,
      "orders",
      orderId
    );

    const snapshot =
      await getDoc(orderRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    const order: Order = {
      id: snapshot.id,

      userId:
        typeof data.userId === "string"
          ? data.userId
          : "",

      userName:
        typeof data.userName ===
        "string"
          ? data.userName
          : "Customer",

      userEmail:
        typeof data.userEmail ===
        "string"
          ? data.userEmail
          : "No email",

      items:
        Array.isArray(data.items)
          ? data.items.map(
              (item: any) => ({
                id: item.id ?? "",
                title:
                  item.title ??
                  "Product",
                price:
                  Number(
                    item.price
                  ) || 0,
                quantity:
                  Number(
                    item.quantity
                  ) || 1,

                thumbnail:
                  item.thumbnail ||
                  item.image ||
                  "",

                image:
                  item.image ||
                  item.thumbnail ||
                  "",
              })
            )
          : [],

      total:
        Number(data.total) || 0,

      date:
        typeof data.date ===
        "string"
          ? data.date
          : "",

      status:
        isValidOrderStatus(
          data.status
        )
          ? data.status
          : "Placed",
    };

    return order;
  } catch (error) {
    console.error(
      "ERROR GETTING ORDER:",
      error
    );

    throw error;
  }
};

// ======================================================
// UPDATE ORDER STATUS
// ======================================================

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  try {
    if (!orderId) {
      throw new Error(
        "Order ID is missing"
      );
    }

    if (!status) {
      throw new Error(
        "Order status is missing"
      );
    }

    console.log(
      "Updating order:",
      orderId
    );

    console.log(
      "New status:",
      status
    );

    const orderRef = doc(
      db,
      "orders",
      orderId
    );

    await updateDoc(orderRef, {
      status,
    });

    console.log(
      "ORDER STATUS UPDATED SUCCESSFULLY"
    );
  } catch (error) {
    console.error(
      "ERROR UPDATING ORDER STATUS:",
      error
    );

    throw error;
  }
};

// ======================================================
// ALIAS FOR CART CONTEXT
// ======================================================

export const updateOrder = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  return updateOrderStatus(
    orderId,
    status
  );
};

// ======================================================
// VALIDATE ORDER STATUS
// ======================================================

function isValidOrderStatus(
  status: any
): status is OrderStatus {
  return (
    status === "Placed" ||
    status === "Confirmed" ||
    status === "Processing" ||
    status === "Ready to Ship" ||
    status === "Shipped" ||
    status === "Delivered" ||
    status === "Cancelled"
  );
}