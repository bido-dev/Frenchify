import api from './index';
import { auth } from '../config/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

export interface SignupData {
    email: string;
    password: string;
    role: 'student' | 'teacher';
    name?: string;
}

export interface UserData {
    uid: string;
    email: string;
    name?: string;
    role: 'student' | 'teacher' | 'admin';
    tier: 'free' | 'paid';
    status: 'active' | 'pending' | 'rejected';
    createdAt: string;
}

/**
 * Register a new user with Firebase Auth and sync to backend
 */
export const signup = async (data: SignupData): Promise<UserData> => {
    // 1. Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    // 2. Sync user to Firestore via backend
    const response = await api.post('/users/sync', {
        uid: userCredential.user.uid,
        email: data.email,
        role: data.role,
        name: data.name,
    });

    return response.data;
};

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<UserData> => {
    // 1. Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // 2. Wait for the token to be ready by getting it directly from the credential
    // This avoids the race condition where auth.currentUser is not yet set
    const token = await userCredential.user.getIdToken();

    // 3. Get user data from backend with explicit token
    const response = await api.get('/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

/**
 * Login with Google (Students only)
 */
export const loginWithGoogle = async (): Promise<UserData> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Get token directly from the credential to avoid race condition
    const token = await userCredential.user.getIdToken();

    // Sync to backend (will default to student role)
    const response = await api.post('/users/sync', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: 'student',
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
    localStorage.clear(); // Clear any cached data
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<UserData | null> => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        return null;
    }
};
