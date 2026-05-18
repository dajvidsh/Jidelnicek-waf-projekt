import {useState, useEffect, useCallback} from 'react';
import {useAuth} from "@/app/context/AuthContext";

export interface RandomRecipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
}

export const useRandomRecipes = () => {
    const {user} = useAuth();

    const [recipes, setRecipes] = useState<RandomRecipe[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRandomRecipes = useCallback(async (forceReload = false) => {
        try {
            setLoading(true);

            if (!forceReload) {
                const cachedRandom = sessionStorage.getItem('cachedRandomRecipes');
                if (cachedRandom) {
                    setRecipes(JSON.parse(cachedRandom));
                    setLoading(false);
                    return;
                }
            }

            const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

            const res = await fetch(
                `https://api.spoonacular.com/recipes/random?number=4&apiKey=${apiKey}`
            );
            const data = await res.json();

            if (data && data.recipes) {
                setRecipes(data.recipes);
                sessionStorage.setItem('cachedRandomRecipes', JSON.stringify(data.recipes));
            }
        } catch (error) {
            console.error("Chyba pri stahovani receptu:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        fetchRandomRecipes();
    }, [user, fetchRandomRecipes]);

    const handleReload = () => fetchRandomRecipes(true);

    return {recipes, loading, fetchRandomRecipes: handleReload};
};