import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemedText } from "@/app/components/ThemedText";
import { ThemedView } from "@/app/components/ThemedView";
import CustomButton from "@/app/components/CustomButton";
import {
  fetchTableById,
  deleteTable,
  addList,
  fetchLists,
  deleteList,
  updateListName,
  addTask,
  fetchTasks,
} from "@/app/services";

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + " ...";
  }
  return text;
};

export default function TabTwoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tableData, setTableData] = useState(null);
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([]);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    if (id) {
      fetchTableById(id as string).then((data) => {
        setTableData(data);
      });
      fetchLists(id as string).then((data) => {
        setLists(data);
        data.forEach((list: any) => {
          fetchTasks(list.id).then((tasksData) => {
            setTasks((prevTasks) => ({
              ...prevTasks,
              [list.id]: tasksData,
            }));
          });
        });
      });
    }
  }, [id]);

  const handleDelete = () => {
    if (id) {
      deleteTable(id as string).then(() => {
        router.push("/");
      });
    }
  };

  const handleAddList = async () => {
    if (!listName.trim()) {
      Alert.alert("Erreur", "Le nom de la liste ne peut pas être vide.");
      return;
    }

    try {
      await addList({ name: listName, tableId: id as string });
      setListName("");
      fetchLists(id as string).then((data) => {
        setLists(data);
        data.forEach((list: any) => {
          fetchTasks(list.id).then((tasksData) => {
            setTasks((prevTasks) => ({
              ...prevTasks,
              [list.id]: tasksData,
            }));
          });
        });
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ajout de la liste."
      );
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(id as string, listId);
      fetchLists(id as string).then((data) => {
        setLists(data);
        data.forEach((list: any) => {
          fetchTasks(list.id).then((tasksData) => {
            setTasks((prevTasks) => ({
              ...prevTasks,
              [list.id]: tasksData,
            }));
          });
        });
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la suppression de la liste."
      );
    }
  };

  const handleEditListName = async () => {
    if (!editingListName.trim()) {
      Alert.alert("Erreur", "Le nom de la liste ne peut pas être vide.");
      return;
    }

    try {
      await updateListName(
        id as string,
        editingListId as string,
        editingListName
      );
      setEditingListId(null);
      setEditingListName("");
      fetchLists(id as string).then((data) => {
        setLists(data);
        data.forEach((list: any) => {
          fetchTasks(list.id).then((tasksData) => {
            setTasks((prevTasks) => ({
              ...prevTasks,
              [list.id]: tasksData,
            }));
          });
        });
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la modification de la liste."
      );
    }
  };

  const handleAddTask = async (listId: string) => {
    if (!taskName.trim()) {
      Alert.alert("Erreur", "Le nom de la tâche ne peut pas être vide.");
      return;
    }

    try {
      await addTask({ name: taskName, listId });
      setTaskName("");
      fetchTasks(listId).then((tasksData) => {
        setTasks((prevTasks) => ({
          ...prevTasks,
          [listId]: tasksData,
        }));
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ajout de la tâche."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText type="title">{`${tableData?.name}`}</ThemedText>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.space} />
      <TextInput
        placeholder="Nom de la liste"
        value={listName}
        onChangeText={setListName}
        style={styles.input}
      />
      <CustomButton title="Ajouter une liste" onPress={handleAddList} />
      <FlatList
        data={lists}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {editingListId === item.id ? (
              <TextInput
                value={editingListName}
                onChangeText={setEditingListName}
                onBlur={handleEditListName}
                style={styles.listItemTextInput}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setEditingListId(item.id);
                  setEditingListName(item.name);
                }}
              >
                <ThemedText style={styles.listItemText} type="default">
                  {truncateText(item.name, 27)}
                </ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleDeleteList(item.id)}
              style={styles.deleteListButton}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <FlatList
              data={tasks[item.id] || []}
              keyExtractor={(task) => task.id}
              renderItem={({ item: task }) => (
                <ThemedText style={styles.taskItemText} type="default">
                  {task.name}
                </ThemedText>
              )}
            />
            <View style={styles.taskInputContainer}>
              <TextInput
                placeholder="Description de la tâche"
                value={taskName}
                onChangeText={setTaskName}
                style={styles.taskInput}
              />
              <CustomButton
                title="Ajouter"
                onPress={() => handleAddTask(item.id)}
                buttonStyle={styles.addButton}
                textStyle={styles.addButtonText}
              />
            </View>
          </View>
        )}
        style={styles.listContainer}
      />
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
  deleteButton: {
    marginLeft: "auto",
  },
  input: {
    marginTop: 12,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "black",
  },
  listContainer: {
    marginVertical: 20,
  },
  listItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#c7ecff",
    color: "#000",
    marginHorizontal: 6,
    width: 300,
  },
  listItemText: {
    color: "#000",
  },
  listItemTextInput: {
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    width: "80%",
  },
  deleteListButton: {
    alignSelf: "flex-end",
  },
  taskInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  taskInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    color: "black",
    flex: 1,
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: "white",
  },
  taskItemText: {
    color: "#000",
    marginTop: 5,
    width: "69vw",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
});
