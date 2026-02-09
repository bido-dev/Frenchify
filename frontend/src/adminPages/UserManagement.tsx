import { useState, useEffect } from 'react';
import DataTable, { type Column } from '../components/DataTable';
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import { Badge } from '../components/Badge';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import { Trash2, AlertTriangle, CreditCard } from 'lucide-react';
import type { AdminUser } from '../types/admin';
import { getAllUsers, updateSubscription, deleteUser as deleteUserApi } from '../api/admin.api';

// ... (imports remain)

export default function UserManagement() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // Toast state
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({ show: false, message: '', type: 'info' });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await getAllUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setToast({
                    show: true,
                    message: 'Failed to fetch users',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredUsers(users);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            setFilteredUsers(users.filter(user =>
                user.email.toLowerCase().includes(lowerQuery) ||
                user.name?.toLowerCase().includes(lowerQuery)
            ));
        }
    }, [searchQuery, users]);

    const handleToggleSubscription = async (user: AdminUser) => {
        setProcessingId(user.uid);
        const newTier = user.tier === 'free' ? 'paid' : 'free';

        try {
            await updateSubscription({ uid: user.uid, tier: newTier });

            setUsers(prev => prev.map(u =>
                u.uid === user.uid ? { ...u, tier: newTier } : u
            ));

            setToast({
                show: true,
                message: `User upgraded to ${newTier.toUpperCase()}`,
                type: 'success'
            });
        } catch (error: any) {
            console.error('Error updating subscription:', error);
            setToast({
                show: true,
                message: error.response?.data?.message || 'Failed to update subscription',
                type: 'error'
            });
        } finally {
            setProcessingId(null);
        }
    };

    const openDeleteModal = (user: AdminUser) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        setProcessingId(selectedUser.uid);
        setDeleteModalOpen(false);

        try {
            // Real API call instead of mock
            await deleteUserApi(selectedUser.uid);

            // Remove from local state
            setUsers(prev => prev.filter(u => u.uid !== selectedUser.uid));

            // Show success toast
            setToast({
                show: true,
                message: `${selectedUser.role === 'teacher' ? 'Teacher' : 'User'} deleted successfully`,
                type: 'success'
            });
        } catch (error: any) {
            console.error('Error deleting user:', error);

            // Show error toast
            setToast({
                show: true,
                message: error.response?.data?.message || 'Failed to delete user',
                type: 'error'
            });
        } finally {
            setProcessingId(null);
            setSelectedUser(null);
        }
    };

    const columns: Column<AdminUser>[] = [
        {
            key: 'name',
            header: 'User',
            render: (item) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{item.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                </div>
            )
        },
        {
            key: 'role',
            header: 'Role',
            render: (item) => {
                const variant = item.role === 'admin' ? 'info' : item.role === 'teacher' ? 'success' : 'neutral';
                return <Badge variant={variant} text={item.role} />;
            }
        },
        {
            key: 'tier',
            header: 'Tier',
            render: (item) => {
                if (item.role === 'admin') return <span className="text-xs text-gray-400">-</span>;
                const variant = item.tier === 'paid' ? 'pro' : 'free';
                return <Badge variant={variant} text={item.tier.toUpperCase()} />;
            }
        },
        {
            key: 'createdAt',
            header: 'Joined',
            render: (item) => <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (item) => (
                <div className="flex justify-end gap-2">
                    {item.role !== 'admin' && (
                        <>
                            <ActionButton
                                variant="neutral"
                                onClick={() => handleToggleSubscription(item)}
                                loading={processingId === item.uid}
                                disabled={!!processingId}
                                title={item.tier === 'free' ? "Upgrade to Paid" : "Downgrade to Free"}
                                icon={<CreditCard size={14} className={item.tier === 'free' ? "text-amber-500" : "text-gray-400"} />}
                            >
                                {item.tier === 'free' ? 'Upgrade' : 'Downgrade'}
                            </ActionButton>

                            <ActionButton
                                variant="delete"
                                onClick={() => openDeleteModal(item)}
                                disabled={!!processingId}
                                title="Delete User"
                                icon={<Trash2 size={14} />}
                            />
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage user accounts, roles, and subscriptions.
                    </p>
                </div>
                <div className="w-full sm:w-72">
                    <SearchBar onSearch={setSearchQuery} placeholder="Search by name or email..." />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredUsers}
                loading={loading}
                keyExtractor={(item) => item.uid}
                emptyMessage="No users found matching your search."
            />

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title={`Delete ${selectedUser?.role === 'teacher' ? 'Teacher' : 'User'} Account`}
                variant="danger"
                footer={
                    <>
                        <ActionButton onClick={() => setDeleteModalOpen(false)}>Cancel</ActionButton>
                        <ActionButton variant="delete" onClick={handleDeleteConfirm}>
                            Delete {selectedUser?.role === 'teacher' ? 'Teacher' : 'User'}
                        </ActionButton>
                    </>
                }
            >
                <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            Are you sure you want to delete <strong>{selectedUser?.email}</strong>?
                        </p>

                        {selectedUser?.role === 'teacher' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-2">
                                <p className="text-xs text-amber-800 font-medium mb-1">
                                    ⚠️ Teacher Deletion Impact:
                                </p>
                                <ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
                                    <li>All courses created by this teacher will be deleted</li>
                                    <li>All materials within those courses will be removed</li>
                                    <li>All Q&A data for those courses will be lost</li>
                                </ul>
                            </div>
                        )}

                        {selectedUser?.role === 'student' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-2">
                                <p className="text-xs text-blue-800 font-medium mb-1">
                                    ℹ️ Student Deletion Impact:
                                </p>
                                <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                                    <li>All course enrollments will be removed</li>
                                    <li>All questions posted by this student will be deleted</li>
                                </ul>
                            </div>
                        )}

                        <p className="text-xs text-gray-500">
                            This action will permanently remove the user from Authentication and Database.
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}
