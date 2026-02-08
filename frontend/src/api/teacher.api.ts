import api from './index';

/**
 * Teacher API - Endpoints for teacher-specific features
 */

export interface TeacherStats {
    coursesCreated: number;
    totalStudents: number;
    pendingQuestions: number;
}

export interface TeacherCourse {
    id: string;
    title: string;
    status: 'draft' | 'published';
    enrolledCount: number;
    category: string;
    createdAt: string;
}

/**
 * Get teacher statistics
 * @returns Teaching stats (courses created, total students, pending questions)
 */
export const getTeacherStats = async (): Promise<TeacherStats> => {
    const response = await api.get('/teachers/stats');
    return response.data;
};

/**
 * Get teacher's courses with enrollment stats
 * @returns Array of courses created by the teacher
 */
export const getTeacherCourses = async (): Promise<TeacherCourse[]> => {
    const response = await api.get('/teachers/courses');
    return response.data;
};
