import { registerRootComponent } from "expo";
import { ExpoRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { AuthProvider } from "@/app/context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <ExpoRouter />
      </SafeAreaView>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default registerRootComponent(App);
