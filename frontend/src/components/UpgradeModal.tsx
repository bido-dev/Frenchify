import React from 'react';
import Modal from './Modal';
import { Button } from './Button';
import { Star, CheckCircle } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Upgrade to Frenchify Premium"
            variant="default"
        >
            <div className="space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-500 mb-4">
                        <Star size={32} fill="currentColor" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Unlock the Full Experience</h4>
                    <p className="text-gray-600">
                        Get unlimited access to all French courses, premium features, and offline downloads.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
                        <span className="text-sm text-gray-700">Access to all <strong>Grammar & Conversation</strong> courses</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
                        <span className="text-sm text-gray-700">Download materials for <strong>Offline Study</strong></span>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
                        <span className="text-sm text-gray-700">Ask questions directly to teachers</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={18} />
                        <span className="text-sm text-gray-700">Exclusive video content and quizzes</span>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md"
                        onClick={() => {
                            // Placeholder for Stripe integration
                            alert("Redirecting to Stripe Checkout...");
                            onClose();
                        }}
                    >
                        Subscribe via Stripe ($9.99/mo)
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        No thanks, I'll stick to the free plan
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
