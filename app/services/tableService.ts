import { database } from "@/app/firebase.ts";
import { ref, push, get, set, update, remove } from "firebase/database";

// Fonction pour ajouter un tableau
const addTable = async (table: {
  name: string;
  userId: string;
  createdAt: string;
}) => {
  try {
    const tablesRef = ref(database, `tables`);
    const newTableRef = push(tablesRef);
    const newTableId = newTableRef.key;

    const newTable = {
      ...table,
      id: newTableId,
    };

    await set(newTableRef, newTable);
    console.log("Tableau ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du tableau:", error);
  }
};

// Fonction pour récupérer tous les tableaux d'un utilisateur spécifique
const fetchTables = async (userId: string) => {
  try {
    const tablesRef = ref(database, `tables`);
    const snapshot = await get(tablesRef);
    const tables = snapshot.val();
    return tables
      ? Object.values(tables).filter((table: any) => table.userId === userId)
      : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des tableaux:", error);
    return null;
  }
};

// Fonction pour récupérer les données d'un tableau par rapport à son id
const fetchTableById = async (tableId: string) => {
  try {
    const tableRef = ref(database, `tables/${tableId}`);
    const snapshot = await get(tableRef);
    const table = snapshot.val();
    return table;
  } catch (error) {
    console.error("Erreur lors de la récupération du tableau:", error);
    return null;
  }
};

// Fonction pour mettre à jour le nom d'un tableau
const updateTableName = async (tableId: string, newName: string) => {
  try {
    const tableRef = ref(database, `tables/${tableId}`);
    await update(tableRef, { name: newName });
    console.log("Nom du tableau mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom du tableau:", error);
  }
};

// Fonction pour supprimer un tableau par rapport à son id
const deleteTable = async (tableId: string) => {
  try {
    const tableRef = ref(database, `tables/${tableId}`);
    await remove(tableRef);
    console.log("Tableau supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du tableau:", error);
  }
};

export { addTable, fetchTables, fetchTableById, updateTableName, deleteTable };
