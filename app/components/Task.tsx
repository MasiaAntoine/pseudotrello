import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/app/components/ThemedText";

interface TaskProps {
  name: string;
}

const Task: React.FC<TaskProps> = ({ name }) => {
  return (
    <View style={styles.taskContainer}>
      <ThemedText
        style={styles.taskItemText}
        type="default"
        ellipsizeMode="tail"
      >
        {name}
      </ThemedText>
    </View>
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
