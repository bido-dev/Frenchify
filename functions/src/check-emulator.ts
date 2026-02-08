/**
 * Check emulator state
 */
import * as admin from "firebase-admin";

process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

admin.initializeApp({ projectId: "frenchify" });

const auth = admin.auth();
const db = admin.firestore();

async function check() {
    console.log("🔍 Checking emulator state...\n");

    // Check Auth
    console.log("=== Firebase Auth ===");
    try {
        const users = await auth.listUsers();
        console.log(`Found ${users.users.length} users:`);
        users.users.forEach(u => console.log(`  - ${u.email} (${u.uid})`));
    } catch (e: any) {
        console.log("Error:", e.message);
    }

    // Check Firestore
    console.log("\n=== Firestore (users collection) ===");
    try {
        const docs = await db.collection("users").get();
        console.log(`Found ${docs.size} documents:`);
        docs.forEach(d => {
            const data = d.data();
            console.log(`  - ${data.email} (role: ${data.role})`);
        });
    } catch (e: any) {
        console.log("Error:", e.message);
    }

    process.exit(0);
}

check();
