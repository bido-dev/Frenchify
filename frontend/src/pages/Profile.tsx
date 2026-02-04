import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { User, CreditCard, Shield, LogOut, Trash2 } from 'lucide-react';

export const Profile: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    // Mock User Data
    const [user, setUser] = useState({
        name: 'Student User',
        email: 'student@example.com',
        tier: 'free' as 'free' | 'paid'
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Profile updated!');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-gray-400">
                    <User size={48} />
                </div>
                <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <Badge variant={user.tier === 'paid' ? 'pro' : 'free'} />
                    </div>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                <div>
                    <Button variant="ghost" className="text-gray-600 border border-gray-300">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="md:col-span-2 space-y-8">
                    {/* Personal Info */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Personal Information
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" isLoading={isLoading}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </section>

                    {/* Security Placeholder */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Security
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-900">Password</p>
                                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                                </div>
                                <Button variant="ghost" size="sm" className="bg-white border border-gray-300">Change</Button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar / Subscription */}
                <div className="space-y-8">
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            Subscription
                        </h2>

                        <div className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-100">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-blue-900">Current Plan</span>
                                <Badge variant={user.tier === 'paid' ? 'pro' : 'free'} />
                            </div>
                            <p className="text-sm text-blue-700">
                                {user.tier === 'free'
                                    ? 'You are on the Free tier. Upgrade to unlock all content.'
                                    : 'You have full access to all Frenchify courses.'}
                            </p>
                        </div>

                        {user.tier === 'free' && (
                            <Button variant="primary" className="w-full bg-amber-500 hover:bg-amber-600 border-transparent mb-4">
                                Upgrade to Pro
                            </Button>
                        )}

                        <Button variant="ghost" size="sm" className="w-full text-gray-500">
                            Manage Billing
                        </Button>
                    </section>

                    <section className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
                        <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                            Danger Zone
                        </h2>
                        <p className="text-sm text-red-600 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive" size="sm" className="w-full justify-center">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
