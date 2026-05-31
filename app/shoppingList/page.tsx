"use client"

import PageHeader from "@/app/components/Pageheader";
import AutocompleteInputField from "@/app/components/AutocompleteInputField";
import {useAuth} from "@/app/context/AuthContext";
import {useShoppingList} from "@/hooks/useShoppingList";
import {FoodTable} from "@/app/components/FoodTable";


export default function Page() {

    const { user } = useAuth();

    const {
        foods,
        loading,
        handleAdd,
        handleDelete,
        handleCheck
    } = useShoppingList();

    if (!user) return null;
    return (
        <div>
            <PageHeader title={"Shopping list"}/>

            <AutocompleteInputField
                label="Add to shopping list..."
                onAdd={(name, amount) => handleAdd(name, amount)}
            />

            <FoodTable
                items={foods}
                onDelete={handleDelete}
                onCheck={handleCheck}
                emptyMessage="Shopping list is empty"
            />

        </div>
    )
}