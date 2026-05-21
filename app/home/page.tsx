"use client";

import {Button} from "@/components/ui/button"
import Link from "next/link";
import {useAuth} from "@/app/context/AuthContext";
import {useRandomRecipes} from "@/hooks/useRandomRecipes";
import {RecipeCard} from "@/app/components/RecipeCard";

interface Recipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
}

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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {recipes.map((recipe: Recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            image={recipe.image}
                            readyInMinutes={recipe.readyInMinutes}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;