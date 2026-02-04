import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<'student' | 'teacher'>('student');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth
        setTimeout(() => {
            localStorage.setItem('isAuthenticated', 'true');
            setIsLoading(false);
            if (role === 'teacher') {
                navigate('/teacher/dashboard');
            } else {
                navigate('/dashboard');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding/Art */}
            <div className="hidden lg:flex flex-col justify-between bg-blue-600 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-transparent"></div>

                <Link to="/" className="relative z-10 flex items-center gap-2 w-fit">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl border border-white/30">F</div>
                    <span className="font-bold text-xl tracking-tight">Frenchify</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <blockquote className="text-2xl font-medium leading-relaxed mb-6">
                        "The structured approach to grammar finally made it click for me. I'm now having real conversations."
                    </blockquote>
                    <cite className="not-italic font-medium opacity-80 block">
                        — Sarah J., B2 Student
                    </cite>
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
                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">F</div>
                            <span className="font-bold text-xl text-gray-900">Frenchify</span>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
                        <p className="mt-2 text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Role Selector */}
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

                        {/* Social Auth (Visual Only) */}
                        <button className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <Input label="Email address" type="email" name="email" placeholder="you@example.com" required />
                                <div className="space-y-1">
                                    <Input label="Password" type="password" name="password" placeholder="••••••••" required />
                                    <div className="flex justify-end">
                                        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full flex items-center justify-center gap-2" isLoading={isLoading} size="lg">
                                Sign in <ArrowRight size={18} />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
