import {useFridge} from "@/hooks/useFridge";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";

export const useRecipesFromFridge = () => {
    const { foods } = useFridge();
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

    const ingredientsString = foods.map(item => item.name).sort().join(",");

    const url = ingredientsString
        ? `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=12&ranking=2&apiKey=${apiKey}`
        : null;

    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false
    });

    return {
        recipes: data ? data.map((r: any) => ({ id: r.id, title: r.title, img: r.image })) : [],
        loading: isLoading,
        error: error ? "Nepodařilo se načíst recepty ze Spoonacular API." : null
    };
};