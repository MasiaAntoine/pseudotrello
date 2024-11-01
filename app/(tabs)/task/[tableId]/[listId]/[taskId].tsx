import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker"; // Importer Picker depuis @react-native-picker/picker
import { ThemedText } from "@/app/components/ThemedText";
import CustomButton from "@/app/components/CustomButton";
import {
  fetchTaskById,
  updateTaskName,
  fetchLists,
  updateTaskListId,
  fetchTableById,
  deleteTask,
  uploadTaskImage,
  deleteTaskImage,
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
  const [imageUri, setImageUri] = useState<string | null>(null);

  const fetchData = useCallback(() => {
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
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
    if (listId && taskId) {
      fetchTaskById(listId as string, taskId as string).then((data) => {
        setTaskData(data);
        setTaskText(data?.name || "");
        setImageUri(data?.imageUri || null);
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

  const handleSave = async (updates: any = {}) => {
    if (selectedListId && taskId) {
      await updateTaskName(selectedListId as string, taskId as string, {
        name: taskText,
        ...updates,
      });
      setIsEditing(false);
      setTaskData({ ...taskData, name: taskText, ...updates });
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

  const handleDelete = async () => {
    if (listId && taskId) {
      await deleteTask(listId as string, taskId as string);
      router.push(`/list/${tableId}`);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImageUri(uri);
      const downloadURL = await uploadTaskImage(
        selectedListId as string,
        taskId as string,
        uri
      );
      await handleSave({ imageUri: downloadURL });
    }
  };

  const handleDeleteImage = async () => {
    if (taskId) {
      await deleteTaskImage(taskId as string);
      setImageUri(null);
      await handleSave({ imageUri: null });
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
          onBlur={() => handleSave()}
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
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
        {imageUri && (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              onPress={handleDeleteImage}
              style={styles.deleteButton}
            >
              <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>
      <CustomButton
        title="Supprimer la tâche"
        onPress={handleDelete}
        variant="danger"
      />
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
  cameraButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  deleteButton: {
    alignItems: "center",
    marginVertical: 10,
  },
});

export default TaskPage;
