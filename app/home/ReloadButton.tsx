"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReloadButton() {
    const router = useRouter();

    return (
        <Button
            variant="link"
            className="font-medium px-0 hover:no-underline"
            onClick={() => router.refresh()}
        >
            reload
        </Button>
    );
}