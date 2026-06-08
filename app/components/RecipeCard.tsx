"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import {Clock, Star, ArrowRight, Check, Download} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useSavedRecipes } from "@/hooks/useSavedRecipe";

interface RecipeCardProps {
    id: number;
    title: string;
    image: string;
    readyInMinutes?: number;
    rating?: number;
    category?: string;
}

export function RecipeCard({ id, title, image, readyInMinutes, rating, category }: RecipeCardProps) {
    const { user } = useAuth();
    const { savedIds, downloadRecipe } = useSavedRecipes(user?.uid);

    const isDownloaded = savedIds.includes(id);

    return (
        <Link href={`/recipes/${id}`} className="block group outline-none h-full">
            <Card className="h-full overflow-hidden border border-slate-100/80 shadow-none hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 p-0 gap-0 flex flex-col rounded-[20px] bg-white relative" >

                {user && (
                    <div className="absolute top-3 right-3 z-20">
                        {isDownloaded ? (
                            <button
                                disabled
                                onClick={(e) => e.preventDefault()}
                                className="p-2 bg-green-50/90 text-green-600 backdrop-blur-md rounded-full shadow-sm cursor-default"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadRecipe({id, title, image, readyInMinutes}).catch(console.error)
                                }}
                                className="p-2 bg-white/90 text-slate-500 hover:bg-white hover:text-slate-800 backdrop-blur-md rounded-full shadow-sm transition-all duration-200"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                <div className="aspect-4/3 w-full overflow-hidden relative shrink-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    {readyInMinutes && (
                        <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {readyInMinutes} min
                        </div>
                    )}
                </div>

                <div className="px-4.5 pt-4 pb-2 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Recept</span>
                        {rating && (
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-slate-700">{rating.toFixed(1)}</span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            </div>
                        )}
                    </div>
                    <h3 className="font-serif text-slate-900 text-[15px] leading-snug line-clamp-2 font-normal">
                        {title}
                    </h3>
                </div>

                <div className="mt-auto border-t border-slate-100 mx-0 px-4.5 py-3 flex justify-end items-center">
                    <div className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all duration-200">
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>

            </Card>
        </Link>
    );
}