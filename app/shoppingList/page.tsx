"use client"

import PageHeader from "@/app/components/Pageheader";
import InputField from "@/app/components/InputField";
import {addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "@/lib/firebase";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


interface FoodItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

export default function Page() {

    const [foods, setFoods] = useState<FoodItem[]>([]);

    useEffect(() => {
        const q = query(collection(db, "shoppingList"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<FoodItem, 'id'>)
            })) as FoodItem[];

            setFoods(allItems);
        });

        return () => unsubscribe();
    }, []);

    const handleAdd = async (itemName: string, amount: number) => {
        if (!itemName.trim()) return;

        try {
            await addDoc(collection(db, "shoppingList"), {
                name: itemName,
                amount: amount,
                unit: "ks",
                createdAt: new Date()
            });
        } catch (e) {
            console.error("Error adding ", e);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "shoppingList", id));
    };

    const handleCheck = async (food: FoodItem) => {
        try {
            await addDoc(collection(db, "fridge"), {
                name: food.name,
                amount: food.amount,
                unit: food.unit,
                createdAt: new Date()
            });

            await deleteDoc(doc(db, "shoppingList", food.id));
        } catch (e) {
            console.error("Error adding to fridge", e);
        }
    };

    return (
        <div>
            <PageHeader title={"Shopping list"}/>

            <InputField label={"Add to shopping list..."} onAdd={(name, amount) => handleAdd(name, amount)}/>

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
                                    <Button variant="ghost" onClick={() => handleCheck(food)}><span><Checkbox /></span></Button>
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