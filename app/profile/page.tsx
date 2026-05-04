"use client";


import {useAuth} from "@/app/context/AuthContext";

export default function Page() {
    const { user } = useAuth();


    if (!user) return null;

    return (
        <div>
            <h1>Profile</h1>
        </div>
    )
}