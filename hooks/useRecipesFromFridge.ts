import {useState, useEffect} from "react";
import {db} from "@/lib/firebase";
import {collection, getDocs, query, where} from "firebase/firestore";
import {useAuth} from "@/app/context/AuthContext";

export interface Recipe {
    id: number;
    title: string;
    img: string;
}

interface SpoonacularRecipe {
    id: number;
    title: string;
    image: string;
}

export const useRecipesFromFridge = () => {
    const {user} = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIngredientsAndRecipes = async () => {
            if (!user) {
                setRecipes([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const fridgeQuery = query(
                    collection(db, "fridge"),
                    where("userId", "==", user.uid)
                );

                const querySnapshot = await getDocs(fridgeQuery);
                const ingredientsList = querySnapshot.docs.map(doc => doc.data().name);

                if (ingredientsList.length === 0) {
                    setRecipes([]);
                    return;
                }

                const ingredientsString = ingredientsList.join(",");
                const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

                const response = await fetch(
                    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=12&ranking=2&apiKey=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error("Nepodařilo se načíst recepty ze Spoonacular API.");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const formattedRecipes = data.map((r: SpoonacularRecipe) => ({
                        id: r.id,
                        title: r.title,
                        img: r.image
                    }));
                    setRecipes(formattedRecipes);
                }
            } catch (err: any) {
                console.error("Chyba při načítání:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIngredientsAndRecipes();
    }, [user]);

    return {recipes, loading, error};
};