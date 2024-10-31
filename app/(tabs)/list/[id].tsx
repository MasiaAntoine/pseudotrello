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
} from "@/app/services";

export default function TabTwoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tableData, setTableData] = useState(null);
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (id) {
      fetchTableById(id as string).then((data) => {
        setTableData(data);
      });
      fetchLists(id as string).then((data) => {
        setLists(data);
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
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ajout de la liste."
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
          <ThemedText style={styles.listItem} type="default">
            {item.name}
          </ThemedText>
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
    padding: 16,
    backgroundColor: "#fff",
    color: "#000",
    marginHorizontal: 6,
    width: 300,
  },
});
