/**
 * Seed Script for Firebase Emulators
 * Creates a hardcoded admin user in Firebase Auth and Firestore
 * 
 * Run with: npm run seed
 * Must be run AFTER emulators are started
 */

import * as admin from "firebase-admin";

// Configure to use emulators
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

// Initialize Firebase Admin SDK
admin.initializeApp({
    projectId: "frechify"  // Must match .firebaserc
});

const auth = admin.auth();
const db = admin.firestore();

// ============================================
// HARDCODED ADMIN CREDENTIALS - CHANGE THESE!
// ============================================
const ADMIN_EMAIL = "admin@frenchify.com";
const ADMIN_PASSWORD = "admin123456";
const ADMIN_NAME = "System Admin";

async function seedAdmin() {
    console.log("🌱 Starting seed process...\n");

    try {
        // Check if admin already exists
        try {
            const existingUser = await auth.getUserByEmail(ADMIN_EMAIL);
            console.log(`ℹ️  Admin user already exists: ${existingUser.email}`);
            console.log(`   UID: ${existingUser.uid}`);

            // Ensure Firestore document exists
            const userDoc = await db.collection("users").doc(existingUser.uid).get();
            if (!userDoc.exists) {
                console.log("⚠️  Firestore document missing, creating...");
                await createFirestoreDoc(existingUser.uid);
            } else {
                console.log("✅ Firestore document exists");
            }

            console.log("\n🎉 Seed complete! Admin ready to use.");
            process.exit(0);
        } catch (error: any) {
            if (error.code !== "auth/user-not-found") {
                throw error;
            }
            // User doesn't exist, create it
        }

        // Create admin user in Firebase Auth
        console.log(`📧 Creating admin user: ${ADMIN_EMAIL}`);
        const userRecord = await auth.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            emailVerified: true,
            displayName: ADMIN_NAME
        });

        console.log(`✅ Auth user created with UID: ${userRecord.uid}`);

        // Create Firestore document
        await createFirestoreDoc(userRecord.uid);

        console.log("\n🎉 Seed complete! Admin credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`   Email:    ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }

    process.exit(0);
}

async function createFirestoreDoc(uid: string) {
    console.log("📝 Creating Firestore document...");

    await db.collection("users").doc(uid).set({
        uid,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: "admin",
        tier: "paid",
        status: "active",
        createdAt: new Date().toISOString()
    });

    console.log("✅ Firestore document created");
}

// Run the seed
seedAdmin();
