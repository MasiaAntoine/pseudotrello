import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import CustomButton from "@/app/components/CustomButton";
import { useAuth } from "@/app/context/AuthContext";
import { ThemedText } from "@/app/components/ThemedText";
import { useRouter, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { addTable, fetchTables, updateTableName } from "@/app/services";

const TablePage: React.FC = () => {
  const [tableName, setTableName] = useState("");
  const [tables, setTables] = useState([]);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editingTableName, setEditingTableName] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const handleFetchTables = async () => {
    if (user && user.user.uid) {
      const fetchedTables = await fetchTables(user.user.uid);
      setTables(fetchedTables || []);
    }
  };

  useEffect(() => {
    handleFetchTables();
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleFetchTables();
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddTable = async () => {
    if (!tableName.trim()) {
      Alert.alert("Erreur", "Le nom du tableau ne peut pas être vide.");
      return;
    }

    if (!user || !user.user.uid) {
      Alert.alert("Erreur", "Utilisateur non connecté ou UID non disponible.");
      return;
    }

    try {
      const newTable = {
        name: tableName,
        userId: user.user.uid,
        createdAt: new Date().toISOString(),
      };

      await addTable(newTable);
      setTableName("");
      handleFetchTables();
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de l'ajout du tableau."
      );
    }
  };

  const handlePressItem = (tableId: string) => {
    if (!editingTableId) {
      router.push(`/list/${tableId}`);
    }
  };

  const handleEditTableName = async () => {
    if (!editingTableName.trim()) {
      Alert.alert("Erreur", "Le nom du tableau ne peut pas être vide.");
      return;
    }

    try {
      await updateTableName(editingTableId as string, editingTableName);
      setEditingTableId(null);
      setEditingTableName("");
      handleFetchTables();
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la modification du tableau."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Tableaux</ThemedText>
      <TextInput
        placeholder="Nom du tableau"
        value={tableName}
        onChangeText={setTableName}
        style={styles.input}
      />
      <CustomButton title="Ajouter un tableau" onPress={handleAddTable} />
      <FlatList
        data={tables}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableItem}>
            <TouchableOpacity
              onPress={() => {
                setEditingTableId(item.id);
                setEditingTableName(item.name);
              }}
              style={styles.editIcon}
            >
              <Ionicons name="pencil" size={24} color="black" />
            </TouchableOpacity>
            {editingTableId === item.id ? (
              <TextInput
                value={editingTableName}
                onChangeText={setEditingTableName}
                onBlur={handleEditTableName}
                style={styles.tableItemTextInput}
              />
            ) : (
              <TouchableOpacity onPress={() => handlePressItem(item.id)}>
                <ThemedText type="default">{item.name}</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}
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
  input: {
    marginTop: 12,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  tableItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableItemTextInput: {
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    width: "80%",
  },
  editIcon: {
    marginRight: 8,
  },
});

export default TablePage;
