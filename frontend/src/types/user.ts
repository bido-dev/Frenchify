export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    tier: 'free' | 'paid';
    role: UserRole;
    avatar?: string;
}
