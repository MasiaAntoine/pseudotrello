import { database } from "@/app/firebase.ts";
import { ref, push, get } from "firebase/database";

// Fonction pour ajouter un tableau
const addTable = async (table: { name: string; userId: string }) => {
  try {
    const tablesRef = ref(database, "tables");
    await push(tablesRef, table);
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

export { addTable, fetchTables };
