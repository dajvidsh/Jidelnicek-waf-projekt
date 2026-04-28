import * as React from "react";
import Link from "next/link"; // Tento import je klíčový!
import PageHeader from "@/app/components/Pageheader";
import { Button } from "@/components/ui/button";

export default function Page() {
    const recipes = [
        { id: 1, title: "Classic Spaghetti Carbonara", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=400" },
        { id: 2, title: "Avocado Toast with Egg", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400" },
        { id: 3, title: "Spicy Thai Green Curry", img: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=400" },
        { id: 4, title: "Berry Smoothie Bowl", img: "https://images.unsplash.com/photo-1494597564530-897b7a21157c?auto=format&fit=crop&q=80&w=400" },
        { id: 5, title: "Vegetable Stir Fry", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400" },
        { id: 6, title: "Pancakes with Syrup", img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <div className="min-h-screen bg-white pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <PageHeader title={"Recipes"} />
                <div className="flex justify-center gap-4 mb-10 w-full max-w-4xl mx-auto">
                    <Link href="/fridge" className="flex-1">
                        <Button
                            variant="default"
                            size="xl"
                            className="w-full bg-[#636191] hover:bg-[#52507a] rounded-[30px] flex justify-between items-center px-8 transition-colors"
                        >
                            In fridge
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </Link>
                    <Link href="/shopping-list" className="flex-1">
                        <Button
                            variant="default"
                            size="xl"
                            className="w-full bg-[#636191] hover:bg-[#52507a] rounded-[30px] flex justify-between items-center px-8 transition-colors"
                        >
                            Shopping list
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </Link>

                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="group cursor-pointer border border-slate-100 rounded-[24px] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all bg-white"
                        >
                            <div className="aspect-[4/3] w-full overflow-hidden">
                                <img
                                    src={recipe.img}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recipes</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-slate-700">5.0</span>
                                        <span className="text-yellow-400 text-xs">★</span>
                                    </div>
                                </div>
                                <h3 className="text-[#4A4870] font-bold text-sm md:text-base leading-tight">
                                    {recipe.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}