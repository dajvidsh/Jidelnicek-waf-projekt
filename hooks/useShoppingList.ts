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
    const [itemName, setItemName] = useState("");
    const [suggestions, setSuggestions] = useState<{ id: number; name: string; image: string }[]>([]);
    const [loading, setLoading] = useState(true); // Přidaný stav pro indikaci stahování dat

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

    useEffect(() => {
        if (itemName.trim().length <= 2) {
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${itemName}&number=5&apiKey=${API_KEY}`);
                const data = await res.json();
                if (Array.isArray(data)) setSuggestions(data);
            } catch (e) {
                console.error("Spoonacular error:", e);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [itemName]);

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
            setItemName("");
            setSuggestions([]);
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
        itemName,
        setItemName,
        suggestions,
        setSuggestions,
        handleAdd,
        handleDelete,
        handleCheck
    };
};