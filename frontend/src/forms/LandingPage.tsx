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
            <div className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
                    <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-red-500 opacity-10 blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-blue-100 text-blue-700 text-sm font-semibold shadow-sm mb-8 backdrop-blur-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                                </span>
                                <span>Nouveau: Advanced Conversation Module</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                                Master French with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-red-500 animate-shimmer bg-[length:200%_100%]">
                                    Structure & Elegance
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                                Stop guessing. Join thousands of students using our structured curriculum for Grammar, Conversation, and Culture.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/register">
                                    <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-1 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-none">
                                        Start Learning Free
                                    </Button>
                                </Link>
                                <Link to="/dashboard">
                                    <Button variant="ghost" size="lg" className="h-14 px-8 rounded-full text-lg hover:bg-white/50 border border-gray-200 backdrop-blur-sm">
                                        Explore Curriculum
                                    </Button>
                                </Link>
                            </div>

                            {/* Social Proof */}
                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                                            <div className={`w-full h-full bg-gradient-to-tr ${['from-blue-200 to-blue-400', 'from-red-200 to-red-400', 'from-indigo-200 to-indigo-400', 'from-emerald-200 to-emerald-400'][i - 1]}`} />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                        +2k
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <div className="flex text-amber-500 mb-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="font-medium text-gray-700">Loved by 2,000+ students</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Content - Floating Elements */}
                        <div className="flex-1 relative hidden lg:block h-[600px] w-full perspective-1000">
                            {/* Abstract French Composition */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-[500px] h-[500px]">
                                    {/* Main Glass Card */}
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/50 shadow-2xl transform rotate-3 z-10 animate-float"></div>

                                    {/* Decorative Blobs */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
                                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

                                    {/* Floating Icons */}
                                    <div className="absolute top-10 left-10 p-4 bg-white rounded-2xl shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                                        <BookOpen className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="absolute bottom-20 right-10 p-4 bg-white rounded-2xl shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                                        <MessageCircle className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <div className="absolute top-1/2 -right-8 p-4 bg-white rounded-2xl shadow-lg animate-float" style={{ animationDelay: '2.5s' }}>
                                        <div className="text-2xl">🇫🇷</div>
                                    </div>

                                    {/* Central Content Preview */}
                                    <div className="absolute inset-4 z-20 rounded-[32px] overflow-hidden bg-white shadow-inner flex flex-col">
                                        <div className="bg-gray-50 p-4 border-b flex items-center gap-3">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="h-2 w-32 bg-gray-200 rounded-full mx-auto"></div>
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col gap-4">
                                            <div className="h-8 w-3/4 bg-gray-100 rounded-lg"></div>
                                            <div className="h-4 w-full bg-gray-50 rounded"></div>
                                            <div className="h-4 w-full bg-gray-50 rounded"></div>
                                            <div className="h-4 w-5/6 bg-gray-50 rounded"></div>

                                            <div className="mt-auto flex gap-3">
                                                <div className="h-24 flex-1 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center justify-center gap-2 overflow-hidden relative group">
                                                    <img src="/paris_landmark_thumb_1770224667640.png" alt="Paris Landmark" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                                <div className="h-24 flex-1 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col items-center justify-center gap-2 overflow-hidden relative group">
                                                    <img src="/provence_landscape_thumb_1770224683868.png" alt="Provence Landscape" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Features Grid */}
            <div className="py-24 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Frenchify Works</h2>
                        <p className="text-lg text-gray-600">Designed by linguists to take you from beginner to fluent through a structured, scientifically-proven approach.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 relative z-10 shadow-sm group-hover:rotate-6 transition-transform">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Structured Grammar</h3>
                            <p className="text-gray-600 leading-relaxed relative z-10">
                                Forget random apps. Our curriculum follows a logical progression from A1 to C1, ensuring you build a solid foundation.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 relative z-10 shadow-sm group-hover:rotate-6 transition-transform">
                                <MessageCircle size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Real Conversation</h3>
                            <p className="text-gray-600 leading-relaxed relative z-10">
                                Practice with native-level audio materials and role-play scenarios designed to get you speaking from day one.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 relative z-10 shadow-sm group-hover:rotate-6 transition-transform">
                                <Award size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Certified Progress</h3>
                            <p className="text-gray-600 leading-relaxed relative z-10">
                                Track your journey with detailed analytics and earn certificates as you master each proficiency level.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Teaser / Value Prop */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-900 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px] opacity-20 translate-y-1/3 -translate-x-1/3"></div>

                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Simple, Honest Pricing</h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-md">
                                We believe education should be accessible. Start for free, upgrade when you're ready for mastery.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {['Access to all Basic Grammar', 'Community Forum Access', 'Weekly Newsletter'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Button variant="primary" size="lg" className="rounded-full px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 border-none hover:-translate-y-0.5 transition-all">
                                Get Started for Free
                            </Button>
                        </div>

                        <div className="relative">
                            {/* Pro Card */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-40 transform translate-y-4"></div>
                            <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative shadow-2xl">
                                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>

                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-lg font-medium text-blue-200">Pro Plan</span>
                                </div>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-bold text-white">$12</span>
                                    <span className="text-gray-400">/mo</span>
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
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </div>
                                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg">
                                    Upgrade to Pro
                                </Button>
                            </div>
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

export default LandingPage;
