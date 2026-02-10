import api from './index';
import { auth } from '../config/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification
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

    // 2. Send email verification
    await sendEmailVerification(userCredential.user);

    // 3. Sync user to Firestore via backend
    const response = await api.post('/users/sync', {
        uid: userCredential.user.uid,
        email: data.email,
        role: data.role,
        name: data.name,
    });

    // 4. Sign out immediately — user must verify email before logging in
    await firebaseSignOut(auth);

    return response.data;
};

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<UserData> => {
    // 1. Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // 2. Block unverified users
    if (!userCredential.user.emailVerified) {
        // Re-send verification email so the user gets a fresh link
        await sendEmailVerification(userCredential.user);
        // Sign out immediately
        await firebaseSignOut(auth);
        throw new Error(
            'Your email address has not been verified. A new verification link has been sent to your inbox.'
        );
    }

    // 3. Wait for the token to be ready by getting it directly from the credential
    // This avoids the race condition where auth.currentUser is not yet set
    const token = await userCredential.user.getIdToken();

    // 4. Get user data from backend with explicit token
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
 * Resend email verification link
 * Temporarily signs in to get the User object, sends verification, then signs out.
 */
export const resendVerificationEmail = async (
    email: string,
    password: string
): Promise<void> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await firebaseSignOut(auth);
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
