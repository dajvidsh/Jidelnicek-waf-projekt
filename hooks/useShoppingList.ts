import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";

export interface FoodItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export const useShoppingList = () => {
    const { user } = useAuth();

    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "shoppingList"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
                setFoods(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FoodItem)));
                setLoading(false);
            },
            (error) => {
                console.error("Chyba při stahování seznamu:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);


    const handleAdd = async (name: string, amount: number) => {
        if (!name.trim() || !user) return;
        const normalized = name.charAt(0).toUpperCase() + name.slice(1);
        try {
            await addDoc(collection(db, "shoppingList"), {
                name: normalized,
                amount,
                unit: "ks",
                createdAt: new Date(),
                userId: user.uid
            });
        } catch (e) {
            console.error("Error adding item:", e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "shoppingList", id));
        } catch (e) {
            console.error("Error deleting item:", e);
        }
    };

    const handleCheck = async ({ id, name, amount, unit }: FoodItem) => {
        if (!user) return;

        try {
            await addDoc(collection(db, "fridge"), {
                name,
                amount,
                unit,
                createdAt: new Date(),
                userId: user.uid
            });
            await deleteDoc(doc(db, "shoppingList", id));
        } catch (e) {
            console.error("Error checking item:", e);
        }
    };

    return {
        foods,
        loading,
        handleAdd,
        handleDelete,
        handleCheck
    };
};