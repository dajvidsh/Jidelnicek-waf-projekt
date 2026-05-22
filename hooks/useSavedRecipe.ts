import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

export interface SavedRecipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes?: number;
}

export function useSavedRecipes(userId: string | undefined | null) {
    const [savedIds, setSavedIds] = useState<number[]>([]);

    useEffect(() => {
        if (!userId) return;

        const savedRef = collection(db, "users", userId, "savedRecipes");

        const unsubscribe = onSnapshot(savedRef, (snapshot) => {
            const ids = snapshot.docs.map((doc) => Number(doc.id));
            setSavedIds(ids);
        });

        return () => unsubscribe();
    }, [userId]);

    const downloadRecipe = async (recipe: SavedRecipe) => {
        if (!userId) return;

        if (savedIds.includes(recipe.id)) return;

        const recipeRef = doc(db, "users", userId, "savedRecipes", recipe.id.toString());

        try {
            await setDoc(recipeRef, {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                readyInMinutes: recipe.readyInMinutes || null,
                favorite: false,
                downloadedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Chyba při ukládání receptu:", error);
        }
    };

    return { savedIds, downloadRecipe };
}