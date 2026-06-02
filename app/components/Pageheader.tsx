"use client";

import {useRouter} from 'next/navigation';
import {ChevronLeft, LogOut} from "lucide-react";

interface PageHeaderProps {
    title: string;
    onLogout?: () => void;
}

function PageHeader({title, onLogout}: PageHeaderProps) {
    const router = useRouter();

    return (
        <div className="-mt-8 mb-6">
            <div 
                className="flex items-center justify-between h-14 cursor-pointer group"
                onClick={() => router.back()}
            >
                <div className="flex items-center gap-4 text-left">
                    <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                        <ChevronLeft className="h-6 w-6"/>
                    </div>

                    <h1 className="text-lg font-medium uppercase text-primary tracking-widest group-hover:opacity-80 transition-opacity">
                        {title}
                    </h1>
                </div>

                {onLogout && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLogout();
                        }}
                        className="text-primary hover:text-red-500 transition-colors p-1"
                        title="Logout"
                    >
                        <LogOut className="h-6 w-6"/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageHeader;