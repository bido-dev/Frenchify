export interface PendingTeacher {
    uid: string;
    email: string;
    name?: string;
    createdAt: string;
    status: 'pending';
}

export interface AdminUser {
    uid: string;
    email: string;
    name?: string;
    role: 'student' | 'teacher' | 'admin';
    tier: 'free' | 'paid';
    status: 'active' | 'pending' | 'rejected';
    createdAt: string;
}

export interface SubscriptionUpdate {
    uid: string;
    tier: 'free' | 'paid';
}

export interface TeacherApprovalAction {
    uid: string;
    action: 'approve' | 'reject';
}
