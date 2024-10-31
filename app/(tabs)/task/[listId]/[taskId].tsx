import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/app/components/ThemedText";
import { fetchTaskById } from "@/app/services";

const TaskPage: React.FC = () => {
  const { listId, taskId } = useLocalSearchParams();
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

  return (
    <View style={styles.container}>
      <ThemedText type="title">Tâche</ThemedText>
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
  text: {
    color: "white",
    marginVertical: 8,
  },
});

export default TaskPage;
