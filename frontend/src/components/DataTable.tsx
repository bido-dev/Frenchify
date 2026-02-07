import React, { type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
}

export default function DataTable<T>({
    columns,
    data,
    loading = false,
    keyExtractor,
    emptyMessage = "No data available"
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow border border-gray-200">
                <LoadingSpinner />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
                <EmptyState
                    icon={Search}
                    title={emptyMessage}
                    description="Try adjusting your search or filters"
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className="hover:bg-gray-50 transition-colors">
                            {columns.map((column) => (
                                <td
                                    key={`${keyExtractor(item)}-${column.key}`}
                                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${column.className || ''}`}
                                >
                                    {column.render ? column.render(item) : (item as any)[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
