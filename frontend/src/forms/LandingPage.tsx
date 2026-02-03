import React from 'react'; // Ensure React is imported for JSX
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { BookOpen, MessageCircle, Award, Star, Check } from 'lucide-react';

export const LandingPage: React.FC = () => {
    return (
        <div className="font-sans text-gray-900 bg-white">
            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                        F
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">Frenchify</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Log in
                    </Link>
                    <Link to="/register">
                        <Button variant="primary" size="md" className="rounded-full px-6">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-red-50 rounded-full blur-3xl -z-10 opacity-40 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New: Advanced Conversation Module
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
                        Master French with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
                            Structure & Clarity
                        </span>
                    </h1>

                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
                        Stop guessing your way through language learning. Join thousands of students using our structured curriculum for Grammar, Conversation, and Culture.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                                Start Learning for Free
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button variant="ghost" size="lg" className="h-14 px-8 rounded-full text-lg hover:bg-gray-100">
                                Explore Curriculum
                            </Button>
                        </Link>
                    </div>

                    {/* Trust/Social Proof */}
                    <div className="mt-16 flex flex-col items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600">
                                +2k
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                            <div className="flex text-amber-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span className="ml-2">Loved by 2,000+ students</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Structured Grammar</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Forget random apps. Our curriculum follows a logical progression from A1 to C1, ensuring you build a solid foundation.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                                <MessageCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Real Conversation</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Practice with native-level audio materials and role-play scenarios designed to get you speaking from day one.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Progress</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track your journey with detailed analytics and earn certificates as you master each proficiency level.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Teaser / Value Prop */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Honest Pricing</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                We believe education should be accessible. Start for free, upgrade when you're ready for mastery.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Access to all Basic Grammar', 'Community Forum Access', 'Weekly Newsletter'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Button variant="primary" size="lg" className="rounded-full">Get Started for Free</Button>
                        </div>
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                            <div className="flex justify-between items-baseline mb-4">
                                <span className="text-xl font-medium text-gray-300">Pro Plan</span>
                                <span className="text-3xl font-bold text-white">$12<span className="text-sm text-gray-500 font-normal">/mo</span></span>
                            </div>
                            <div className="space-y-4 mb-8">
                                {[
                                    'Everything in Free',
                                    'Unlimited Advanced Courses',
                                    'Offline Downloads',
                                    'Direct Teacher Q&A',
                                    'Priority Support'
                                ].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </div>
                            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 border-transparent">
                                Upgrade to Pro
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                            F
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900">Frenchify</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        © 2026 Frenchify Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};
