// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from "firebase/auth";
import { getDatabase, ref, get, set, update, remove } from "firebase/database";

const firebaseConfig = {
  
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

// Database CRUD Operations
export const DatabaseService = {
  // Fetch all articles
  getArticles: async () => {
    try {
      const articlesRef = ref(database, "articles");
      const snapshot = await get(articlesRef);
      return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  },

  // Fetch all users
  getUsers: async () => {
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);
      return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  // Add a new user
  addUser: async (userId, userData) => {
    try {
      await set(ref(database, "users/" + userId), userData);
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  },

  // Update user health tracking
  updateUserHealthTracking: async (userId, healthData) => {
    try {
      const userHealthRef = ref(database, `users/${userId}/health_tracking`);
      await update(userHealthRef, healthData);
      return true;
    } catch (error) {
      console.error("Error updating health tracking:", error);
      return false;
    }
  },

  // Search articles by tag or title
  searchArticles: async (searchTerm) => {
    try {
      const articlesRef = ref(database, "articles");
      const snapshot = await get(articlesRef);

      if (!snapshot.exists()) return [];

      const articles = snapshot.val();
      return articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    } catch (error) {
      console.error("Error searching articles:", error);
      return [];
    }
  },
};

export default app;
