import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import { ThemedText } from "@/app/components/ThemedText";
import { useRouter, useNavigation } from "expo-router";
import { addTable, fetchTables } from "@/app/services";

const TablePage: React.FC = () => {
  const [tableName, setTableName] = useState("");
  const [tables, setTables] = useState([]);
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
      Alert.alert("Succès", "Tableau ajouté avec succès.");
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
    router.push(`/list/${tableId}`);
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
      <Button title="Ajouter un tableau" onPress={handleAddTable} />
      <FlatList
        data={tables}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressItem(item.id)}>
            <View style={styles.tableItem}>
              <ThemedText type="default">{item.name}</ThemedText>
            </View>
          </TouchableOpacity>
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
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default TablePage;
