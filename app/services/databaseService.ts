import { database } from "@/app/firebase.ts";
import { ref, push, get, child } from "firebase/database";

// Fonction pour ajouter une tâche
export const addTask = async (task: { title: string; description: string }) => {
  try {
    const tasksRef = ref(database, "tasks");
    await push(tasksRef, task);
    console.log("Tâche ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
  }
};

// Fonction pour récupérer toutes les tâches
export const fetchTasks = async () => {
  try {
    const tasksRef = ref(database, "tasks");
    const snapshot = await get(tasksRef);
    const tasks = snapshot.val();
    return tasks; // Retourner les tâches récupérées
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    return null; // Retourner null en cas d'erreur
  }
};
