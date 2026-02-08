import { useState, useEffect } from 'react';
import DataTable, { type Column } from '../components/DataTable';
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { Check, X, AlertTriangle } from 'lucide-react';
import type { PendingTeacher } from '../types/admin';
import { approveTeacher } from '../api/admin.api';
import { usePendingTeachers } from '../hooks/usePendingTeachers';


export default function TeacherApprovals() {
    // Use custom hook for real-time updates
    const { teachers: fetchedTeachers, loading, error } = usePendingTeachers();
    const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Modal state
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Update local state when Firestore data changes
    useEffect(() => {
        setTeachers(fetchedTeachers);
    }, [fetchedTeachers]);

    // Show error toast if Firestore listener fails
    useEffect(() => {
        if (error) {
            setToast({ message: 'Failed to load pending teachers', type: 'error' });
        }
    }, [error]);

    const handleApprove = async (teacher: PendingTeacher) => {
        setProcessingId(teacher.uid);
        try {
            await approveTeacher({ uid: teacher.uid, action: 'approve' });
            setTeachers(prev => prev.filter(t => t.uid !== teacher.uid));
            setToast({ message: `${teacher.name || teacher.email} approved successfully`, type: 'success' });
        } catch (error) {
            console.error('Error approving teacher:', error);
            setToast({ message: 'Failed to approve teacher', type: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const openRejectModal = (teacher: PendingTeacher) => {
        setSelectedTeacher(teacher);
        setRejectModalOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedTeacher) return;

        setProcessingId(selectedTeacher.uid);
        setRejectModalOpen(false);

        try {
            await approveTeacher({ uid: selectedTeacher.uid, action: 'reject' });
            setTeachers(prev => prev.filter(t => t.uid !== selectedTeacher.uid));
            setToast({ message: `${selectedTeacher.name || selectedTeacher.email} rejected`, type: 'info' });
        } catch (error) {
            console.error('Error rejecting teacher:', error);
            setToast({ message: 'Failed to reject teacher', type: 'error' });
        } finally {
            setProcessingId(null);
            setSelectedTeacher(null);
        }
    };

    const columns: Column<PendingTeacher>[] = [
        {
            key: 'name',
            header: 'Name',
            render: (item) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{item.name || 'N/A'}</div>
                </div>
            )
        },
        {
            key: 'email',
            header: 'Email',
            render: (item) => <div className="text-sm text-gray-500">{item.email}</div>
        },
        {
            key: 'createdAt',
            header: 'Registered',
            render: (item) => <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</div>
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'text-right',
            render: (item) => (
                <div className="flex justify-end gap-2">
                    <ActionButton
                        variant="approve"
                        onClick={() => handleApprove(item)}
                        loading={processingId === item.uid}
                        disabled={!!processingId}
                        icon={<Check size={14} />}
                    >
                        Approve
                    </ActionButton>
                    <ActionButton
                        variant="reject"
                        onClick={() => openRejectModal(item)}
                        disabled={!!processingId}
                        icon={<X size={14} />}
                    >
                        Reject
                    </ActionButton>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Teacher Approvals</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Review and approve new teacher registrations.
                </p>
            </div>

            <DataTable
                columns={columns}
                data={teachers}
                loading={loading}
                keyExtractor={(item) => item.uid}
                emptyMessage="No pending teacher approvals found."
            />

            <Modal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Reject Teacher Application"
                variant="danger"
                footer={
                    <>
                        <ActionButton onClick={() => setRejectModalOpen(false)}>Cancel</ActionButton>
                        <ActionButton variant="delete" onClick={handleRejectConfirm}>Reject Application</ActionButton>
                    </>
                }
            >
                <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            Are you sure you want to reject <strong>{selectedTeacher?.name || selectedTeacher?.email}</strong>?
                        </p>
                        <p className="text-xs text-gray-500">
                            This action cannot be undone. The user will not be able to publish courses.
                        </p>
                    </div>
                </div>
            </Modal>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
