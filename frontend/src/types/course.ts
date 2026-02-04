export type CourseCategory = 'grammar' | 'conversation';
export type UserTier = 'free' | 'paid';
export type CourseStatus = 'draft' | 'published';

export interface Course {
    id: string;
    title: string;
    description?: string;
    teacherName: string;
    category: CourseCategory;
    isPaid: boolean;
    thumbnailUrl?: string;
    status?: CourseStatus;
}

export interface StudentCourse extends Course {
    userTier: UserTier;
}

export interface TeacherCourse extends Course {
    students: number;
    earnings?: number;
}

export interface Material {
    id: number;
    title: string;
    type: 'youtube' | 'video' | 'quiz';
    isFree: boolean;
    url?: string;
}
