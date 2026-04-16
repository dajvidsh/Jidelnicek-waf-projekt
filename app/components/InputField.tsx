"use client"


import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";

interface InputFieldProps {
    label: string;
    onAdd: (name: string, amount: number) => void;
}

const InputField = ({onAdd, label}: InputFieldProps) => {

    const [itemName, setItemName] = useState("");
    const [amount, setAmount] = useState(1);

    const handleInternalSubmit = () => {
        if (!itemName.trim()) return;
        onAdd(itemName, amount);
        setItemName("");
        setAmount(1);
    };

    return (
        <div className="flex gap-2 mb-6 items-center">
            <div className="flex items-center gap-1 border rounded-md px-2">
                <Button variant="secondary" className="bg-transparent px-1"
                        onClick={() => setAmount(Math.max(1, amount - 1))}>−</Button>
                <span className="w-6 text-center">{amount}</span>
                <Button variant="secondary" className="bg-transparent px-1"
                        onClick={() => setAmount(amount + 1)}>+</Button>
            </div>
            <Input
                type="text"
                placeholder={label}
                className="flex-1 text-sm"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <Button onClick={handleInternalSubmit}>Add</Button>
        </div>
    )
}

export default InputField;