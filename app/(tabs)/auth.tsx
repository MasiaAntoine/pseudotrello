import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import ThemedTextInput from "@/app/components/ThemedTextInput";
import { useRouter } from "expo-router";
import CustomButton from "@/app/components/CustomButton";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Connexion" : "Inscription"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton
        title={isLogin ? "Se connecter" : "S'inscrire"}
        onPress={handleAuth}
      />
      <CustomButton
        title={isLogin ? "Créer un compte" : "Se connecter"}
        onPress={() => setIsLogin(!isLogin)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#353636",
    flex: 1,
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "black",
  },
});

export default AuthPage;
