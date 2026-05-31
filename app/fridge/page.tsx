"use client"
import PageHeader from "@/app/components/Pageheader";
import AutocompleteInputField from "@/app/components/AutocompleteInputField";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/app/context/AuthContext";
import Link from "next/link";
import {useFridge} from "@/hooks/useFridge";
import {FoodTable} from "@/app/components/FoodTable";

export default function Page() {

    const {user} = useAuth();
    const {
        foods, 
        loading,
        handleAdd, 
        handleDelete
    } = useFridge();

    if (!user) return null;

    return (
        <div>
            <PageHeader title={"My Fridge"}/>

            <AutocompleteInputField
                label="Add to fridge..."
                onAdd={(name, amount) => handleAdd(name, amount)}
            />

            <FoodTable
                items={foods}
                onDelete={handleDelete}
                emptyMessage="Fridge is empty"
            />

            <br/>
            <br/>
            <Link href="/recipes" className="flex-1">
                <Button variant="default" className="w-full h-14.5 items-center flex justify-start p-4 font-bold">
                    Find recipes {'->'}
                </Button>
            </Link>

        </div>
    );
}