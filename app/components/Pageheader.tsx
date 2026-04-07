"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    const router = useRouter();

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-14 gap-4">

                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-400"
                    >
                        {'<-'}
                    </button>

                    <h1 className="text-sm font-medium uppercase tracking-widest text-gray-900">
                        {title}
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;