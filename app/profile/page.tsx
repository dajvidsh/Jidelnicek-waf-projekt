"use client";


import {useAuth} from "@/app/context/AuthContext";
import PageHeader from "@/app/components/Pageheader";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface UserData{
    name: string;
    surname: string;
    email: string;
    imageUrl: string;
}

export default function Page() {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData>();
    const [fridgeCount, setFridgeCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) return;

            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data() as UserData);
                }

                const fridgeRef = collection(db, "fridge");
                const q = query(fridgeRef);
                const fridgeSnap = await getDocs(q);

                let totalAmount = 0;
                fridgeSnap.forEach((doc) => {
                    const data = doc.data();
                    totalAmount += Number(data.amount) || 0;
                });

                setFridgeCount(totalAmount);
                // setFridgeCount(fridgeSnap.size); tohle je pocet rozdilnych itemu, zalezi co chcem(ignoruje ks)
            } catch (err){
                console.error("Error while fetching data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData().catch(console.error)
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error while logout:", error);
        }
    };

    if (loading) return <div className="flex justify-center mt-10">Loading profile...</div>;
    if (!user) return null;

    return (
        <div>
            <PageHeader title={"Profile"} onLogout={handleLogout} />

            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">

                <div className="relative">
                    {userData?.imageUrl ? (
                        <img
                            src={userData.imageUrl}
                            alt="Profile"
                            className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-[#4A4870] flex items-center justify-center text-white text-3xl font-bold">
                            {userData?.name[0]}{userData?.surname[0]}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-[#4A4870]">
                        {userData?.name} {userData?.surname}
                    </h1>
                    <p className="text-gray-500 text-lg">
                        {userData?.email}
                    </p>
                </div>

                <div className="py-8">
                    <h2 className="text-2xl font-semibold text-[#4A4870] mb-2">
                        Number of items <br /> in fridge
                    </h2>
                    <span className="text-6xl font-bold text-[#4A4870]">
                    {fridgeCount}
                </span>
                </div>

                <Button
                    className="bg-[#636191] hover:bg-[#4A4870] text-white px-10 py-6 rounded-full text-lg flex items-center gap-2 transition-all w-full max-w-xs"
                >
                    Edit profile <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}