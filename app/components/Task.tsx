import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedText } from "@/app/components/ThemedText";

interface TaskProps {
  name: string;
}

const Task: React.FC<TaskProps> = ({ name }) => {
  return (
    <View style={styles.taskContainer}>
      <ThemedText style={styles.taskItemText} type="default">
        {name}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    marginTop: 5,
    width: "69vw",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  taskItemText: {
    color: "#000",
  },
});

export default Task;
