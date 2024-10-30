import { StyleSheet, View } from "react-native";
import React from "react";
import { Button } from "react-native";

import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import { useAuth } from "@/app/context/AuthContext";

export default function TabTwoScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <ThemedText type="title">Compte</ThemedText>

      <ThemedText style={styles.space} type="default">
        {user.user.email}
      </ThemedText>

      <ThemedView>
        <Button title="Logout" onPress={logout} />
      </ThemedView>
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
