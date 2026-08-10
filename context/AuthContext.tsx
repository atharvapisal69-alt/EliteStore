import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved login
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("loggedInUser");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const login = async (
    name: string,
    email: string,
    password: string
  ) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return false;
    }

    const newUser: User = {
      name: name.trim(),
      email: email.trim(),
    };

    try {
      await AsyncStorage.setItem(
        "loggedInUser",
        JSON.stringify(newUser)
      );

      setUser(newUser);

      return true;
    } catch (error) {
      console.log("Login error:", error);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("loggedInUser");
      setUser(null);
    } catch (error) {
      console.log("Logout error:", error);
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}