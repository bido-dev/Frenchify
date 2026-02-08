import api from './index';

export interface Course {
    courseId: string;
    title: string;
    description: string;
    isPaid: boolean;
    teacherId: string;
    teacherName: string;
    status: 'draft' | 'published';
    category: 'grammar' | 'conversation';
    createdAt: string;
}

export interface Material {
    materialId: string;
    title: string;
    type: 'video' | 'youtube' | 'quiz' | 'pdf';
    url: string;
    isFreePreview: boolean;
    order: number;
}

export interface Question {
    questionId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    isAnswered: boolean;
    answerText?: string;
    answeredAt?: string;
}

/**
 * Browse course catalog (public)
 */
export const getCourses = async (category?: 'grammar' | 'conversation'): Promise<Course[]> => {
    const response = await api.get('/students/courses', {
        params: { category },
    });
    return response.data;
};

/**
 * Get single course details (public)
 */
export const getCourse = async (courseId: string): Promise<Course> => {
    const response = await api.get(`/students/courses/${courseId}`);
    return response.data;
};

/**
 * Get course materials (tier-enforced)
 */
export const getCourseMaterials = async (courseId: string): Promise<Material[]> => {
    const response = await api.get(`/students/courses/${courseId}/materials`);
    return response.data;
};

/**
 * Ask a question on a course (paid tier only)
 */
export const askQuestion = async (courseId: string, content: string): Promise<Question> => {
    const response = await api.post(`/questions/${courseId}`, { content });
    return response.data;
};

/**
 * Get all questions for a course
 */
export const getCourseQuestions = async (courseId: string): Promise<Question[]> => {
    const response = await api.get(`/questions/${courseId}`);
    return response.data;
};

/**
 * Student Stats and Enrollment APIs
 */

export interface StudentStats {
    enrolledCount: number;
    completedCount: number;
    totalHours: number;
    currentStreak: number;
}

export interface EnrolledCourse {
    id: string;
    title: string;
    category: string;
    progress: number;
    enrolledAt: string;
    lastAccessedAt?: string;
}

/**
 * Get student statistics
 * @returns Student learning stats (enrolled, completed, hours, streak)
 */
export const getStudentStats = async (): Promise<StudentStats> => {
    const response = await api.get('/students/stats');
    return response.data;
};

/**
 * Get student's enrolled courses with progress
 * @returns Array of enrolled courses with progress data
 */
export const getEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
    const response = await api.get('/students/enrolled');
    return response.data;
};

