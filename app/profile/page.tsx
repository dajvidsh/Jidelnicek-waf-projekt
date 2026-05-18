"use client";

import {useAuth} from "@/app/context/AuthContext";
import PageHeader from "@/app/components/Pageheader";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import * as React from "react";
import Link from "next/link";
import {useProfile} from "@/hooks/useProfile";

export default function Page() {
    const {user} = useAuth();
    const {userData, fridgeCount, loading, handleLogout} = useProfile();

    if (loading) return <div className="flex justify-center mt-10">Loading profile...</div>;
    if (!user) return null;

    return (
        <div>
            <PageHeader title={"Profile"} onLogout={handleLogout}/>

            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">

                <div className="relative">
                    {userData?.imageUrl ? (
                        <img
                            src={userData.imageUrl}
                            alt="Profile"
                            className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-xl flex items-center justify-center bg-[#4A4870] text-white text-3xl font-bold uppercase tracking-wider ring-1 ring-slate-100">
                            {userData?.name?.[0] || ""}{userData?.surname?.[0] || ""}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h1 className="text-4xl font-bold">
                        {userData?.name} {userData?.surname}
                    </h1>
                    <p className="text-gray-500 text-lg">
                        {userData?.email}
                    </p>
                </div>

                <div className="py-8">
                    <h2 className="text-2xl font-semibold mb-2">
                        Number of items <br/> in fridge
                    </h2>
                    <span className="text-6xl font-bold">
                    {fridgeCount}
                </span>
                </div>

                <Link href="/profile/edit" className="w-full max-w-xs">
                    <Button className="px-10 py-6 rounded-lg text-lg flex items-center gap-2 transition-all w-full">
                        Edit profile <ArrowRight className="h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}