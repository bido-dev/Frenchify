import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Shield, UserPlus, CheckCircle } from 'lucide-react';

export default function CreateAdmin() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            // API call: await api.post('/admin/create-admin', { email: formData.email, password: formData.password, name: formData.name });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            setSuccess(true);
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (err) {
            setError('Failed to create admin account. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Create Admin Account</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Grant administrative privileges to a new user.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800">
                    <Shield className="shrink-0" size={24} />
                    <div className="text-sm">
                        <p className="font-medium">Security Notice</p>
                        <p>Admins have full access to user management, subscription overrides, and teacher approvals. Only create accounts for trusted personnel.</p>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg text-green-800 flex items-center gap-3">
                        <CheckCircle className="shrink-0" size={20} />
                        <div>
                            <p className="font-medium">Admin created successfully!</p>
                            <p className="text-sm">The new administrator can now log in.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Full Name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Admin Name"
                        required
                        autoComplete="off"
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@frenchify.com"
                        required
                        autoComplete="off"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Min. 8 characters"
                            required
                            minLength={8}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Re-enter password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    )}

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                        >
                            <UserPlus size={18} className="mr-2" />
                            Create Admin
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
