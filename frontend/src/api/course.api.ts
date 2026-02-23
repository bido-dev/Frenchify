import api from './index';

/**
 * Course API - Endpoints for teacher course management
 */

export interface CourseCreateData {
    title: string;
    description: string;
    category: 'grammar' | 'conversation';
    isPaid: boolean;
}

export interface CourseDetail {
    id: string;
    teacherId: string;
    title: string;
    description: string;
    category: 'grammar' | 'conversation';
    isPaid: boolean;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

export interface MaterialData {
    id: string;
    title: string;
    type: 'video' | 'youtube' | 'quiz' | 'pdf';
    url: string;
    isFreePreview: boolean;
    createdAt: string;
}

export interface MaterialCreateData {
    title: string;
    type: 'video' | 'youtube' | 'quiz' | 'pdf';
    url: string;
    isFreePreview: boolean;
}

/** Create a new course (draft mode) */
export const createCourse = async (data: CourseCreateData): Promise<{ id: string }> => {
    const response = await api.post('/courses', data);
    return response.data;
};

/** Get a single course's details */
export const getCourse = async (courseId: string): Promise<CourseDetail> => {
    const response = await api.get(`/students/courses/${courseId}`);
    return { id: courseId, ...response.data };
};

/** Update course metadata */
export const updateCourse = async (courseId: string, data: Partial<CourseCreateData>): Promise<void> => {
    await api.patch(`/courses/${courseId}`, data);
};

/** Delete a course */
export const deleteCourse = async (courseId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}`);
};

/** Publish a course */
export const publishCourse = async (courseId: string): Promise<void> => {
    await api.patch(`/courses/${courseId}/publish`);
};

/** Get materials for a course (teacher endpoint - all materials) */
export const getCourseMaterials = async (courseId: string): Promise<MaterialData[]> => {
    const response = await api.get(`/courses/${courseId}/materials`);
    return response.data;
};

/** Add material to a course */
export const addMaterial = async (courseId: string, data: MaterialCreateData): Promise<void> => {
    await api.post(`/courses/${courseId}/materials`, data);
};

/** Update a material */
export const updateMaterial = async (courseId: string, materialId: string, data: Partial<MaterialCreateData>): Promise<void> => {
    await api.patch(`/courses/${courseId}/materials/${materialId}`, data);
};

/** Delete a material */
export const deleteMaterial = async (courseId: string, materialId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/materials/${materialId}`);
};

// ===== Quiz Generation Types =====

export type QuestionType = 'mcq' | 'true_false' | 'fill_blank';
export type QuizLanguage = 'english' | 'french';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
    id: number;
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
}

export interface GenerateQuizRequest {
    title: string;
    numberOfQuestions: number;
    language: QuizLanguage;
    questionTypes: QuestionType[];
    difficulty: QuizDifficulty;
    isFreePreview: boolean;
    pdfUrls: string[];
}

/** Generate a quiz using Gemini AI from PDFs */
export const generateQuiz = async (courseId: string, data: GenerateQuizRequest): Promise<{ quiz: QuizQuestion[] }> => {
    const response = await api.post(`/courses/${courseId}/materials/generate-quiz`, data);
    return response.data;
};
