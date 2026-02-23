import api from './index';

export interface LessonData {
    id: string;
    title: string;
    video?: {
        type: 'youtube' | 'upload';
        url: string;
    };
    pdf?: {
        url: string;
        title: string;
    };
    quiz?: {
        id: string;
        title: string;
        url: string;
    };
    materials?: {
        id: string;
        title: string;
        url: string;
        type: string;
    }[];
}

export interface LessonCreateData {
    title: string;
    video?: {
        type: 'youtube' | 'upload';
        url: string;
    };
    pdf?: {
        url: string;
        title: string;
    };
    quiz?: {
        id: string;
        title: string;
        url: string;
    };
    materials?: {
        id: string;
        title: string;
        url: string;
        type: string;
    }[];
}

/** Create a new lesson */
export const createLesson = async (courseId: string, data: LessonCreateData): Promise<{ id: string }> => {
    const response = await api.post(`/courses/${courseId}/lessons`, data);
    return response.data;
};

/** Get all lessons for a course */
export const getCourseLessons = async (courseId: string): Promise<LessonData[]> => {
    const response = await api.get(`/students/courses/${courseId}/lessons`);
    return response.data;
};

/** Update a lesson */
export const updateLesson = async (courseId: string, lessonId: string, data: Partial<LessonCreateData>): Promise<void> => {
    await api.patch(`/courses/${courseId}/lessons/${lessonId}`, data);
};

/** Delete a lesson */
export const deleteLesson = async (courseId: string, lessonId: string): Promise<void> => {
    await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
};
