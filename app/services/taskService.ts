import { database, storage } from "@/app/firebase.ts";
import { ref, push, get, set, remove, update } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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

// Fonction pour mettre à jour une tâche
const updateTaskName = async (
  listId: string,
  taskId: string,
  updates: { name?: string; imageUri?: string | null }
) => {
  try {
    const taskRef = ref(database, `tables/${listId}/tasks/${taskId}`);
    await update(taskRef, updates);
    console.log("Tâche mise à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
  }
};

// Fonction pour récupérer les données d'une tâche par rapport à son id
const fetchTaskById = async (listId: string, taskId: string) => {
  try {
    const taskRef = ref(database, `tables/${listId}/tasks/${taskId}`);
    const snapshot = await get(taskRef);
    const task = snapshot.val();
    return task;
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche:", error);
    return null;
  }
};

// Fonction pour mettre à jour l'ID de la liste d'une tâche
const updateTaskListId = async (
  oldListId: string,
  newListId: string,
  taskId: string,
  taskData: any
) => {
  try {
    // Supprimer la tâche de l'ancienne liste
    const oldTaskRef = ref(database, `tables/${oldListId}/tasks/${taskId}`);
    await remove(oldTaskRef);

    // Ajouter la tâche à la nouvelle liste
    const newTaskRef = ref(database, `tables/${newListId}/tasks/${taskId}`);
    await set(newTaskRef, taskData);

    console.log("ID de la liste de la tâche mis à jour avec succès !");
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'ID de la liste de la tâche:",
      error
    );
  }
};

// Fonction pour télécharger une image de tâche
const uploadTaskImage = async (listId: string, taskId: string, uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageReference = storageRef(storage, `tasks/${taskId}`);
  await uploadBytes(storageReference, blob);
  const downloadURL = await getDownloadURL(storageReference);
  await updateTaskName(listId, taskId, { imageUri: downloadURL });
  return downloadURL;
};

// Fonction pour supprimer une image de tâche
const deleteTaskImage = async (taskId: string) => {
  const storageReference = storageRef(storage, `tasks/${taskId}`);
  await deleteObject(storageReference);
};

export {
  updateTaskListId,
  fetchTaskById,
  addTask,
  fetchTasks,
  deleteTask,
  updateTaskName,
  uploadTaskImage,
  deleteTaskImage,
};
