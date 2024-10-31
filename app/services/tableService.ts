import { database } from "@/app/firebase.ts";
import { ref, push, get, set, remove } from "firebase/database";

// Fonction pour ajouter un tableau
const addTable = async (table: { name: string; userId: string }) => {
  try {
    const tablesRef = ref(database, "tables");
    const newTableRef = push(tablesRef);
    const newTableId = newTableRef.key;

    const newTable = {
      ...table,
      id: newTableId,
    };

    await set(newTableRef, newTable); // Utiliser set directement sur newTableRef
    console.log("Tableau ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du tableau:", error);
  }
};

// Fonction pour récupérer tous les tableaux de l'utilisateur connecté
const fetchTables = async (userId: string) => {
  try {
    const tablesRef = ref(database, "tables");
    const snapshot = await get(tablesRef);
    const tables = snapshot.val();
    // Filtrer les tableaux pour n'afficher que ceux de l'utilisateur connecté
    const userTables = tables
      ? Object.values(tables).filter((table: any) => table.userId === userId)
      : [];
    return userTables; // Retourner les tableaux filtrés
  } catch (error) {
    console.error("Erreur lors de la récupération des tableaux:", error);
    return null; // Retourner null en cas d'erreur
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

export { addTable, fetchTables, fetchTableById, deleteTable };
