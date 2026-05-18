// hooks/useProfile.ts
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@/app/context/AuthContext";

export interface UserData {
    name: string;
    surname: string;
    email: string;
    imageUrl: string;
}

export const useProfile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData>();
    const [fridgeCount, setFridgeCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) return;

            try {
                setLoading(true);
                // 1. Načtení informací o uživateli
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data() as UserData);
                }

                const fridgeRef = collection(db, "fridge");
                const q = query(fridgeRef, where("userId", "==", user.uid));
                const fridgeSnap = await getDocs(q);

                let totalAmount = 0;
                fridgeSnap.forEach((doc) => {
                    const data = doc.data();
                    totalAmount += Number(data.amount) || 0;
                });

                setFridgeCount(totalAmount);
            } catch (err) {
                console.error("Error while fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData().catch(console.error);
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error while logout:", error);
        }
    };

    return { userData, fridgeCount, loading, handleLogout };
};