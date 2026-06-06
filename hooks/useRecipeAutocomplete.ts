import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export interface RecipeSuggestion {
    id: number;
    title: string;
    image: string;
}

export const useRecipeAutocomplete = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);

    useEffect(() => {
        const queryText = query.trim().toLowerCase();

        if (queryText.length <= 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            const cacheKey = `recipe_autocomplete_${queryText}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                setSuggestions(JSON.parse(cachedData));
                return;
            }

            try {
                // Using complexSearch to get the full image URL
                const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${queryText}&number=5&apiKey=${API_KEY}`);

                if (!res.ok) throw new Error("Chyba při načítání autocomplete receptů");

                const data = await res.json();

                if (data && Array.isArray(data.results)) {
                    setSuggestions(data.results);
                    sessionStorage.setItem(cacheKey, JSON.stringify(data.results));
                }
            } catch (e) {
                console.error("Spoonacular error:", e);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const clear = () => {
        setQuery("");
        setSuggestions([]);
    };

    return { query, setQuery, suggestions, setSuggestions, clear };
};
