import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Star } from 'lucide-react';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding/Art - Different variant for Register */}
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First name" type="text" placeholder="Pierre" required />
                            <Input label="Last name" type="text" placeholder="Dupont" required />
                        </div>

                        <Input label="Email address" type="email" placeholder="you@example.com" required />
                        <Input label="Password" type="password" placeholder="Min. 8 characters" required />

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
    );
};

export default Register;
