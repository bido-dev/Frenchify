import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Star, MailCheck } from 'lucide-react';
import { signup } from '../api/auth.api';

export const Register: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signup({
                email: formData.email,
                password: formData.password,
                role,
                name: formData.name,
            });

            // Show success panel with verification info
            setSuccess(true);

            // If teacher, the success panel already mentions pending approval
            // No need for separate alert
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success panel after registration
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <MailCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
                    <p className="text-gray-600">
                        We've sent a verification link to <span className="font-medium text-gray-900">{formData.email}</span>.
                        Please check your inbox and click the link to activate your account.
                    </p>
                    {role === 'teacher' && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                            As a teacher, your account will also need to be approved by an administrator before you can publish courses.
                        </div>
                    )}
                    <p className="text-sm text-gray-500">
                        Didn't receive the email? Check your spam folder.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding/Art */}
            <div className="hidden lg:flex flex-col justify-between bg-gray-900 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>

                <Link to="/" className="relative z-10 flex items-center gap-2 w-fit">
                    <div className="w-10 h-10 rounded-xl bg-white text-gray-900 flex items-center justify-center font-bold text-2xl">F</div>
                    <span className="font-bold text-xl tracking-tight">Frenchify</span>
                </Link>

                <div className="relative z-10 max-w-md space-y-6">
                    <div className="flex gap-2 text-amber-500">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={20} />)}
                    </div>
                    <h2 className="text-4xl font-bold leading-tight">
                        Start your journey to fluency today.
                    </h2>
                    <ul className="space-y-3 text-lg text-gray-300">
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                            Access to A1-B1 Grammar
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                            Weekly Conversation Practice
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                            No credit card required
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-sm opacity-60">
                    © 2026 Frenchify Inc.
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xl">F</div>
                            <span className="font-bold text-xl text-gray-900">Frenchify</span>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
                        <p className="mt-2 text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Role Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'student'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('teacher')}
                                    className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'teacher'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Teacher
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Full Name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                required
                            />

                            <Input
                                label="Email address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@example.com"
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Min. 8 characters"
                                required
                                minLength={8}
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Re-enter password"
                                required
                            />

                            <div className="flex items-start gap-3">
                                <div className="flex h-5 items-center">
                                    <input id="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                                </div>
                                <label htmlFor="terms" className="text-sm text-gray-500">
                                    I agree to the <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Privacy Policy</a>
                                </label>
                            </div>

                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Create Account
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
