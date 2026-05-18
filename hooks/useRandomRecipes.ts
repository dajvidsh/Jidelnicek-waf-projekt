import { useState, useEffect } from 'react';
import { useAuth } from "@/app/context/AuthContext";

export interface RandomRecipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
}

export const useRandomRecipes = () => {
    const { user } = useAuth();

    const [recipes, setRecipes] = useState<RandomRecipe[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRandomRecipes = async () => {
        try {
            setLoading(true);
            const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

            const res = await fetch(
                `https://api.spoonacular.com/recipes/random?number=4&apiKey=${apiKey}`
            );
            const data = await res.json();

            if (data && data.recipes) {
                setRecipes(data.recipes);
            }
        } catch (error) {
            console.error("Chyba pri stahovani receptu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchRandomRecipes().catch(console.error);
    }, [user]);

    return { recipes, loading, fetchRandomRecipes };
};