"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecipeFilters as FilterState } from "@/hooks/useRecipesFromFridge";
import { useAutocomplete } from "@/hooks/useAutocomplete";

interface Props {
    filters: FilterState;
    setFilters: (f: FilterState) => void;
}

function ExcludedAutocomplete({ filters, setFilters }: Props) {
    const { itemName, setItemName, suggestions, setSuggestions, clear } = useAutocomplete();

    const handleAdd = (name: string) => {
        const current = filters.excludeIngredients || [];
        if (!current.includes(name)) {
            setFilters({ ...filters, excludeIngredients: [...current, name] });
        }
        clear();
    };

    const handleRemove = (name: string) => {
        const current = filters.excludeIngredients || [];
        setFilters({ ...filters, excludeIngredients: current.filter(x => x !== name) });
    };

    return (
        <div className="flex-1 min-w-[200px]">
            <h3 className="font-semibold text-sm mb-2 text-slate-700">Exclude Ingredients</h3>
            <div className="relative mb-2">
                <input
                    type="text"
                    placeholder="Search to exclude..."
                    value={itemName}
                    onChange={(e) => {
                        setItemName(e.target.value);
                        if (e.target.value.trim().length <= 2) {
                            setSuggestions([]);
                        }
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {suggestions.length > 0 && (
                    <div className="absolute z-50 w-full top-10 bg-white border rounded-md shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {suggestions.map((s, index) => (
                            <div
                                key={`${s.id}-${index}`}
                                className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm capitalize flex justify-between items-center"
                                onClick={() => handleAdd(s.name)}
                            >
                                <span>{s.name}</span>
                                <img src={`https://spoonacular.com/cdn/ingredients_100x100/${s.image}`} className="w-6 h-6 object-contain bg-slate-50 rounded" alt={s.name} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-1">
                {(filters.excludeIngredients || []).map(i => (
                    <span key={i} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1 capitalize">
                        {i}
                        <button onClick={() => handleRemove(i)} className="hover:text-red-900 leading-none">✕</button>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function RecipeFilters({ filters, setFilters }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const diets = ["Vegetarian", "Vegan", "Gluten Free", "Ketogenic"];
    const types = ["Main Course", "Breakfast", "Dessert", "Snack"];
    const sortOptions = [
        { id: "min-missing-ingredients", label: "Min missing ingredients" },
        { id: "max-used-ingredients", label: "Max used ingredients" },
        { id: "popularity", label: "Most popular" },
        { id: "time", label: "Fastest" }
    ];

    const handleDietChange = (d: string) => {
        setFilters({ ...filters, diet: filters.diet === d ? undefined : d });
    };

    const handleTypeChange = (t: string) => {
        setFilters({ ...filters, type: filters.type === t ? undefined : t });
    };

    const handleSortChange = (s: string) => {
        setFilters({ ...filters, sort: filters.sort === s ? undefined : s });
    };

    const filterSectionsContent = (
        <>
            <div className="flex-1 min-w-[140px]">
                <h3 className="font-semibold text-sm mb-2 text-slate-700">Diet</h3>
                <div className="flex flex-wrap gap-2">
                    {diets.map(d => (
                        <button
                            key={d}
                            onClick={() => handleDietChange(d)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${filters.diet === d ? 'bg-primary text-primary-foreground border-primary' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-w-[160px]">
                <h3 className="font-semibold text-sm mb-2 text-slate-700 flex justify-between">
                    <span>Max Ready Time</span>
                    <span className="text-primary">{filters.maxReadyTime || 180} min</span>
                </h3>
                <input 
                    type="range" 
                    min="10" 
                    max="180" 
                    step="5" 
                    value={filters.maxReadyTime || 180}
                    onChange={(e) => setFilters({ ...filters, maxReadyTime: parseInt(e.target.value) })}
                    className="w-full mt-2 accent-primary"
                />
            </div>

            <div className="flex-1 min-w-[140px]">
                <h3 className="font-semibold text-sm mb-2 text-slate-700">Meal Type</h3>
                <div className="flex flex-wrap gap-2">
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => handleTypeChange(t)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${filters.type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <ExcludedAutocomplete filters={filters} setFilters={setFilters} />

            <div className="flex-1 min-w-[180px]">
                <h3 className="font-semibold text-sm mb-2 text-slate-700">Sorting</h3>
                <div className="flex flex-col gap-2">
                    {sortOptions.map(s => (
                        <button
                            key={s.id}
                            onClick={() => handleSortChange(s.id)}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-colors text-left ${
                                (filters.sort === s.id) || (!filters.sort && s.id === "min-missing-ingredients")
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <div className="mb-6">
            <div className="md:hidden mb-4">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(true)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    Filters
                </Button>
                
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={(e) => { if(e.target === e.currentTarget) setIsOpen(false) }}>
                        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            <div className="flex flex-col gap-6">
                                {filterSectionsContent}
                            </div>
                            <div className="mt-6 pt-4 border-t">
                                <Button className="w-full" onClick={() => setIsOpen(false)}>Show recipes</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden md:flex flex-row flex-wrap gap-6 p-4 bg-white rounded-xl shadow-sm border items-start">
                {filterSectionsContent}
            </div>
        </div>
    );
}
