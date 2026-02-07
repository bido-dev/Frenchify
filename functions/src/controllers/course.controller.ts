import { Request, Response } from "express";
import {
    createCourse,
    addMaterialToCourse,
    checkCourseOwnership,
    updateCourseStatus,
    updateCourse,
    deleteCourse,
    updateMaterial,
    deleteMaterial
} from "../models/course.model";
import { getUserById } from "../models/user.model";

// 1. Create a New Course (Draft Mode) [PRD 3.3]
export const createCourseHandler = async (req: Request, res: Response) => {
    try {
        const { title, description, category, isPaid } = req.body;
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Use model layer for database operation
        const courseId = await createCourse(uid, {
            title,
            description,
            category,
            isPaid
        });

        res.status(201).send({ id: courseId, message: "Course created successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error creating course" });
    }
};

// 2. Add Material to Course (YouTube, Video, Quiz) [PRD 8]
export const addMaterial = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const { title, type, url, isFreePreview } = req.body;
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Use model layer to verify ownership
        const isOwner = await checkCourseOwnership(courseId, uid);
        const isAdmin = req.user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            res.status(403).send({ message: "Forbidden: Not your course" });
            return;
        }

        // Use model layer for database operation
        await addMaterialToCourse(courseId, {
            title,
            type,
            url,
            isFreePreview
        });

        res.status(200).send({ message: "Material added successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error adding material" });
    }
};

// 3. Publish Course (Gatekeeping) [PRD 3.3]
export const publishCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // 1. Check if Teacher is Approved [PRD 6] - Use model layer
        const user = await getUserById(uid);

        if (user?.status !== 'active') {
            res.status(403).send({ message: "Forbidden: You must be an approved teacher to publish." });
            return;
        }

        // 2. Update Status - Use model layer
        await updateCourseStatus(courseId, 'published');

        res.status(200).send({ message: "Course published live!" });
    } catch (error) {
        res.status(500).send({ message: "Error publishing course" });
    }
};

// 4. Update Course (Title, Description, etc.)
export const updateCourseHandler = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const { title, description, category, isPaid } = req.body;
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Check ownership
        const isOwner = await checkCourseOwnership(courseId, uid);
        const isAdmin = req.user?.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403).send({ message: "Forbidden: Not your course" });
            return;
        }

        // Use model layer for database operation
        await updateCourse(courseId, { title, description, category, isPaid });

        res.status(200).send({ message: "Course updated successfully" });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).send({ message: "Error updating course" });
    }
};

// 5. Delete Course
export const deleteCourseHandler = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Check ownership
        const isOwner = await checkCourseOwnership(courseId, uid);
        const isAdmin = req.user?.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403).send({ message: "Forbidden: Not your course" });
            return;
        }

        // Use model layer for database operation
        await deleteCourse(courseId);

        res.status(200).send({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).send({ message: "Error deleting course" });
    }
};

// 6. Update Material
export const updateMaterialHandler = async (req: Request, res: Response) => {
    try {
        const { courseId, materialId } = req.params as { courseId: string; materialId: string };
        const { title, type, url, isFreePreview } = req.body;
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Check ownership
        const isOwner = await checkCourseOwnership(courseId, uid);
        const isAdmin = req.user?.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403).send({ message: "Forbidden: Not your course" });
            return;
        }

        // Use model layer for database operation
        await updateMaterial(courseId, materialId, { title, type, url, isFreePreview });

        res.status(200).send({ message: "Material updated successfully" });
    } catch (error) {
        console.error("Error updating material:", error);
        res.status(500).send({ message: "Error updating material" });
    }
};

// 7. Delete Material
export const deleteMaterialHandler = async (req: Request, res: Response) => {
    try {
        const { courseId, materialId } = req.params as { courseId: string; materialId: string };
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Check ownership
        const isOwner = await checkCourseOwnership(courseId, uid);
        const isAdmin = req.user?.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403).send({ message: "Forbidden: Not your course" });
            return;
        }

        // Use model layer for database operation
        await deleteMaterial(courseId, materialId);

        res.status(200).send({ message: "Material deleted successfully" });
    } catch (error) {
        console.error("Error deleting material:", error);
        res.status(500).send({ message: "Error deleting material" });
    }
};
