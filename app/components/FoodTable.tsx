"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

export interface FoodItemType {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

interface FoodTableProps {
    items: FoodItemType[];
    emptyMessage: string;
    onDelete: (id: string) => void;
    onCheck?: (item: FoodItemType) => void;
}

export function FoodTable({ items, emptyMessage, onDelete, onCheck }: FoodTableProps) {
    const hasCheckColumn = !!onCheck;

    return (
        <div className="border border-slate-100/80 rounded-[20px] bg-white overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-slate-100">
                        {hasCheckColumn && <TableHead className="w-10" />}
                        <TableHead className="h-10 px-4 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                            Name
                        </TableHead>
                        <TableHead className="h-10 px-4 text-right text-[10px] font-medium uppercase tracking-widest text-slate-400">
                            Amount
                        </TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <TableRow
                                key={item.id}
                                className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                            >
                                {hasCheckColumn && (
                                    <TableCell className="w-10 pr-0 pl-4">
                                        <Checkbox
                                            onCheckedChange={() => onCheck(item)}
                                            className="border-slate-200 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-[5px]"
                                        />
                                    </TableCell>
                                )}

                                <TableCell className="px-4 py-3.5 font-medium text-sm text-slate-900">
                                    {item.name}
                                </TableCell>

                                <TableCell className="px-4 py-3.5 text-right tabular-nums">
                                    <span className="text-sm font-medium text-slate-800">{item.amount}</span>
                                    <span className="ml-1 text-[11px] text-slate-400">{item.unit}</span>
                                </TableCell>

                                <TableCell className="w-10 px-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onDelete(item.id)}
                                        className="h-8 w-8 rounded-lg border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all duration-150"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={hasCheckColumn ? 4 : 3}
                                className="text-center py-12 text-sm italic text-slate-400"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}