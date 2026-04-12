"use client"
import {useEffect, useState} from "react";
import { db } from "@/lib/firebase";
import {addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import PageHeader from "@/app/components/Pageheader";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

interface FoodItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

export default function Page() {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [itemName, setItemName] = useState("");
    const [amount, setAmount] = useState(1);

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

    const handleAdd = async () => {
        if (!itemName.trim()) return;

        try {
            await addDoc(collection(db, "fridge"), {
                name: itemName,
                amount: amount,
                unit: "ks",
                createdAt: new Date()
            });
            setItemName("");
            setAmount(1);
        } catch (e) {
            console.error("Error adding ", e);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "fridge", id));
    };

    return (
        <div>
            <PageHeader title={"My Fridge"}/>

            <div className="flex gap-2 mb-6 items-center">
                <div className="flex items-center gap-1 border rounded-md px-2">
                    <Button variant="secondary" className="bg-transparent px-1" onClick={() => setAmount(Math.max(1, amount - 1))}>−</Button>
                    <span className="w-6 text-center">{amount}</span>
                    <Button variant="secondary" className="bg-transparent px-1" onClick={() => setAmount(amount + 1)}>+</Button>
                </div>
                <Input
                    type="text"
                    placeholder="Add to fridge..."
                    className="flex-1 text-sm"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <Button onClick={handleAdd}>Add</Button>
            </div>

            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="h-12 px-6 font-semibold text-slate-900">
                            Name
                        </TableHead>
                        <TableHead className="h-12 px-6 text-right font-semibold text-slate-900">
                            Amount
                        </TableHead>
                        <TableHead>Unit</TableHead>
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
                            <TableCell className="px-6 py-4 text-right font-mono text-sm text-slate-500 tabular-nums">
                                {food.amount}
                            </TableCell>
                            <TableCell>{food.unit}</TableCell>
                            <TableCell>
                                <Button variant="ghost" onClick={() => handleDelete(food.id)}><span className={"text-red-700"}>X</span></Button>
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

        </div>
    );
}