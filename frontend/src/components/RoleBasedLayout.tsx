import { Layout } from './Layout';

interface RoleBasedLayoutProps {
    children: React.ReactNode;
}

/**
 * Wraps routes in the unified Layout component
 */
export function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
    // The Layout component internally handles the distinction between teachers and students.
    // We can conditionally render AdminLayout here if we wanted, but Layout works for profile.

    return <Layout>{children}</Layout>;
}
