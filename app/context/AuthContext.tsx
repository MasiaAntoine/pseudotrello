import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/app/firebase.ts";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter, usePathname, Redirect } from "expo-router";
import { set } from "firebase/database";

interface AuthContextProps {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const pathname = usePathname();

  const login = async (email: string, password: string) => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    setUser(user);
    router.push("/");
  };

  const register = async (email: string, password: string) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    setUser(user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!user && pathname !== "/auth") {
    return <Redirect href="/auth" />;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
