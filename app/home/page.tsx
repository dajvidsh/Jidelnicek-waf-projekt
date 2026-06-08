import { Button } from "@/components/ui/button"
import Link from "next/link";
import { RecipeCard } from "@/app/components/RecipeCard";
import ReloadButton from "./ReloadButton";

interface Recipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
}

export default async function Home() {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const res = await fetch(
        `https://api.spoonacular.com/recipes/random?number=4&apiKey=${apiKey}`,
        { cache: 'no-store' }
    );

    const data = await res.json();
    const recipes: Recipe[] = data.recipes || [];

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
                <ReloadButton />
            </div>

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

        </div>
    );
}