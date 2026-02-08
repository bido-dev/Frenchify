/**
 * Seed Mock Data for Testing Profile Stats
 * Creates sample courses and enrollments
 * 
 * Run with: npm run seed:enrollments
 * Must be run AFTER emulators are started and admin seed
 */

import * as admin from "firebase-admin";

process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

admin.initializeApp({
    projectId: "frechify"
});

const db = admin.firestore();
const auth = admin.auth();

async function seedMockData() {
    console.log("🌱 Seeding mock data for profile testing...\n");

    try {
        // 1. Create test users (student and teacher)
        console.log("👥 Creating test users...");

        const studentEmail = "student@test.com";
        const teacherEmail = "teacher@test.com";

        let studentUser, teacherUser;

        // Create or get student
        try {
            studentUser = await auth.getUserByEmail(studentEmail);
            console.log(`  ✓ Student exists: ${studentEmail}`);
        } catch (e) {
            studentUser = await auth.createUser({
                email: studentEmail,
                password: "test1234",
                emailVerified: true,
            });
            await db.collection("users").doc(studentUser.uid).set({
                uid: studentUser.uid,
                email: studentEmail,
                name: "Test Student",
                role: "student",
                tier: "paid",
                status: "active",
                createdAt: new Date().toISOString(),
            });
            console.log(`  ✓ Created student: ${studentEmail}`);
        }

        // Create or get teacher
        try {
            teacherUser = await auth.getUserByEmail(teacherEmail);
            console.log(`  ✓ Teacher exists: ${teacherEmail}`);
        } catch (e) {
            teacherUser = await auth.createUser({
                email: teacherEmail,
                password: "test1234",
                emailVerified: true,
            });
            await db.collection("users").doc(teacherUser.uid).set({
                uid: teacherUser.uid,
                email: teacherEmail,
                name: "Test Teacher",
                role: "teacher",
                tier: "free",
                status: "active",
                createdAt: new Date().toISOString(),
            });
            console.log(`  ✓ Created teacher: ${teacherEmail}`);
        }

        // 2. Create sample courses
        console.log("\n📚 Creating sample courses...");

        const course1Data = {
            teacherId: teacherUser.uid,
            title: "French Grammar Basics",
            description: "Learn essential French grammar",
            category: "grammar",
            isPaid: false,
            status: "published",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const course2Data = {
            teacherId: teacherUser.uid,
            title: "Conversational French",
            description: "Practice everyday French conversations",
            category: "conversation",
            isPaid: true,
            status: "published",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const course3Data = {
            teacherId: teacherUser.uid,
            title: "Advanced Grammar (Draft)",
            description: "Deep dive into complex grammar",
            category: "grammar",
            isPaid: true,
            status: "draft",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const course1 = await db.collection("courses").add(course1Data);
        const course2 = await db.collection("courses").add(course2Data);
        void await db.collection("courses").add(course3Data); // Draft course, not enrolled

        console.log(`  ✓ Created 3 courses for teacher`);

        // 3. Create enrollments for student
        console.log("\n📝 Creating enrollments...");

        await db.collection("enrollments").add({
            userId: studentUser.uid,
            courseId: course1.id,
            enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
            progress: 75,
            totalHours: 12.5,
            lastAccessedAt: new Date().toISOString(),
        });

        await db.collection("enrollments").add({
            userId: studentUser.uid,
            courseId: course2.id,
            enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
            progress: 100,
            totalHours: 20,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            lastAccessedAt: new Date().toISOString(),
        });

        console.log(`  ✓ Created enrollments for student`);

        // 4. Create some questions
        console.log("\n❓ Creating sample questions...");

        await db.collection("courses").doc(course1.id).collection("questions").add({
            courseId: course1.id,
            userId: studentUser.uid,
            userName: "Test Student",
            content: "How do I use the subjunctive mood?",
            createdAt: new Date().toISOString(),
            isAnswered: false,
        });

        await db.collection("courses").doc(course2.id).collection("questions").add({
            courseId: course2.id,
            userId: studentUser.uid,
            userName: "Test Student",
            content: "What's the difference between 'tu' and 'vous'?",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isAnswered: true,
            answerText: "Use 'tu' for informal, 'vous' for formal or plural.",
            answeredAt: new Date().toISOString(),
        });

        console.log(`  ✓ Created 2 questions (1 pending, 1 answered)`);

        console.log("\n✅ Mock data seeded successfully!");
        console.log("\n📊 Test Credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`  Student: ${studentEmail} / test1234`);
        console.log(`  Teacher: ${teacherEmail} / test1234`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n🔗 Test the endpoints:");
        console.log("  Student stats: GET /students/stats");
        console.log("  Student enrolled: GET /students/enrolled");
        console.log("  Teacher stats: GET /teachers/stats");
        console.log("  Teacher courses: GET /teachers/courses");

    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }

    process.exit(0);
}

seedMockData();
