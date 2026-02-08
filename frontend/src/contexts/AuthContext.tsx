import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getCurrentUser } from '../api/auth.api';
import type { UserData } from '../api/auth.api';

interface AuthContextType {
    user: UserData | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        if (firebaseUser) {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error refreshing user:', error);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Auth state changed:', firebaseUser?.email);
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                // Wait for token to be ready by actually getting it
                // This ensures Firebase Auth is fully initialized
                try {
                    await firebaseUser.getIdToken();
                    console.log('Token ready, fetching user data from backend...');

                    // Retry logic for race conditions
                    let retries = 3;
                    let userData = null;

                    while (retries > 0 && !userData) {
                        try {
                            userData = await getCurrentUser();
                            console.log('User data received:', userData);
                        } catch (error) {
                            retries--;
                            if (retries > 0) {
                                console.log(`Retrying... (${retries} attempts left)`);
                                await new Promise(resolve => setTimeout(resolve, 200));
                            }
                        }
                    }

                    setUser(userData);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
