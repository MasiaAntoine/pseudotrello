import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/app/components/ThemedText";
import { useRouter } from "expo-router";

interface TaskProps {
  listId: string;
  id: string;
  name: string;
}

const Task: React.FC<TaskProps> = ({ listId, id, name }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/task/${listId}/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.taskContainer}>
        <ThemedText
          style={styles.taskItemText}
          type="default"
          ellipsizeMode="tail"
        >
          {name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    marginTop: 5,
    maxWidth: "55%",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  taskItemText: {
    color: "#000",
  },
});

export default Task;
