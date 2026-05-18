"use client"

import PageHeader from "@/app/components/Pageheader";
import InputField from "@/app/components/InputField";
import {useAuth} from "@/app/context/AuthContext";
import {useShoppingList} from "@/hooks/useShoppingList";
import {FoodTable} from "@/app/components/FoodTable";


export default function Page() {

    const { user } = useAuth();

    const {
        foods,
        loading,
        itemName,
        setItemName,
        suggestions,
        setSuggestions,
        handleAdd,
        handleDelete,
        handleCheck
    } = useShoppingList();

    if (!user) return null;
    return (
        <div>
            <PageHeader title={"Shopping list"}/>

            <div className="relative mb-6">
                <InputField
                    label="Add to shopping list..."
                    value={itemName}
                    onChange={(val) => {
                        setItemName(val);
                        if (val.trim().length <= 2) {
                            setSuggestions([]);
                        }
                    }}
                    onAdd={(name, amount) => handleAdd(name, amount)}
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

            <FoodTable
                items={foods}
                onDelete={handleDelete}
                onCheck={handleCheck}
                emptyMessage="Shopping list is empty"
            />

        </div>
    )
}