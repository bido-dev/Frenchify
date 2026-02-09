
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// This attempts to use Application Default Credentials
// You may need to run: gcloud auth application-default login
// OR set GOOGLE_APPLICATION_CREDENTIALS to a service account key path
try {
    const serviceAccount = require("../service-account.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (e) {
    console.error("❌ Failed to initialize Firebase Admin.");
    console.error("Make sure 'functions/service-account.json' exists.");
    console.error("Download it from Firebase Console > Project Settings > Service accounts.");
    process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

// ============================================
// HARDCODED ADMIN CREDENTIALS
// ============================================
const ADMIN_EMAIL = "admin@frenchify.com";
const ADMIN_PASSWORD = "admin123456";
const ADMIN_NAME = "System Admin";

async function createProductionAdmin() {
    console.log("🚀 Starting Production Admin Creation...\n");

    try {
        let uid = "";

        // 1. Check if user exists in Auth
        try {
            const existingUser = await auth.getUserByEmail(ADMIN_EMAIL);
            console.log(`ℹ️  User already exists in Auth: ${existingUser.email} (${existingUser.uid})`);
            uid = existingUser.uid;
        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                // Create user
                console.log(`📧 Creating new user in Auth: ${ADMIN_EMAIL}`);
                const userRecord = await auth.createUser({
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD,
                    emailVerified: true,
                    displayName: ADMIN_NAME
                });
                console.log(`✅ User created with UID: ${userRecord.uid}`);
                uid = userRecord.uid;
            } else {
                throw error;
            }
        }

        // 2. Create/Update Firestore Document
        console.log(`📝 Updating Firestore document for UID: ${uid}...`);

        await db.collection("users").doc(uid).set({
            uid,
            email: ADMIN_EMAIL,
            name: ADMIN_NAME,
            role: "admin",
            tier: "paid",
            status: "active",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        }, { merge: true }); // Merge ensures we don't overwrite existing fields if not needed, but sets the important ones

        console.log("✅ Firestore document updated successfully.");

        console.log("\n🎉 Admin setup complete!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`   Email:    ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    } catch (error) {
        console.error("❌ Failed to create admin:", error);
        process.exit(1);
    }
}

createProductionAdmin();
