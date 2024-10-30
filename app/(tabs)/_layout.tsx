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
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "code-slash" : "code-slash-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="auth"
          options={{
            title: "AuthPage",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "log-in" : "log-in-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
