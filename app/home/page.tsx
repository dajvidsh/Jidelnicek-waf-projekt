"use client";

import {Button} from "@/components/ui/button"
import Link from "next/link";
import {useAuth} from "@/app/context/AuthContext";
import {useRandomRecipes} from "@/hooks/useRandomRecipes";

function Home() {

    const {user} = useAuth();
    const {recipes, loading, fetchRandomRecipes} = useRandomRecipes();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 mt-8">

            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                What will you cook today?
            </h1>

            <div className="flex gap-1">
                <Link href='/fridge' className="flex-1">
                    <Button variant="default" size="xl" className="w-full">Fridge</Button>
                </Link>
                <Link href='/recipes' className="flex-1">
                    <Button variant="outline" size="xl" className="w-full">Recipes</Button>
                </Link>
            </div>

            <br/>

            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-primary">
                    Inspiration for you
                </h2>
                <Button
                    variant="link"
                    className="font-medium px-0 hover:no-underline"
                    onClick={fetchRandomRecipes}
                >
                    reload
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-slate-500 font-medium">Hledám něco dobrého...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                        <Link
                            href={`/recipes/${recipe.id}`}
                            key={recipe.id}
                            className="group cursor-pointer border border-slate-100 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
                        >
                            <div className="aspect-4/3 w-full overflow-hidden relative">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div
                                    className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5">
                                    <span className="text-sm">⏱</span> {recipe.readyInMinutes} min
                                </div>
                            </div>

                            <div className="p-4 flex flex-col grow items-start">
                                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1.5">
                                    Recipe
                                </span>
                                <h3 className="text-primary font-bold text-sm leading-tight line-clamp-2 text-left">
                                    {recipe.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;