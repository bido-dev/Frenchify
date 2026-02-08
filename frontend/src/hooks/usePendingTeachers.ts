import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { PendingTeacher } from '../types/admin';

/**
 * Custom hook for real-time pending teachers updates
 * Listens to Firestore for teachers with status "pending"
 * Automatically updates when teachers reapply or new teachers register
 */
export function usePendingTeachers() {
    const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);

        // Create Firestore query for pending teachers
        const q = query(
            collection(db, 'users'),
            where('role', '==', 'teacher'),
            where('status', '==', 'pending'),
            orderBy('createdAt', 'desc')
        );

        // Set up real-time listener
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const pendingTeachers: PendingTeacher[] = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    email: doc.data().email,
                    name: doc.data().name,
                    createdAt: doc.data().createdAt,
                    status: 'pending' as const
                }));

                setTeachers(pendingTeachers);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error in pending teachers listener:', err);
                setError(err as Error);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    return { teachers, loading, error };
}
