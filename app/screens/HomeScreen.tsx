import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { HelloWave } from "@/app/components/HelloWave";
import ParallaxScrollView from "@/app/components/ParallaxScrollView";
import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import { addTask, fetchTasks } from "@/app/services/databaseService";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase.ts";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  const handleAddTask = async () => {
    await addTask({ title, description });
    setTitle("");
    setDescription("");
  };

  const handleFetchTasks = async () => {
    const fetchedTasks = await fetchTasks();
    setTasks(Object.values(fetchedTasks || {}));
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.navigate("Auth");
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/app/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Add a Task</ThemedText>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <Button title="Add Task" onPress={handleAddTask} />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Button title="Fetch Tasks" onPress={handleFetchTasks} />
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      </ThemedView>
      <Button title="Sign Out" onPress={handleSignOut} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  taskItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  taskTitle: {
    fontWeight: "bold",
  },
});
