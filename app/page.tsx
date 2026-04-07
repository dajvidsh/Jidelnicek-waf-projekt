import React from 'react';
import {Button} from "@/components/ui/button"

function Home() {
    return (
        <div className="max-w-4xl mx-auto p-6 mt-8">

            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                What will you cook today?
            </h1>

            <Button variant="destructive">Button</Button>

        </div>
    );
}

export default Home;