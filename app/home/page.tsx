import React from 'react';
import {Button} from "@/components/ui/button"
import Link from "next/link";

function Home() {
    return (
        <div className="max-w-4xl mx-auto p-6 mt-8">

            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                What will you cook today?
            </h1>

            <div className="flex gap-1">
                <Link href={'/fridge'} className="flex-1">
                    <Button variant="default" size="xl" className="w-full">Fridge</Button>
                </Link>
                <Link href={'/recipes'} className="flex-1">
                    <Button variant="outline" size="xl" className="w-full">Recipes</Button>
                </Link>
            </div>

        </div>
    );
}

export default Home;