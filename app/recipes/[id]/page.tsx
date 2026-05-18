"use client";

import {useParams} from "next/navigation";
import PageHeader from "@/app/components/Pageheader";
import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {useAuth} from "@/app/context/AuthContext";
import useSWR from "swr";
import {fetcher} from "@/lib/fetcher";

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
    const {user} = useAuth();
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const url = id ? `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}` : null;

    const {data: recipeDetail, isLoading} = useSWR<RecipeDetailInfo>(url, fetcher, {
        revalidateOnFocus: false
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <p className="text-slate-500 font-medium">Loading recipe...</p>
            </div>
        );
    }

    if (!user || !recipeDetail) return null;

    return (
        <div className="bg-white min-h-screen pb-10">

            <PageHeader title={recipeDetail.title}/>

            <div className="max-w-3xl mx-auto px-6">

                <div className="w-full mb-8 rounded-2xl overflow-hidden bg-slate-50 shadow-sm">
                    <img
                        src={recipeDetail.image}
                        alt={recipeDetail.title}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                </div>

                <div className="mb-10 flex flex-col gap-4">
                    {recipeDetail.extendedIngredients?.map((ingredient, index) => (
                        <div key={`${ingredient.id}-${index}`}>
                            <label
                                className="flex items-center space-x-3 text-primary font-bold text-sm md:text-base cursor-pointer">
                                <Checkbox className="border-primary text-primary w-5 h-5"/>
                                <span>{ingredient.original}</span>
                            </label>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-primary font-bold text-lg mb-3">Instructions</h3>

                    <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
                        {recipeDetail.instructions}
                    </div>
                </div>

            </div>
        </div>
    );

}