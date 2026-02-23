import { GoogleGenAI } from "@google/genai";

export interface QuizQuestion {
    id: number;
    type: "mcq" | "true_false" | "fill_blank";
    question: string;
    options?: string[];          // For MCQ and True/False
    correctAnswer: string;       // The correct answer text
    explanation?: string;        // Optional explanation
}

export interface GenerateQuizParams {
    pdfTexts: string[];                              // Extracted text from PDFs
    numberOfQuestions: number;                         // 1-40
    language: "english" | "french";
    questionTypes: ("mcq" | "true_false" | "fill_blank")[];
    difficulty: "easy" | "medium" | "hard";
}

export const generateQuizFromAI = async (params: GenerateQuizParams): Promise<QuizQuestion[]> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const ai = new GoogleGenAI({ apiKey });

    const combinedText = params.pdfTexts.join("\n\n---\n\n");

    // Build the type instructions
    const typeDescriptions: string[] = [];
    if (params.questionTypes.includes("mcq")) {
        typeDescriptions.push(
            `"mcq" – Multiple Choice: Provide exactly 4 options in the "options" array. The "correctAnswer" must exactly match one of the options.`
        );
    }
    if (params.questionTypes.includes("true_false")) {
        typeDescriptions.push(
            `"true_false" – True or False: Set "options" to ["True", "False"]. The "correctAnswer" must be either "True" or "False".`
        );
    }
    if (params.questionTypes.includes("fill_blank")) {
        typeDescriptions.push(
            `"fill_blank" – Fill in the Blank: The question must include a "______" blank. Do NOT include "options". The "correctAnswer" is the word or phrase that fills the blank.`
        );
    }

    const prompt = `You are an expert educational quiz generator. Generate a quiz based on the following study material.

INSTRUCTIONS:
- Generate exactly ${params.numberOfQuestions} questions.
- Language: All questions and answers must be in ${params.language === "french" ? "French" : "English"}.
- Difficulty: ${params.difficulty}.
- Distribute questions roughly equally among these types: ${params.questionTypes.join(", ")}.

QUESTION TYPE SPECIFICATIONS:
${typeDescriptions.join("\n")}

OUTPUT FORMAT:
Return ONLY a valid JSON array (no markdown, no explanation, no surrounding text) with this structure:
[
  {
    "id": 1,
    "type": "mcq" | "true_false" | "fill_blank",
    "question": "Question text here",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "Brief explanation"
  }
]

STUDY MATERIAL:
${combinedText.substring(0, 30000)}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const text = response.text?.trim() || "";

    // Parse the JSON from the response; strip markdown fences if present
    let jsonString = text;
    if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const questions: QuizQuestion[] = JSON.parse(jsonString);

    // Basic validation
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("AI returned invalid quiz structure");
    }

    return questions;
};
