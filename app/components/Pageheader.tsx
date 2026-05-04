"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, LogOut } from "lucide-react";

interface PageHeaderProps {
    title: string;
    onLogout?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title,onLogout }) => {
    const router = useRouter();

    return (
        <div className="-mt-8 mb-6">
            <div className="flex items-center justify-between h-14">

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <h1 className="text-sm font-medium uppercase tracking-widest text-gray-900">
                        {title}
                    </h1>
                </div>

                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="text-[#4A4870] hover:text-red-500 transition-colors p-1"
                        title="Logout"
                    >
                        <LogOut className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageHeader;