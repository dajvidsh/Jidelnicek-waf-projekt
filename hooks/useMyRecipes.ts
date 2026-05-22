"use client"

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";


export interface Recipe {
    id: number;
    title: string;
    image?: string;
    img?: string;
    readyInMinutes?: number;
    rating?: number;
    category?: string;
    favorite?: boolean;
    downloadedAt?: string;
}

export function useMyRecipes(userId: string | undefined | null) {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [loadingCookbook, setLoadingCookbook] = useState(true);

    useEffect(() => {
        if (!userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoadingCookbook(false);
            return;
        }

        const savedRef = collection(db, "users", userId, "savedRecipes");
        const q = query(savedRef, orderBy("downloadedAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recipesData = snapshot.docs.map((doc) => doc.data() as Recipe);
            setSavedRecipes(recipesData);
            setLoadingCookbook(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { savedRecipes, loadingCookbook };
}