"use client";

import { useAuth } from "@/app/context/AuthContext";
import PageHeader from "@/app/components/Pageheader";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";


export default function Page() {
    const { user } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            if (!user?.uid) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name || "");
                    setSurname(data.surname || "");
                }
            } catch (err) {
                console.error("Error while loading: ", err);
            } finally {
                setLoading(false);
            }
        };
        loadUserData().catch(console.error);
    }, [user]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.uid) return;

        setSaving(true);
        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                name: name,
                surname: surname,
            });
            router.push("/profile");
        } catch (err) {
            console.error("Error while loading:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading data...</div>;
    if (!user) return null;

    return (
        <div>
            <PageHeader title="Edit Profile" />

            <div className="max-w-md mx-auto mt-10 px-4">
                <form onSubmit={handleSave} className="space-y-6">

                    <Field orientation="vertical">
                        <FieldLabel>Name</FieldLabel>
                        <FieldContent>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Enter name"
                            />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel>Surname</FieldLabel>
                        <FieldContent>
                            <Input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                                placeholder="Enter surname"
                            />
                        </FieldContent>
                    </Field>

                    <Button
                        type="submit"
                        disabled={saving}
                        size="xl"
                        className="w-full text-white rounded-lg mt-4"
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </Button>
                </form>
            </div>
        </div>
    );
}