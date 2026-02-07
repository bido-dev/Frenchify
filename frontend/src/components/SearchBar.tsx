import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
    className?: string;
}

export default function SearchBar({
    onSearch,
    placeholder = "Search...",
    initialValue = "",
    className = ""
}: SearchBarProps) {
    const [value, setValue] = useState(initialValue);
    const debouncedSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (debouncedSearchRef.current) {
            clearTimeout(debouncedSearchRef.current);
        }

        debouncedSearchRef.current = setTimeout(() => {
            onSearch(newValue);
        }, 300);
    };

    const handleClear = () => {
        setValue("");
        onSearch("");
        if (debouncedSearchRef.current) {
            clearTimeout(debouncedSearchRef.current);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
