import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/app/components/navigation/TabBarIcon";
import { Colors } from "@/app/constants/Colors";
import { useColorScheme } from "@/app/hooks/useColorScheme";
import { AuthProvider } from "@/app/context/AuthContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Tableaux",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "grid" : "grid-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Compte",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "person" : "person-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="list/[id]"
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="auth"
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
