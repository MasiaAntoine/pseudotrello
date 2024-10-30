import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import React from "react";
import { Button } from "react-native";

import { Collapsible } from "@/app/components/Collapsible";
import { ExternalLink } from "@/app/components/ExternalLink";
import ParallaxScrollView from "@/app/components/ParallaxScrollView";
import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import { useAuth } from "@/app/context/AuthContext";

export default function TabTwoScreen() {
  const { user, logout } = useAuth();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      {user && (
        <ThemedView style={styles.emailContainer}>
          <ThemedText type="default">
            Connected as: {user.user.email}
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <Button title="Logout" onPress={logout} />
      </ThemedView>
      {/* <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          and{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{" "}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  emailContainer: {
    marginTop: 16,
  },
});
