import React, { useState, useEffect } from 'react';
import DataTable, { type Column } from '../components/DataTable';
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import { Check, X, AlertTriangle } from 'lucide-react';
import type { PendingTeacher } from '../types/admin';

// MOCK DATA
const MOCK_PENDING_TEACHERS: PendingTeacher[] = [
    { uid: '1', email: 'marie.curie@science.fr', name: 'Marie Curie', createdAt: '2023-11-15T10:00:00Z', status: 'pending' },
    { uid: '2', email: 'pierre.dupont@test.com', name: 'Pierre Dupont', createdAt: '2023-11-16T14:30:00Z', status: 'pending' },
    { uid: '3', email: 'sophie.germain@math.fr', name: 'Sophie Germain', createdAt: '2023-11-17T09:15:00Z', status: 'pending' },
];

export default function TeacherApprovals() {
    const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Modal state
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);

    useEffect(() => {
        // Simulate API fetch
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                setTeachers(MOCK_PENDING_TEACHERS);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const handleApprove = async (teacher: PendingTeacher) => {
        setProcessingId(teacher.uid);
        try {
            // API call would go here: await api.post('/admin/approve-teacher', { uid: teacher.uid, action: 'approve' });
            await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay

            // Remove from list
            setTeachers(prev => prev.filter(t => t.uid !== teacher.uid));
            // Show success toast (placeholder)
            console.log(`Approved ${teacher.email}`);
        } catch (error) {
            console.error('Error approving teacher:', error);
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
            // API call: await api.post('/admin/approve-teacher', { uid: selectedTeacher.uid, action: 'reject' });
            await new Promise(resolve => setTimeout(resolve, 600));

            setTeachers(prev => prev.filter(t => t.uid !== selectedTeacher.uid));
            console.log(`Rejected ${selectedTeacher.email}`);
        } catch (error) {
            console.error('Error rejecting teacher:', error);
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
        </div>
    );
}
