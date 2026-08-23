import { collection, getDocs } from "firebase/firestore";
import {db} from "@/firebase/config";

export async function testFirebase() {
  try {
    const snapshot = await getDocs(
      collection(db, "orders")
    );

    console.log(
      "🔥 Firebase connected!",
      snapshot.size,
      "orders found"
    );

    return true;
  } catch (error) {
    console.error("❌ Firebase connection failed:", error);
    return false;
  }
}