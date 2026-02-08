import { useState, useEffect } from 'react';
import DataTable, { type Column } from '../components/DataTable';
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import { Badge } from '../components/Badge';
import SearchBar from '../components/SearchBar';
import { Trash2, AlertTriangle, CreditCard } from 'lucide-react';
import type { AdminUser } from '../types/admin';

// MOCK DATA
const MOCK_USERS: AdminUser[] = [
    { uid: '101', email: 'john.doe@example.com', name: 'John Doe', role: 'student', tier: 'free', status: 'active', createdAt: '2023-01-10T10:00:00Z' },
    { uid: '102', email: 'jane.smith@example.com', name: 'Jane Smith', role: 'student', tier: 'paid', status: 'active', createdAt: '2023-02-15T14:30:00Z' },
    { uid: '103', email: 'prof.martin@frenchify.com', name: 'Prof. Martin', role: 'teacher', tier: 'free', status: 'active', createdAt: '2023-03-20T09:15:00Z' },
    { uid: '104', email: 'alice.wonder@example.com', name: 'Alice Wonder', role: 'student', tier: 'free', status: 'active', createdAt: '2023-04-05T11:20:00Z' },
    { uid: '105', email: 'bob.builder@example.com', name: 'Bob Builder', role: 'student', tier: 'paid', status: 'active', createdAt: '2023-05-12T16:45:00Z' },
    { uid: '106', email: 'admin@frenchify.com', name: 'Super Admin', role: 'admin', tier: 'free', status: 'active', createdAt: '2023-01-01T00:00:00Z' },
];

export default function UserManagement() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        // Simulate API fetch
        const fetchUsers = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                setUsers(MOCK_USERS);
                setFilteredUsers(MOCK_USERS);
            } catch (error) {
                console.error('Error fetching users:', error);
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
            // API call: await api.post('/admin/manage-subscription', { uid: user.uid, tier: newTier });
            await new Promise(resolve => setTimeout(resolve, 600));

            setUsers(prev => prev.map(u =>
                u.uid === user.uid ? { ...u, tier: newTier } : u
            ));

            console.log(`Updated subscription for ${user.email} to ${newTier}`);
        } catch (error) {
            console.error('Error updating subscription:', error);
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
            // API call: await api.delete(`/admin/users/${selectedUser.uid}`);
            await new Promise(resolve => setTimeout(resolve, 800));

            setUsers(prev => prev.filter(u => u.uid !== selectedUser.uid));
            console.log(`Deleted user ${selectedUser.email}`);
        } catch (error) {
            console.error('Error deleting user:', error);
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
                title="Delete User Account"
                variant="danger"
                footer={
                    <>
                        <ActionButton onClick={() => setDeleteModalOpen(false)}>Cancel</ActionButton>
                        <ActionButton variant="delete" onClick={handleDeleteConfirm}>Delete User</ActionButton>
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
                        <p className="text-xs text-gray-500">
                            This action ensures user data is permanently removed from Authentication and Database.
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
