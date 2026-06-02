import {useFridge} from "@/hooks/useFridge";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";

export interface RecipeFilters {
    diet?: string;
    maxReadyTime?: number;
    type?: string;
    excludeIngredients?: string[];
    sort?: string;
}

export const useRecipesFromFridge = (filters?: RecipeFilters) => {
    const { foods } = useFridge();
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

    const ingredientsString = foods.map(item => item.name).sort().join(",");

    const sortParam = filters?.sort || 'min-missing-ingredients';
    let sortDirection = '';
    if (sortParam === 'time') sortDirection = 'asc';
    if (sortParam === 'popularity') sortDirection = 'desc';

    let url = ingredientsString
        ? `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodeURIComponent(ingredientsString)}&number=12&addRecipeInformation=true&fillIngredients=true&sort=${sortParam}${sortDirection ? `&sortDirection=${sortDirection}` : ''}&apiKey=${apiKey}`
        : null;

    if (url && filters) {
        if (filters.diet) url += `&diet=${encodeURIComponent(filters.diet)}`;
        if (filters.type) url += `&type=${encodeURIComponent(filters.type)}`;
        if (filters.maxReadyTime) url += `&maxReadyTime=${filters.maxReadyTime}`;
        if (filters.excludeIngredients && filters.excludeIngredients.length > 0) {
            url += `&excludeIngredients=${encodeURIComponent(filters.excludeIngredients.join(","))}`;
        }
    }

    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false
    });

    return {
        recipes: data?.results ? data.results.map((r: any) => ({ id: r.id, title: r.title, img: r.image, readyInMinutes: r.readyInMinutes })) : [],
        loading: isLoading,
        error: error ? "Failed to load recipes from Spoonacular API." : null
    };
};