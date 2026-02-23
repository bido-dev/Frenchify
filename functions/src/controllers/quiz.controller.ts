import { Request, Response } from "express";
import { PDFParse } from "pdf-parse";
import { generateQuizFromAI, GenerateQuizParams } from "../services/gemini.service";
import { checkCourseOwnership, addMaterialToCourse } from "../models/course.model";

// Generate a quiz from PDFs using Gemini AI
export const generateQuiz = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params as { courseId: string };
        const uid = req.user?.uid;

        if (!uid) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }

        // Verify ownership
        const isOwner = await checkCourseOwnership(courseId, uid);
        const isAdmin = req.user?.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403).send({ message: "Forbidden: Not your course" });
            return;
        }

        const { title, numberOfQuestions, language, questionTypes, difficulty, isFreePreview, pdfUrls } = req.body;

        // Validate required fields
        if (!title || !numberOfQuestions || !language || !questionTypes || !difficulty || !pdfUrls) {
            res.status(400).send({ message: "Missing required fields: title, numberOfQuestions, language, questionTypes, difficulty, pdfUrls" });
            return;
        }

        if (numberOfQuestions < 1 || numberOfQuestions > 40) {
            res.status(400).send({ message: "Number of questions must be between 1 and 40" });
            return;
        }

        // Fetch and parse PDFs from their URLs
        const pdfTexts: string[] = [];
        for (const pdfUrl of pdfUrls) {
            try {
                const response = await fetch(pdfUrl);
                if (!response.ok) {
                    console.error(`HTTP Error fetching PDF: ${response.status} ${response.statusText}`);
                    continue;
                }
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const parser = new PDFParse({ data: buffer });
                const parsed = await parser.getText();
                await parser.destroy();
                pdfTexts.push(parsed.text);
            } catch (pdfError: any) {
                console.error("Error parsing PDF:", pdfUrl, pdfError.message || pdfError);
            }
        }

        if (pdfTexts.length === 0) {
            res.status(400).send({ message: "Could not extract text from any of the provided PDFs" });
            return;
        }

        // Call Gemini AI
        const params: GenerateQuizParams = {
            pdfTexts,
            numberOfQuestions,
            language,
            questionTypes,
            difficulty,
        };

        const questions = await generateQuizFromAI(params);

        // Save the quiz as a material in the course
        const quizData = JSON.stringify(questions);
        await addMaterialToCourse(courseId, {
            title,
            type: "quiz",
            url: quizData,
            isFreePreview: isFreePreview || false,
        });

        res.status(200).send({
            message: "Quiz generated and saved successfully",
            quiz: questions,
        });
    } catch (error: any) {
        console.error("Error generating quiz:", error);
        res.status(500).send({ message: error.message || "Error generating quiz" });
    }
};
