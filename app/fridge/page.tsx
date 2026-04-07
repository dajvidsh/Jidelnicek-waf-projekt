"use client"
import PageHeader from "@/app/components/Pageheader";
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell, TableHead, TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useState} from "react";

export default function Page() {

    const [amount, setAmount] = useState(0)

    interface FoodItem {
        id: string;
        name: string;
        amount: string;
        unit: string
    }

    const foods: FoodItem[] = [
        {id: "1", name: "Vejce", amount: "10", unit: ""},
        {id: "2", name: "Mléko", amount: "1", unit: "l"},
        {id: "3", name: "Kuřecí prsa", amount: "500", unit: "g"},
        {id: "4", name: "Cibule", amount: "3", unit: ""},
        {id: "5", name: "Rýže", amount: "1", unit: "g"},
    ];

    return (
        <div>
            <PageHeader title={"My Fridge"}/>

            <div className="flex gap-2 mb-6 items-center">
                <div className="flex items-center gap-1 border rounded-md px-2">
                    <Button variant="secondary" className="bg-transparent px-1" onClick={ () => setAmount(Math.max(0, amount - 1))}>−</Button>
                    <span className="w-6 text-center">{amount}</span>
                    <Button variant="secondary" className="bg-transparent px-1" onClick={() => setAmount(amount + 1)}>+</Button>
                </div>
                <Input type="search" placeholder="Add to fridge..." className="flex-1 text-sm"/>
                <Button>Add</Button>
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
                    {foods.map((food, i) => (
                        <TableRow
                            key={i}
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
                                <Button variant="ghost"><span className={"text-red-700"}>X</span></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    );
}