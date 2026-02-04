import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// This allows your backend code to interact with Firebase services (Firestore, Auth, etc.)
admin.initializeApp();

// Export the Firestore instance for use in your functions
export const db = admin.firestore();

export const auth = admin.auth();
