import {
    collection,
    getDocs,
} from "firebase/firestore";

import { db } from "@/firebase/config";

export type Customer = {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
};

export async function getAllCustomers(): Promise<
  Customer[]
> {
  try {
    const snapshot = await getDocs(
      collection(db, "orders")
    );

    const customerMap =
      new Map<string, Customer>();

    snapshot.docs.forEach(
      (document) => {
        const order =
          document.data();

        const userId = String(
          order.userId ??
            "unknown"
        );

        const userName =
          String(
            order.userName ??
              order.customerName ??
              "Customer"
          );

        const userEmail =
          String(
            order.userEmail ??
              order.email ??
              "No email"
          );

        const total =
          Number(
            order.total ?? 0
          );

        const orderDate =
          String(
            order.date ??
              ""
          );

        const existing =
          customerMap.get(
            userId
          );

        if (existing) {
          existing.ordersCount += 1;

          existing.totalSpent +=
            total;

          if (
            new Date(
              orderDate
            ).getTime() >
            new Date(
              existing.lastOrderDate
            ).getTime()
          ) {
            existing.lastOrderDate =
              orderDate;
          }

          // Update missing information
          if (
            existing.name ===
              "Customer" &&
            userName !==
              "Customer"
          ) {
            existing.name =
              userName;
          }

          if (
            existing.email ===
              "No email" &&
            userEmail !==
              "No email"
          ) {
            existing.email =
              userEmail;
          }
        } else {
          customerMap.set(
            userId,
            {
              id: userId,
              name: userName,
              email: userEmail,
              ordersCount: 1,
              totalSpent: total,
              lastOrderDate:
                orderDate,
            }
          );
        }
      }
    );

    return Array.from(
      customerMap.values()
    ).sort(
      (a, b) =>
        b.totalSpent -
        a.totalSpent
    );
  } catch (error) {
    console.error(
      "Error loading customers:",
      error
    );

    throw error;
  }
}