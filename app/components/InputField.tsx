"use client"


import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";

interface InputFieldProps {
    label: string;
    value?: string;
    onChange?: (val: string) => void;
    onAdd: (name: string, amount: number) => void;
}

const InputField = ({onAdd, label, value, onChange}: InputFieldProps) => {

    const [amount, setAmount] = useState(1);
    const [internalValue, setInternalValue] = useState("");

    const currentText = value !== undefined ? value : internalValue;

    const handleTextChange = (val: string) => {
        setInternalValue(val);
        onChange?.(val);
    };

    const handleInternalSubmit = () => {
        if (!currentText.trim()) return;
        onAdd(currentText, amount);
        handleTextChange("");
        setAmount(1);
    };

    return (
        <div className="flex gap-2 mb-2 items-center">
            <div className="flex items-center gap-1 border rounded-md px-2 h-10 bg-white">
                <Button variant="ghost" className="h-8 w-8 p-0"
                        onClick={() => setAmount(Math.max(1, amount - 1))}>−</Button>
                <span className="w-6 text-center text-sm font-medium">{amount}</span>
                <Button variant="ghost" className="h-8 w-8 p-0"
                        onClick={() => setAmount(amount + 1)}>+</Button>
            </div>
            <Input
                type="text"
                placeholder={label}
                className="flex-1 text-sm h-10"
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInternalSubmit()}
            />
            <Button className="h-10" onClick={handleInternalSubmit}>Add</Button>
        </div>
    )
}

export default InputField;