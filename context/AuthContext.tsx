import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/firebase/config";

type User = {
  name: string;
  email: string;
  uid: string;
  isAdmin: boolean;
};

type LoginResult =
  | "admin"
  | "customer"
  | false;

type AuthContextType = {
  user: User | null;
  loading: boolean;

  login: (
    name: string,
    email: string,
    password: string
  ) => Promise<LoginResult>;

  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

const ADMIN_EMAIL = "admin@elitemart.com";
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            setUser(null);

            await AsyncStorage.removeItem(
              "loggedInUser"
            );

            return;
          }

          const email =
            firebaseUser.email
              ?.trim()
              .toLowerCase() || "";

          const isAdmin =
            email === ADMIN_EMAIL;

          const currentUser: User = {
            uid: firebaseUser.uid,
            name:
              firebaseUser.displayName ||
              (isAdmin
                ? "EliteMart Admin"
                : ""),
            email,
            isAdmin,
          };

          setUser(currentUser);

          await AsyncStorage.setItem(
            "loggedInUser",
            JSON.stringify(currentUser)
          );
        } catch (error) {
          console.log(
            "Auth state error:",
            error
          );

          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const login = async (
    name: string,
    email: string,
    password: string
  ): Promise<LoginResult> => {
    const cleanName = name.trim();
    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return false;
    }

    try {
      // ==============================
      // ADMIN LOGIN
      // ==============================

      if (
        cleanEmail === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        const result =
          await signInWithEmailAndPassword(
            auth,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
          );

        const adminUser: User = {
          uid: result.user.uid,
          name: "EliteMart Admin",
          email: ADMIN_EMAIL,
          isAdmin: true,
        };

        setUser(adminUser);

        await AsyncStorage.setItem(
          "loggedInUser",
          JSON.stringify(adminUser)
        );

        return "admin";
      }

      // ==============================
      // CUSTOMER LOGIN
      // ==============================

      if (!cleanName) {
        return false;
      }

      let firebaseUser;

      try {
        const result =
          await signInWithEmailAndPassword(
            auth,
            cleanEmail,
            password
          );

        firebaseUser = result.user;
      } catch (error: any) {
        if (
          error.code ===
            "auth/user-not-found" ||
          error.code ===
            "auth/invalid-credential"
        ) {
          const result =
            await createUserWithEmailAndPassword(
              auth,
              cleanEmail,
              password
            );

          firebaseUser = result.user;

          await updateProfile(
            firebaseUser,
            {
              displayName: cleanName,
            }
          );
        } else {
          return false;
        }
      }

      if (!firebaseUser) {
        return false;
      }

      const customerUser: User = {
        uid: firebaseUser.uid,
        name:
          firebaseUser.displayName ||
          cleanName,
        email:
          firebaseUser.email ||
          cleanEmail,
        isAdmin: false,
      };

      setUser(customerUser);

      await AsyncStorage.setItem(
        "loggedInUser",
        JSON.stringify(customerUser)
      );

      return "customer";
    } catch (error: any) {
      console.log(
        "Login error:",
        error.code,
        error.message
      );

      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);

      await AsyncStorage.removeItem(
        "loggedInUser"
      );

      await signOut(auth);
    } catch (error) {
      console.log(
        "Logout error:",
        error
      );

      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}