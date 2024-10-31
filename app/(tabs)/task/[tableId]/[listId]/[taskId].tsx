import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/app/components/ThemedText";
import { fetchTaskById } from "@/app/services";

const TaskPage: React.FC = () => {
  const { tableId, listId, taskId } = useLocalSearchParams();
  const router = useRouter();
  const [taskData, setTaskData] = useState<any>(null);

  useEffect(() => {
    if (listId && taskId) {
      fetchTaskById(listId as string, taskId as string).then((data) => {
        setTaskData(data);
      });
    }
  }, [listId, taskId]);

  if (!taskData) {
    return (
      <View style={styles.container}>
        <ThemedText type="title">Chargement...</ThemedText>
      </View>
    );
  }

  const handleBackPress = () => {
    router.push(`/list/${tableId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText type="title">Tâche</ThemedText>
      </View>
      <Text style={styles.text}>{taskData.name}</Text>
    </View>
  );
};

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
    marginBottom: 20,
  },
  text: {
    color: "white",
    marginVertical: 8,
  },
});

export default TaskPage;
