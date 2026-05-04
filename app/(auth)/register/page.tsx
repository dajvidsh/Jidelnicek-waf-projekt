"use client";


import {useState} from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/login");
        } catch (err) {
            if (err instanceof Error) {
                setError("Error: " + err.message);
            } else {
                setError("An unknown error occurred during registration.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold">Create account</h1>

                <Input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} minLength={6} required onChange={(e) => setPassword(e.target.value)} />
                <Input type="password" placeholder="Confirm password" value={passwordConfirm} minLength={6} required onChange={(e) => setPasswordConfirm(e.target.value)} />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" disabled={loading} className="w-full bg-[#4A4870]">
                    {loading ? "Loading..." : "Register"}
                </Button>

                <p className="text-sm text-center">
                    You already have an account? <Link href="/login" className="underline text-[#4A4870]">Login</Link>
                </p>
            </form>
        </div>
    )
}