import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import { fetchTableById } from "@/app/services";

export default function TabTwoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTableById(id as string).then((data) => {
        setTableData(data);
      });
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText type="title">{`${tableData?.name}`}</ThemedText>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  space: { marginVertical: 12 },
});
