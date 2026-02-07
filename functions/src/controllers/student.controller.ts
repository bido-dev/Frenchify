import { Request, Response } from "express";
import { getCourseById } from "../models/course.model";
import { db } from "../config/firebase";

/**
 * Get all published courses (Public endpoint)
 * GET /students/courses
 */
export const getCourses = async (req: Request, res: Response) => {
    try {
        const { category } = req.query; // Optional filter: 'grammar' | 'conversation'

        let query = db.collection("courses").where("status", "==", "published");

        if (category && (category === "grammar" || category === "conversation")) {
            query = query.where("category", "==", category);
        }

        const snapshot = await query.get();

        const courses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).send(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send({ message: "Error fetching courses" });
    }
};

/**
 * Get single course details (Public endpoint)
 * GET /students/courses/:id
 */
export const getCourseById_Handler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        const course = await getCourseById(id);

        if (!course) {
            res.status(404).send({ message: "Course not found" });
            return;
        }

        res.status(200).send(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).send({ message: "Error fetching course" });
    }
};

/**
 * Get course materials with tier enforcement
 * GET /students/courses/:id/materials
 * - Free tier: Only materials where isFreePreview === true
 * - Paid tier: All materials
 */
export const getCourseMaterials = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const userTier = req.user?.tier || "free"; // From auth middleware or default to free

        // Get all materials for the course
        const snapshot = await db
            .collection("courses")
            .doc(id)
            .collection("materials")
            .get();

        let materials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter based on tier (PRD 3.2)
        if (userTier === "free") {
            materials = materials.filter((material: any) => material.isFreePreview === true);
        }

        res.status(200).send(materials);
    } catch (error) {
        console.error("Error fetching materials:", error);
        res.status(500).send({ message: "Error fetching materials" });
    }
};
