import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Picker,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/app/components/ThemedText";
import {
  fetchTaskById,
  updateTaskName,
  fetchLists,
  updateTaskListId,
  fetchTableById,
} from "@/app/services";

const TaskPage: React.FC = () => {
  const { tableId, listId, taskId } = useLocalSearchParams();
  const router = useRouter();
  const [taskData, setTaskData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [inputHeight, setInputHeight] = useState(0);
  const [lists, setLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>(
    listId as string
  );
  const [tableName, setTableName] = useState<string>("");
  const [listName, setListName] = useState<string>("");

  useEffect(() => {
    if (tableId) {
      fetchTableById(tableId as string).then((data) => {
        setTableName(data?.name || "");
      });
      fetchLists(tableId as string).then((data) => {
        setLists(data);
        const currentList = data.find((list) => list.id === listId);
        setListName(currentList?.name || "");
      });
    }
  }, [tableId, listId]);

  useEffect(() => {
    if (listId && taskId) {
      fetchTaskById(listId as string, taskId as string).then((data) => {
        setTaskData(data);
        setTaskText(data?.name || "");
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

  const handleNamePress = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (selectedListId && taskId) {
      await updateTaskName(
        selectedListId as string,
        taskId as string,
        taskText
      );
      setIsEditing(false);
      setTaskData({ ...taskData, name: taskText });
    }
  };

  const handleListChange = async (newListId: string) => {
    if (newListId !== selectedListId && taskId && taskData) {
      await updateTaskListId(
        listId as string,
        newListId,
        taskId as string,
        taskData
      );
      setSelectedListId(newListId);
      router.replace(`/task/${tableId}/${newListId}/${taskId}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText type="title">Tâche</ThemedText>
      </View>
      <ThemedText type="subtitle">{`Tableau: ${tableName}`}</ThemedText>
      <ThemedText type="subtitle">{`Liste: ${listName}`}</ThemedText>
      {isEditing ? (
        <TextInput
          style={[styles.textInput, { height: Math.max(35, inputHeight) }]}
          value={taskText}
          onChangeText={setTaskText}
          onBlur={handleSave}
          multiline
          autoFocus
          onContentSizeChange={(e) =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
        />
      ) : (
        <Text style={styles.text} onPress={handleNamePress}>
          {taskData.name}
        </Text>
      )}
      <Picker
        selectedValue={selectedListId}
        onValueChange={handleListChange}
        style={styles.picker}
      >
        {lists.map((list) => (
          <Picker.Item key={list.id} label={list.name} value={list.id} />
        ))}
      </Picker>
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
  textInput: {
    color: "white",
    marginVertical: 8,
    backgroundColor: "#454545",
    padding: 10,
    borderRadius: 5,
    minHeight: 35,
  },
  picker: {
    color: "white",
    backgroundColor: "#454545",
    marginVertical: 8,
  },
});

export default TaskPage;
