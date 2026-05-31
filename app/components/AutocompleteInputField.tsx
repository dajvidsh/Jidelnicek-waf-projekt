"use client"

import InputField from "@/app/components/InputField";
import { useAutocomplete } from "@/hooks/useAutocomplete";

interface AutocompleteInputFieldProps {
    label: string;
    onAdd: (name: string, amount: number) => void;
}

export default function AutocompleteInputField({ label, onAdd }: AutocompleteInputFieldProps) {
    const { itemName, setItemName, suggestions, setSuggestions, clear } = useAutocomplete();

    const handleAdd = (name: string, amount: number) => {
        onAdd(name, amount);
        clear();
    };

    return (
        <div className="relative mb-6">
            <InputField
                label={label}
                value={itemName}
                onChange={(val) => {
                    setItemName(val);
                    if (val.trim().length <= 2) {
                        setSuggestions([]);
                    }
                }}
                onAdd={handleAdd}
            />

            {suggestions.length > 0 && (
                <div className="absolute z-50 w-full top-11.25 bg-white border rounded-md shadow-xl overflow-hidden">
                    {suggestions.map((s, index) => (
                        <div
                            key={`${s.id}-${index}`}
                            className="px-4 py-3 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b last:border-0"
                            onClick={() => { setItemName(s.name); setSuggestions([]); }}
                        >
                            <span className="capitalize text-sm font-medium text-slate-700">{s.name}</span>
                            <img src={`https://spoonacular.com/cdn/ingredients_100x100/${s.image}`} className="w-8 h-8 object-contain bg-slate-50 rounded p-1" alt={s.name} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
