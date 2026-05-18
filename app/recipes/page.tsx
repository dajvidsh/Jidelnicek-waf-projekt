"use client";

import * as React from "react";
import Link from "next/link";
import PageHeader from "@/app/components/Pageheader";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/app/context/AuthContext";
import {useRecipesFromFridge} from "@/hooks/useRecipesFromFridge";
import {RecipeCard} from "@/app/components/RecipeCard";


export default function Page() {
    const {user} = useAuth();

    const {recipes, loading, error} = useRecipesFromFridge();

    if (!user) return null;

    return (
        <div>
            <PageHeader title={"Recipes"}/>
            <div className="max-w-7xl mx-auto">

                <div className="flex justify-center gap-4 mb-10 w-full max-w-4xl mx-auto">
                    <Link href="/fridge" className="flex-1">
                        <Button
                            variant="default"
                            size="xl"
                            className="w-full flex justify-between items-center px-8 transition-colors"
                        >
                            In fridge
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Button>
                    </Link>
                    <Link href="/shoppingList" className="flex-1">
                        <Button
                            variant="outline"
                            size="xl"
                            className="w-full flex justify-between items-center px-8 transition-colors"
                        >
                            Shopping list
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-slate-500 font-medium">Hledám recepty podle vaší lednice...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-red-50/50 rounded-3xl border border-dashed border-red-200 max-w-xl mx-auto">
                        <p className="text-red-500 font-semibold mb-1">Nepodařilo se načíst recepty</p>
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                id={recipe.id}
                                title={recipe.title}
                                image={recipe.img}
                                readyInMinutes={45}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}