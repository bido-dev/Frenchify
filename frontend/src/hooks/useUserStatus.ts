import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Custom hook to listen for real-time updates to current user's data
 * Returns the user document data and updates automatically when it changes
 */
export function useUserStatus(uid: string | undefined) {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) {
            setLoading(false);
            return;
        }

        // Listen to user document for real-time updates
        const unsubscribe = onSnapshot(
            doc(db, 'users', uid),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setStatus(data.status || null);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error listening to user status:', error);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, [uid]);

    return { status, loading };
}
