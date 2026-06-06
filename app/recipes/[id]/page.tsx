"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/app/components/Pageheader";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/app/context/AuthContext";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Heart, Trash2 } from "lucide-react";
import { RecipeCard } from "@/app/components/RecipeCard";

interface RecipeDetailInfo {
    id: number;
    title: string;
    image: string;
    instructions: string;
    extendedIngredients: {
        id: number;
        original: string;
    }[];
    analyzedInstructions: {
        name: string;
        steps: {
            number: number;
            step: string;
        }[];
    }[];
}

interface SimilarRecipe {
    id: number;
    title: string;
    imageType: string;
    readyInMinutes: number;
}

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { user } = useAuth();

    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
    const url = id ? `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}` : null;

    const { data: recipeDetail, isLoading } = useSWR<RecipeDetailInfo>(url, fetcher, {
        revalidateOnFocus: false
    });

    const similarUrl = id ? `https://api.spoonacular.com/recipes/${id}/similar?number=5&apiKey=${apiKey}` : null;
    const { data: similarRecipes } = useSWR<SimilarRecipe[]>(similarUrl, fetcher, {
        revalidateOnFocus: false
    });

    const [isSaved, setIsSaved] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

    const toggleIngredient = (index: number) => {
        const newSet = new Set(checkedIngredients);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setCheckedIngredients(newSet);
    };

    useEffect(() => {
        if (!user || !id) return;

        const docRef = doc(db, "users", user.uid, "savedRecipes", id);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setIsSaved(true);
                setIsFavorite(docSnap.data().favorite === true);
            } else {
                setIsSaved(false);
                setIsFavorite(false);
            }
        });

        return () => unsubscribe();
    }, [user, id]);

    const handleToggleFavorite = async () => {
        if (!user || !isSaved) return;

        const docRef = doc(db, "users", user.uid, "savedRecipes", id);

        try {
            await updateDoc(docRef, { favorite: !isFavorite });
        } catch (error) {
            console.error("Chyba při změně oblíbených:", error);
        }
    };

    const handleRemove = async () => {
        if (!user) return;

        const confirmDelete = window.confirm("Opravdu chcete tento recept smazat z kuchařky?");
        if (!confirmDelete) return;

        const docRef = doc(db, "users", user.uid, "savedRecipes", id);

        try {
            await deleteDoc(docRef);
            router.push("/recipes");
        } catch (error) {
            console.error("Chyba při mazání receptu:", error);
        }
    };

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
            <PageHeader title={recipeDetail.title} />

            <div className="max-w-3xl mx-auto px-6">

                {isSaved && (
                    <div className="flex gap-3 mb-4 justify-start">
                        <button
                            onClick={handleToggleFavorite}
                            className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-100"
                            title={isFavorite ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
                        >
                            <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        </button>

                        <button
                            onClick={handleRemove}
                            className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors border border-slate-100"
                            title="Smazat recept"
                        >
                            <Trash2 className="w-6 h-6" />
                        </button>
                    </div>
                )}

                <div className="w-full mb-8 rounded-2xl overflow-hidden bg-slate-50 shadow-sm">
                    <img
                        src={recipeDetail.image}
                        alt={recipeDetail.title}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                </div>

                <div className="mb-10 flex flex-col gap-4">
                    {recipeDetail.extendedIngredients?.map((ingredient, index) => {
                        const isChecked = checkedIngredients.has(index);
                        return (
                            <div key={`${ingredient.id}-${index}`}>
                                <label className={`flex items-center space-x-3 font-bold text-sm md:text-base cursor-pointer transition-colors ${isChecked ? 'text-slate-400' : 'text-primary'}`}>
                                    <Checkbox 
                                        className="border-primary text-primary w-5 h-5"
                                        checked={isChecked}
                                        onCheckedChange={() => toggleIngredient(index)}
                                    />
                                    <span className={isChecked ? 'line-through' : ''}>{ingredient.original}</span>
                                </label>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <h3 className="text-primary font-bold text-lg mb-4">Instructions</h3>

                    {recipeDetail.analyzedInstructions?.[0]?.steps?.length ? (
                        <ol className="space-y-4">
                            {recipeDetail.analyzedInstructions[0].steps.map((step) => (
                                <li key={step.number} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                        {step.number}
                    </span>
                                    <p className="text-slate-700 text-sm md:text-base leading-relaxed pt-1">
                                        {step.step}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    ) : recipeDetail.instructions ? (
                        // Fallback - některé recepty nemají analyzedInstructions, takže parsujeme HTML
                        <div
                            className="text-slate-700 text-sm md:text-base leading-relaxed
                       [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-5 [&_ol]:space-y-2
                       [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5 [&_ul]:space-y-2
                       [&_li]:pl-1
                       [&_p]:my-3
                       [&_strong]:font-bold [&_strong]:text-slate-900"
                            dangerouslySetInnerHTML={{ __html: recipeDetail.instructions }}
                        />
                    ) : (
                        <p className="text-slate-400 italic text-sm">No instructions available for this recipe.</p>
                    )}
                </div>

                <div className="mt-12 mb-8">
                    <h3 className="text-primary font-bold text-xl mb-4 border-t pt-8">Similar Recipes</h3>
                    {similarRecipes ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {similarRecipes.map((sim) => (
                                <RecipeCard
                                    key={`similar-${sim.id}`}
                                    id={sim.id}
                                    title={sim.title}
                                    image={`https://img.spoonacular.com/recipes/${sim.id}-312x231.${sim.imageType || 'jpg'}`}
                                    readyInMinutes={sim.readyInMinutes}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">Loading similar recipes...</p>
                    )}
                </div>

            </div>
        </div>
    );
}