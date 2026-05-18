import {useAuth} from "@/app/context/AuthContext";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";

export interface RandomRecipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
}

export const useRandomRecipes = () => {
    const { user } = useAuth();
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

    let url = null;
    if (user) {
        url = `https://api.spoonacular.com/recipes/random?number=4&apiKey=${apiKey}`;
    }

    // 2. PŘEDÁME PRÁCI SWR
    // SWR zavolá náš "fetcher" na danou URL adresu a samo nám rovnou vrátí 4 věci:
    // - data: to, co API vrátilo
    // - error: případnou chybu (spadl internet, špatný klíč)
    // - isLoading: true/false podle toho, jestli stahování zrovna běží
    // - mutate: funkci, kterou když zavoláme, SWR vše smaže a stáhne data znovu
    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        revalidateOnFocus: false
    });

    return {
        recipes: data ? data.recipes : [],
        loading: isLoading,
        error: error,
        fetchRandomRecipes: () => mutate() // Když stránka zavolá "reload", my zavoláme SWR "mutate"
    };
};