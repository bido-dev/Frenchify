import { useAuth } from '../contexts/AuthContext';
import { Layout } from './Layout';
import { TeacherLayout } from '../teacherPages/TeacherLayout';

interface RoleBasedLayoutProps {
    children: React.ReactNode;
}

/**
 * Conditionally renders Layout (student) or TeacherLayout (teacher/admin) based on user role
 */
export function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
    const { user } = useAuth();

    // Teachers and admins get TeacherLayout, students get regular Layout
    if (user?.role === 'teacher' || user?.role === 'admin') {
        return <TeacherLayout>{children}</TeacherLayout>;
    }

    return <Layout>{children}</Layout>;
}
