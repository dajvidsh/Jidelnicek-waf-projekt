"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import Link from "next/link";
import PageHeader from "@/app/components/Pageheader";
import {Button} from "@/components/ui/button";

// Firebase importy
import {db} from "@/lib/firebase";
import {collection, getDocs} from "firebase/firestore";
import {useAuth} from "@/app/context/AuthContext";

export default function Page() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchIngredientsAndRecipes = async () => {
            try {
                setLoading(true);

                // 1. Načtení surovin z Firebase (kolekce 'fridge')
                const querySnapshot = await getDocs(collection(db, "fridge"));
                const ingredientsList = querySnapshot.docs.map(doc => doc.data().name);

                if (ingredientsList.length === 0) {
                    setRecipes([]);
                    return;
                }

                // 2. Volání Spoonacular API s klíčem z .env.local
                const ingredientsString = ingredientsList.join(",");
                const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

                const response = await fetch(
                    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=12&ranking=2&apiKey=${apiKey}`
                );

                const data = await response.json();

                // 3. Formátování výsledků
                if (Array.isArray(data)) {
                    const formattedRecipes = data.map((r: any) => ({
                        id: r.id,
                        title: r.title,
                        img: r.image
                    }));
                    setRecipes(formattedRecipes);
                }
            } catch (error) {
                console.error("Chyba při načítání:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIngredientsAndRecipes();
    }, []);

    if (!user) return null;

    return (
        <div>
            <PageHeader title={"Recipes"}/>
            <div className="max-w-7xl mx-auto">
                {/* Nadpis a horní navigace - Zůstávají zachovány */}

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

                {/* Zobrazení receptů nebo Loading stavu */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#636191] mb-4"></div>
                        <p className="text-slate-500 font-medium">Hledám recepty podle vaší lednice...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <Link
                                    href={`/recipes/${recipe.id}`}
                                    key={recipe.id}
                                    className="group cursor-pointer border border-slate-100 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all bg-white"
                                >
                                    <div className="aspect-4/3 w-full overflow-hidden">
                                        <img
                                            src={recipe.img}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span
                                                className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recipes</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-bold text-slate-700">5.0</span>
                                                <span className="text-yellow-400 text-xs">★</span>
                                            </div>
                                        </div>
                                        <h3 className="text-[#4A4870] font-bold text-sm md:text-base leading-tight">
                                            {recipe.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div
                                className="col-span-full text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-500">V lednici nemáte žádné suroviny pro vyhledání receptů.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}