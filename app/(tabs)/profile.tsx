import { StyleSheet, View } from "react-native";
import React from "react";

import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import { useAuth } from "@/app/context/AuthContext";
import CustomButton from "@/app/components/CustomButton";

export default function TabTwoScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <ThemedText type="title">Compte</ThemedText>

      <ThemedText style={styles.space} type="default">
        {user.email}
      </ThemedText>

      <CustomButton title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#353636",
    height: "100%",
    paddingTop: 70,
  },
  space: { marginVertical: 12 },
});
