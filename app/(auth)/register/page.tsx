"use client";


import {useState} from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Page(){

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const router = useRouter();

    const handleGoogleRegister = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName?.split(" ")[0] || "User",
                    surname: user.displayName?.split(" ").slice(1).join(" ") || "",
                    imageUrl: user.photoURL || "",
                    email: user.email,
                    createdAt: new Date()
                });
            }

            router.push("/home");
        } catch (err) {
            setError("Google registration failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user

            console.log("1.userCredential");

            await setDoc(doc(db,"users",user.uid),{
                name: name,
                surname: surname,
                imageUrl: "",
                email: email,
                createdAt: new Date()
            })
            console.log("2.setDoc");

            router.push("/home");

            console.log("3.push login");
        } catch (err) {
            const error = err as { code?: string };
            if (error.code === "auth/email-already-in-use") {
                setError("This email is already registered. Try logging in.");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email address format.");
            } else if (error.code === "auth/weak-password") {
                setError("The password is too weak. It must be at least 6 characters long.");
            } else {
                setError("There was an error while registering. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold">Create account</h1>

                <Input type="text" placeholder="Name" value={name} required onChange={(e) => setName(e.target.value)} />
                <Input type="text" placeholder="Surname" value={surname} required onChange={(e) => setSurname(e.target.value)} />
                <Input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} minLength={6} required onChange={(e) => setPassword(e.target.value)} />
                <Input type="password" placeholder="Confirm password" value={passwordConfirm} minLength={6} required onChange={(e) => setPasswordConfirm(e.target.value)} />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" disabled={loading} className="w-full bg-[#4A4870]">
                    {loading ? "Loading..." : "Register"}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleRegister}
                    disabled={loading}
                    className="w-full border-[#4A4870] text-[#4A4870]"
                >
                    Register with Google
                </Button>

                <p className="text-sm text-center">
                    You already have an account? <Link href="/login" className="underline text-[#4A4870]">Login</Link>
                </p>
            </form>
        </div>
    )
}