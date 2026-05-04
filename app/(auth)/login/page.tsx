"use client";



import {useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";


export default function Page(){

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/home");
        } catch (err) {
            if (err instanceof Error) {
                setError("Invalid email or password.");
            } else {
                setError("An unknown error occurred during login.");
            }
        } finally {
            setLoading(false);
        }
    }



    return(
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                    <h1 className="text-2xl font-bold">Login</h1>

                    <Input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                    <Input type="password" placeholder="Password" value={password} minLength={6} required onChange={(e) => setPassword(e.target.value)} />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button type="submit" disabled={loading} className="w-full bg-[#4A4870]">
                        {loading ? "Loading..." : "Login"}
                    </Button>

                    <p className="text-sm text-center">
                        Do not have an account yet? <Link href="/register" className="underline text-[#4A4870]">Registration</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}