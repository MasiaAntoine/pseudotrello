import { database } from "@/app/firebase.ts";
import { ref, push, get, set, remove, update } from "firebase/database";

// Fonction pour ajouter une tâche associée à une liste
const addTask = async (task: { name: string; listId: string }) => {
  try {
    const tasksRef = ref(database, `tables/${task.listId}/tasks`);
    const newTaskRef = push(tasksRef);
    const newTaskId = newTaskRef.key;

    const newTask = {
      ...task,
      id: newTaskId,
    };

    await set(newTaskRef, newTask);
    console.log("Tâche ajoutée avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
  }
};

// Fonction pour récupérer toutes les tâches d'une liste spécifique
const fetchTasks = async (listId: string) => {
  try {
    const tasksRef = ref(database, `tables/${listId}/tasks`);
    const snapshot = await get(tasksRef);
    const tasks = snapshot.val();
    return tasks ? Object.values(tasks) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    return null;
  }
};

// Fonction pour supprimer une tâche par rapport à son id
const deleteTask = async (listId: string, taskId: string) => {
  try {
    const taskRef = ref(database, `tables/${listId}/tasks/${taskId}`);
    await remove(taskRef);
    console.log("Tâche supprimée avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
  }
};

// Fonction pour mettre à jour le nom d'une tâche
const updateTaskName = async (
  listId: string,
  taskId: string,
  newName: string
) => {
  try {
    const taskRef = ref(database, `tables/${listId}/tasks/${taskId}`);
    await update(taskRef, { name: newName });
    console.log("Nom de la tâche mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom de la tâche:", error);
  }
};

export { addTask, fetchTasks, deleteTask, updateTaskName };
