import api from './index';
import type { PendingTeacher } from '../types/admin';

export interface ApprovalAction {
    uid: string;
    action: 'approve' | 'reject';
}

export interface SubscriptionUpdate {
    uid: string;
    tier: 'free' | 'paid';
}

/**
 * Get all pending teachers awaiting approval
 */
export const getPendingTeachers = async (): Promise<PendingTeacher[]> => {
    const response = await api.get('/admin/pending-teachers');
    return response.data;
};

/**
 * Approve or reject teacher registration
 */
export const approveTeacher = async (data: ApprovalAction): Promise<void> => {
    await api.post('/admin/approve-teacher', data);
};

/**
 * Manage user subscription
 */
export const updateSubscription = async (data: SubscriptionUpdate): Promise<void> => {
    await api.post('/admin/manage-subscription', data);
};

/**
 * Delete user
 */
export const deleteUser = async (uid: string): Promise<void> => {
    await api.delete(`/admin/users/${uid}`);
};

/**
 * Create admin account
 */
export const createAdmin = async (email: string, password: string): Promise<void> => {
    await api.post('/admin/create-admin', { email, password });
};
