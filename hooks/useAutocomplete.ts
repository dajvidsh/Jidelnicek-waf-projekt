import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export interface Suggestion {
    id: number;
    name: string;
    image: string;
}

export const useAutocomplete = () => {
    const [itemName, setItemName] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    useEffect(() => {
        const queryText = itemName.trim().toLowerCase();

        if (queryText.length <= 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            const cacheKey = `autocomplete_${queryText}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                setSuggestions(JSON.parse(cachedData));
                return;
            }

            try {
                const res = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${queryText}&number=5&apiKey=${API_KEY}`);

                if (!res.ok) throw new Error("Chyba při načítání autocomplete");

                const data = await res.json();

                if (Array.isArray(data)) {
                    setSuggestions(data);
                    sessionStorage.setItem(cacheKey, JSON.stringify(data));
                }
            } catch (e) {
                console.error("Spoonacular error:", e);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [itemName]);

    const clear = () => {
        setItemName("");
        setSuggestions([]);
    };

    return { itemName, setItemName, suggestions, setSuggestions, clear };
};
