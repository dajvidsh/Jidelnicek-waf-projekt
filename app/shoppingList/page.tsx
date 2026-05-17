"use client"

import PageHeader from "@/app/components/Pageheader";
import InputField from "@/app/components/InputField";
import {addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "@/lib/firebase";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {useAuth} from "@/app/context/AuthContext";


interface FoodItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export default function Page() {

    const { user } = useAuth()
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [itemName, setItemName] = useState("");
    const [suggestions, setSuggestions] = useState<{ id: number; name: string; image: string }[]>([]);

    // Firebase listener
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "shoppingList"),
            where("userId","==", user?.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
                setFoods(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FoodItem)));
            },
            (error) => {
                console.error("Chyba při stahování seznamu:", error);
            }
        );

        return () => unsubscribe();

    }, [user]);

    // Spoonacular autocomplete
    useEffect(() => {
        if (itemName.trim().length <= 2) {
            return
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
        await addDoc(collection(db, "shoppingList"), { name: normalized, amount, unit: "ks", createdAt: new Date(), userId: user?.uid });
        setItemName("");
        setSuggestions([]);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "shoppingList", id));
    };

    const handleCheck = async ({ id, name, amount, unit }: FoodItem) => {
        await addDoc(collection(db, "fridge"), { name, amount, unit, createdAt: new Date(), userId: user?.uid });
        await deleteDoc(doc(db, "shoppingList", id));
    };

    if (!user) return null;
    return (
        <div>
            <PageHeader title={"Shopping list"}/>

            <div className="relative mb-6">
                <InputField
                    label="Add to shopping list..."
                    value={itemName}
                    onChange={(val) => {
                        setItemName(val);
                        if (val.trim().length <= 2) {
                            setSuggestions([]);
                        }
                    }}
                    onAdd={(name, amount) => handleAdd(name, amount)}
                />

                {suggestions.length > 0 && (
                    <div className="absolute z-50 w-full top-11.25 bg-white border rounded-md shadow-xl overflow-hidden">
                        {suggestions.map((s, index) => (
                            <div
                                key={`${s.id}-${index}`}
                                className="px-4 py-3 hover:bg-slate-100 cursor-pointer flex items-center justify-between border-b last:border-0"
                                onClick={() => { setItemName(s.name); setSuggestions([]); }}
                            >
                                <span className="capitalize text-sm font-medium text-slate-700">{s.name}</span>
                                <img src={`https://spoonacular.com/cdn/ingredients_100x100/${s.image}`} className="w-8 h-8 object-contain bg-slate-50 rounded p-1" alt={s.name} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="h-12 px-6 font-semibold text-slate-900">

                        </TableHead>
                        <TableHead className="h-12 px-6 font-semibold text-slate-900">
                            Name
                        </TableHead>
                        <TableHead className="h-12 px-6 text-right font-semibold text-slate-900">
                            Amount
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {foods.length > 0 ? (
                        foods.map((food) => (
                            <TableRow
                                key={food.id}
                                className="group transition-colors hover:bg-slate-50/80 border-b last:border-0"
                            >
                                <TableCell>
                                    <div
                                        className="cursor-pointer p-2"
                                        onClick={() => handleCheck(food)}
                                    >
                                        <Checkbox />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {food.name}
                                </TableCell>
                                <TableCell
                                    className="px-6 py-4 text-right font-mono text-sm text-slate-500 tabular-nums">
                                    {food.amount}{food.unit}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" onClick={() => handleDelete(food.id)}><span
                                        className={"text-red-700"}>X</span></Button>
                                </TableCell>
                            </TableRow>
                        ))) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                Shopping list is empty
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </div>
    )
}