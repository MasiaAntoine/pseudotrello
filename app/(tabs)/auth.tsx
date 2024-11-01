import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import CustomButton from "@/app/components/CustomButton";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const router = useRouter();

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleAuth = async () => {
    if (!validatePassword(password)) {
      Alert.alert(
        "Erreur de mot de passe",
        "Le mot de passe doit contenir au moins 8 caractères, dont 1 chiffre, 1 majuscule et 1 caractère spécial."
      );
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
        Alert.alert(
          "Inscription réussie",
          "Vous êtes inscrit avec succès. Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception."
        );
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      Alert.alert(
        "Erreur d'authentification",
        "Une erreur est survenue lors de l'authentification."
      );
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
