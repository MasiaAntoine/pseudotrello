import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/app/firebase.ts";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter, usePathname, Redirect } from "expo-router";
import { Alert } from "react-native"; // Importer Alert

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
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user.emailVerified) {
      setUser(userCredential.user);
      router.push("/");
    } else {
      await signOut(auth);
      Alert.alert(
        "Email non vérifié",
        "Veuillez vérifier votre email avant de vous connecter."
      );
    }
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    Alert.alert(
      "Inscription réussie",
      "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
    );
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

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
