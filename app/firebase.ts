import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import firebaseConfig from "@/constants/FirebaseConfig";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
