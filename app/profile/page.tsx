"use client";

import { useAuth } from "@/app/context/AuthContext";
import PageHeader from "@/app/components/Pageheader";
import { Button } from "@/components/ui/button";
import * as React from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import { useMyRecipes } from "@/hooks/useMyRecipes";
import { ArrowRight, Heart } from "lucide-react";

export default function Page() {
    const { user } = useAuth();
    const { userData, fridgeCount, loading, handleLogout } = useProfile();
    const { savedRecipes } = useMyRecipes(user?.uid);

    if (loading) return <div className="flex justify-center mt-10">Loading profile...</div>;
    if (!user) return null;

    return (
        <div>
            <PageHeader title={"Profile"} onLogout={handleLogout} />

            <div className="flex flex-col items-center text-center max-w-md mx-auto mt-8 space-y-8">

                {/* Avatar */}
                {userData?.imageUrl ? (
                    <img
                        src={userData.imageUrl}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                ) : (
                    <div className="h-32 w-32 rounded-full flex items-center justify-center bg-primary text-white text-3xl font-bold uppercase tracking-wider border-4 border-white shadow-xl">
                        {userData?.name?.[0] || ""}{userData?.surname?.[0] || ""}
                    </div>
                )}

                {/* Name + Email */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">
                        {userData?.name} {userData?.surname}
                    </h1>
                    <p className="text-gray-500">
                        {userData?.email}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex gap-16 py-6 border-y border-slate-100 w-full justify-center">
                    <div>
                        <p className="text-4xl font-bold">{fridgeCount}</p>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mt-1">
                            In fridge
                        </p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold">{savedRecipes.length}</p>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mt-1">
                            Recipes
                        </p>
                    </div>
                </div>
                {/* Action buttons */}
                <div className="w-full space-y-2">
                    <Link href="/recipes" className="w-full block">
                        <Button variant="outline" className="px-10 py-6 rounded-lg text-lg flex items-center gap-2 w-full">
                            <Heart className="h-5 w-5" />
                            Favorite recipes
                        </Button>
                    </Link>
                    <Link href="/profile/edit" className="w-full block">
                        <Button className="px-10 py-6 rounded-lg text-lg flex items-center gap-2 w-full">
                            Edit profile <ArrowRight className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}