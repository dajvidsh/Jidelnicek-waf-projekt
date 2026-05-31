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

export const useFridge = () => {
    const { user } = useAuth();
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "fridge"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data())
            })) as FoodItem[];

            setFoods(allItems);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);



    const handleAdd = async (name: string, amount: number) => {
        if (!name.trim() || !user) return;
        const normalized = name.charAt(0).toUpperCase() + name.slice(1);
        try {
            await addDoc(collection(db, "fridge"), {
                name: normalized,
                amount: amount,
                unit: "ks",
                createdAt: new Date(),
                userId: user.uid
            });
        } catch (e) {
            console.error("Error adding ", e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "fridge", id));
        } catch (e) {
            console.error("Error deleting ", e);
        }
    };

    return { foods, loading, handleAdd, handleDelete };
};