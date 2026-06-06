"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useRecipeAutocomplete } from "@/hooks/useRecipeAutocomplete";

export default function RecipeSearchBar() {
    const router = useRouter();
    const { query, setQuery, suggestions, setSuggestions, clear } = useRecipeAutocomplete();

    const handleSelect = (id: number) => {
        clear();
        router.push(`/recipes/${id}`);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto mt-4 px-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.trim().length <= 2) {
                            setSuggestions([]);
                        }
                    }}
                    placeholder="Search for a recipe..."
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm transition-shadow"
                />
            </div>

            {suggestions.length > 0 && (
                <div className="absolute z-50 w-[calc(100%-2rem)] left-4 top-[3.25rem] bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden">
                    {suggestions.map((s, index) => (
                        <div
                            key={`${s.id}-${index}`}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors"
                            onClick={() => handleSelect(s.id)}
                        >
                            <span className="capitalize text-sm font-medium text-slate-700">{s.title}</span>
                            {s.image && (
                                <img src={s.image} className="w-12 h-10 object-cover bg-slate-50 rounded-md shadow-sm ml-4" alt={s.title} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
