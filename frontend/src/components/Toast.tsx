import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            textColor: 'text-green-800',
            iconColor: 'text-green-500'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            textColor: 'text-red-800',
            iconColor: 'text-red-500'
        },
        info: {
            icon: AlertCircle,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500'
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 ${bgColor} ${borderColor} shadow-lg animate-slide-in max-w-md`}>
            <Icon className={iconColor} size={20} />
            <p className={`text-sm font-medium ${textColor} flex-1`}>{message}</p>
            <button
                onClick={onClose}
                className={`${textColor} hover:opacity-70 transition-opacity`}
                aria-label="Close"
            >
                <X size={16} />
            </button>
        </div>
    );
}
