import { database } from "@/app/firebase.ts";
import { ref, push, get, set, remove, update } from "firebase/database";

// Fonction pour ajouter une liste associée à une table
const addList = async (list: { name: string; tableId: string }) => {
  try {
    const listsRef = ref(database, `tables/${list.tableId}/lists`);
    const newListRef = push(listsRef);
    const newListId = newListRef.key;

    const newList = {
      ...list,
      id: newListId,
    };

    await set(newListRef, newList); // Utiliser set directement sur newListRef
    console.log("Liste ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la liste:", error);
  }
};

// Fonction pour récupérer toutes les listes d'une table spécifique
const fetchLists = async (tableId: string) => {
  try {
    const listsRef = ref(database, `tables/${tableId}/lists`);
    const snapshot = await get(listsRef);
    const lists = snapshot.val();
    // Retourner les listes
    return lists ? Object.values(lists) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des listes:", error);
    return null; // Retourner null en cas d'erreur
  }
};

// Fonction pour récupérer les données d'une liste par rapport à son id
const fetchListById = async (tableId: string, listId: string) => {
  try {
    const listRef = ref(database, `tables/${tableId}/lists/${listId}`);
    const snapshot = await get(listRef);
    const list = snapshot.val();
    return list;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste:", error);
    return null;
  }
};

// Fonction pour supprimer une liste par rapport à son id
const deleteList = async (tableId: string, listId: string) => {
  try {
    const listRef = ref(database, `tables/${tableId}/lists/${listId}`);
    await remove(listRef);
    console.log("Liste supprimée avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste:", error);
  }
};

// Fonction pour mettre à jour le nom d'une liste
const updateListName = async (
  tableId: string,
  listId: string,
  newName: string
) => {
  try {
    const listRef = ref(database, `tables/${tableId}/lists/${listId}`);
    await update(listRef, { name: newName });
    console.log("Nom de la liste mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom de la liste:", error);
  }
};

export { addList, fetchLists, fetchListById, deleteList, updateListName };
