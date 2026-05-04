"use client"
import {useEffect, useState} from "react";
import {db} from "@/lib/firebase";
import {addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query} from "firebase/firestore";
import PageHeader from "@/app/components/Pageheader";
import InputField from "@/app/components/InputField";
import {Button} from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import Link from "next/link";

interface FoodItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

export default function Page() {

    const { user } = useAuth();
    const [foods, setFoods] = useState<FoodItem[]>([]);

    useEffect(() => {
        const q = query(collection(db, "fridge"), orderBy("createdAt", "desc"));

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
            await addDoc(collection(db, "fridge"), {
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
        await deleteDoc(doc(db, "fridge", id));
    };
    if (!user) return null;

    return (
        <div>
            <PageHeader title={"My Fridge"}/>

            <InputField label={"Add to fridge..."} onAdd={(name, amount) => handleAdd(name, amount)}></InputField>

            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="h-12 px-6 font-semibold text-slate-900">
                            Name
                        </TableHead>
                        <TableHead className="h-12 px-6 text-right font-semibold text-slate-900">
                            Amount
                        </TableHead>
                        {/*<TableHead>Unit</TableHead>*/}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {foods.length > 0 ? (
                        foods.map((food) => (
                            <TableRow
                                key={food.id}
                                className="group transition-colors hover:bg-slate-50/80 border-b last:border-0"
                            >
                                <TableCell className="px-6 py-4">
                                    {food.name}
                                </TableCell>
                                <TableCell
                                    className="px-6 py-4 text-right font-mono text-sm text-slate-500 tabular-nums">
                                    {food.amount}{food.unit}
                                </TableCell>
                                {/*<TableCell>{food.unit}</TableCell>*/}
                                <TableCell>
                                    <Button variant="ghost" onClick={() => handleDelete(food.id)}><span
                                        className={"text-red-700"}>X</span></Button>
                                </TableCell>
                            </TableRow>
                        ))) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                Fridge is empty
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <br/>
            <br/>
            <Link href="/recipes" className="flex-1">
            <Button variant={'default'} className="w-full h-14.5 items-center flex justify-start p-4 font-bold">Find
                recipes {'->'}</Button></Link>

        </div>
    );
}