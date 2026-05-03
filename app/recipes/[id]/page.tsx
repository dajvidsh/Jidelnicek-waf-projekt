"use client";

import { useParams} from "next/navigation";
import PageHeader from "@/app/components/Pageheader";
import { useEffect, useState } from "react";

interface RecipeDetailInfo {
    id: number;
    title: string;
    image: string;
    instructions: string;
    extendedIngredients: {
        id: number;
        original: string;
    }[];
}

export default function Page() {

    const params = useParams();
    const id = params.id;

    const [recipeDetail, setRecipeDetail] = useState<RecipeDetailInfo | null>(null);

    useEffect(() => {
        if (id == null) return;

        const fetchDetail = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
                const response = await fetch(
                    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
                )
                const data = await response.json();
                setRecipeDetail(data);
            }catch(err) {
                console.log("Error loading data into recipe details",err);
            }
        }
        fetchDetail().catch(console.error);
    },[id])

    if (!recipeDetail) {
        return <div className="text-center py-20">Loading...</div>;
    }


    return (
        <div>
            <PageHeader title="Recipe Details"/>
            <p>ID je: {id}</p>
        </div>
    );

}