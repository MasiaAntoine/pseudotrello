import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/app/components/ThemedText";
import CustomButton from "@/app/components/CustomButton";
import Task from "@/app/components/Task";
import {
  updateListName,
  deleteList,
  addTask,
  fetchTasks,
} from "@/app/services";

interface ListProps {
  id: string;
  name: string;
  tableId: string;
  tasks: any[];
  onTasksUpdate: (listId: string, tasks: any[]) => void;
  onListUpdate: () => void;
}

const List: React.FC<ListProps> = ({
  id,
  name,
  tableId,
  tasks,
  onTasksUpdate,
  onListUpdate,
}) => {
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState("");
  const [taskName, setTaskName] = useState("");

  const handleEditListName = async () => {
    if (!editingListName.trim()) {
      Alert.alert("Erreur", "Le nom de la liste ne peut pas être vide.");
      return;
    }

    try {
      await updateListName(tableId, editingListId as string, editingListName);
      setEditingListId(null);
      setEditingListName("");
      onListUpdate();
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la modification de la liste."
      );
    }
  };

  const handleDeleteList = async () => {
    try {
      await deleteList(tableId, id);
      onListUpdate();
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la suppression de la liste."
      );
    }
  };

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      Alert.alert("Erreur", "Le nom de la tâche ne peut pas être vide.");
      return;
    }

    try {
      await addTask({ name: taskName, listId: id });
      setTaskName("");
      fetchTasks(id).then((tasksData) => {
        onTasksUpdate(id, tasksData);
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ajout de la tâche."
      );
    }
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.listHeader}>
        {editingListId === id ? (
          <TextInput
            value={editingListName}
            onChangeText={setEditingListName}
            onBlur={handleEditListName}
            style={styles.listItemTextInput}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              setEditingListId(id);
              setEditingListName(name);
            }}
          >
            <ThemedText style={styles.listItemText} type="default">
              {name}
            </ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleDeleteList}
          style={styles.deleteListButton}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item: task }) => <Task name={task.name} />}
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
          onPress={handleAddTask}
          buttonStyle={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#c7ecff",
    color: "#000",
    marginHorizontal: 6,
    width: 300,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
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
    marginLeft: "auto",
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
});

export default List;
