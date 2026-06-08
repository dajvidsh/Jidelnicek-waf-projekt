"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { Heart, Trash2 } from "lucide-react";

export default function RecipeActions({ id }: { id: string }) {
    const router = useRouter();
    const { user } = useAuth();

    const [isSaved, setIsSaved] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

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
        await updateDoc(docRef, { favorite: !isFavorite });
    };

    const handleRemove = async () => {
        if (!user) return;
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        const docRef = doc(db, "users", user.uid, "savedRecipes", id);
        await deleteDoc(docRef);
        router.push("/recipes");
    };

    if (!user || !isSaved) return null;

    return (
        <div className="flex gap-3 mb-4 justify-start">
            <button
                onClick={handleToggleFavorite}
                className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors border border-slate-100"
                title={isFavorite ? "Remove from favourites" : "Add to favourites"}
            >
                <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </button>

            <button
                onClick={handleRemove}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors border border-slate-100"
                title="Delete recipe"
            >
                <Trash2 className="w-6 h-6" />
            </button>
        </div>
    );
}